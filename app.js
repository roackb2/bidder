var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');

var stringify = require('stringify')
var uuid = require('node-uuid');
var Promise = require('bluebird')
var redis = require('redis');

var Product = require('./lib/product')

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);
var _ = require("lodash")

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
var redisClient = redis.createClient('6379', process.env.REDIS_CLUSTER);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// module.exports = app;

// setup socket.io
io.on('connection', function(socket) {
    username = uuid.v1();
    userID = undefined
    console.log('a user connected with username: ' + username);
    // generate unique (incremental) userID
    redisClient.incrAsync("next_user_id").then(function(res) {
        userID = res
            // store user data using hash
        return redisClient.hmsetAsync("user:" + userID, [
            "username", username,
            "balance", 100
        ])
    }).then(function(res) {
        // index userID with username
        return redisClient.hsetAsync("users", [username, userID])
    }).then(function(res) {
        socket.emit("username", username)
        promises = []
        userItems = []
        for (var i = 0; i < 10; i++) {
            item = Product.GetRandomItem()
            userItems.push(item)
            // generate unique (incremental) item id
            promises.push(Promise.join(redisClient.incrAsync("next_item_id"), item).spread(function(id, item) {
                item.id = id
                return Promise.all([
                    // store new item with hash
                    redisClient.hmsetAsync("items:" + item.id, [
                        "name", item.name,
                        "owner", item.owner,
                        "createdAt", item.createdAt,
                        "price", item.price,
                        "published", item.published,
                        "sold", item.sold
                    ]),
                    // mark ownership of an item of a user with sorted set
                    redisClient.zaddAsync("assets:" + item.owner, [item.createdAt, item.id])
                ])
            }))
        }
        socket.emit('user-items', userItems)
        return Promise.all(promises)
    }).then(function() {
        return redisClient.keysAsync("assets:*")
    }).then(function(keys) {
        return Promise.map(keys, function(key) {
            userId = key.replace("assets:", "")
            return Promise.join(redisClient.hgetallAsync("user:" + userId), redisClient.zrangeAsync("assets:" + userId, 0, -1)).spread(function(user, assets) {
                console.log("user: " + stringify(user))
                console.log("assets: " + stringify(assets))
                return Promise.join(user, Promise.map(assets, function(itemID) {
                    return redisClient.hgetallAsync("items:" + itemID)
                })).spread(function(user, items) {
                    return {
                        user: user,
                        items: items
                    }
                })
            })
        })
    }).then(function(otherItems) {
        socket.emit("other-items", otherItems)
        console.log("done setting up user data")
    }).catch(function(err) {
        console.log(err)
    })

    socket.on("sell", function(item) {
        // TODO: save published items in Redis
        console.log("user selling item " + stringify(item))
    })

    socket.on('start message', function(msg) {
        console.log('user send start message: ' + msg)
    })

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('close', function() {
        console.log('socket closed');
    });

});

// setup redis
redisClient.on("ready", function() {
    console.log("redis ready")
})

redisClient.on("error", function(error) {
    console.log("redis error: " + error);
});

// setup RabbitMQ
function genAmqpUrl(conf) {
    return "amqp://" + conf.user + ":" + conf.password + "@" + conf.host + ":" + conf.port + "/" + conf.vhost
}
var amqp = require('amqplib');
var amqpConn = null;
var amqpUrl = genAmqpUrl({
    host: process.env.RABBIT_HOST,
    port: 5672,
    user: process.env.RABBIT_USER,
    password: process.env.RABBIT_PASSWORD,
    vhost: process.env.RABBIT_VHOST
})
console.log("connecting to RabbitMQ: " + amqpUrl)

amqp.connect(amqpUrl).then(function(conn) {
    conn.on("error", function(err) {
        if (err.message !== "Connection closing") {
            console.error("[AMQP] conn error", err.message);
        }
    });
    conn.on("close", function() {
        console.error("[AMQP] reconnecting");
    });
    console.log("[AMQP] connected");
    amqpConn = conn;
}).catch(function(err) {
    console.log("amqp error: " + err)
});

// http.listen(80, function() {
//     console.log('server listening on *:80');
// });


// handling signals if process is PID1 in containers
var signals = {
    'SIGINT': 2,
    'SIGTERM': 15
};

function shutdown(signal, value) {
    redisClient.quit()
    io.close()
    console.log('server stopped by ' + signal);
    process.exit(128 + value);
}

Object.keys(signals).forEach(function(signal) {
    process.on(signal, function() {
        shutdown(signal, signals[signal]);
    });
});
