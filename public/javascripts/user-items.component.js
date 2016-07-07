app.component('userItems', {
    templateUrl: 'html/user-items.html',
    controller: function UserItemsController($scope, socket) {
        var ctrl = this
        socket.on('user-items', function(items) {
            ctrl.items = items
        })

        ctrl.sell = function(item) {
            if(!item.price || item.price < 0) {
                alert("item price must be greater than zero")
                return
            }
            delete item.$$hashKey
            item.published = true
            console.log(item)
            socket.emit("sell", item)
        }
    }
});
