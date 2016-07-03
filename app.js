var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var bluebird = require('bluebird')
var redis = require('redis');

// handling signals if process is PID1 in containers
var signals = {
    'SIGINT': 2,
    'SIGTERM': 15
};

function shutdown(signal, value) {
    io.close(function() {
        console.log('server stopped by ' + signal);
        process.exit(128 + value);
    });
}

Object.keys(signals).forEach(function(signal) {
    process.on(signal, function() {
        shutdown(signal, signals[signal]);
    });
});

// setup socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('start message', function(msg) {
        console.log('user send start message: ' + msg)
    })

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

// setup redis
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var redisClient = redis.createClient('6379', process.env.REDIS_CLUSTER);

redisClient.on("ready", function() {
    console.log("redies ready")
})

redisClient.on("error", function(error) {
    console.log(error);
});

// setup RabbitMQ
var amqp = require('amqp');
var rabbitConn = amqp.createConnection({
    host: process.env.RABBIT_HOST,
    port: 5672,
    login: process.env.RABBIT_USER,
    password: process.env.RABBIT_PASSWORD,
    connectionTimeout: 10000,
    authMechanism: 'AMQPLAIN',
    vhost: process.env.RABBIT_VHOST,
    noDelay: true,
    ssl: {
        enabled: false
    }
});

rabbitConn.on('error', function(e) {
    console.log("Error from amqp: ", e);
});

// Wait for connection to become established.
rabbitConn.on('ready', function() {
    console.log("rabbit ready")
        // // Use the default 'amq.topic' exchange
        // rabbitConn.queue('my-queue', function (q) {
        //     // Catch all messages
        //     q.bind('#');
        //
        //     // Receive messages
        //     q.subscribe(function (message) {
        //       // Print messages to stdout
        //       console.log(message);
        //     });
        // });
});

var app = express();
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

http.listen(3000, function() {
    console.log('server listening on *:3000');
});
