app.component('otherItems', {
    templateUrl: 'html/other-items.html',
    controller: function OtherItemController($scope, socket) {
        var ctrl = this
        socket.on('other-items', function(items) {
            ctrl.items = items
        })

        ctrl.buy = function(item) {
            socket.emit("buy", item)
        }
    }
});
