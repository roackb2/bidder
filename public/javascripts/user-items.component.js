app.component('userItems', {
    templateUrl: 'html/user-items.html',
    controller: function UserItemsController($scope, socket) {
        var ctrl = this
        socket.on('user-items', function(items) {
            console.log(items)
            ctrl.items = items
        })
    }
});
