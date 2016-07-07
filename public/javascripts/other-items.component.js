app.component('otherItems', {
    templateUrl: 'html/other-items.html',
    controller: function OtherItemController($scope, $rootScope, socket) {
        var ctrl = this

        socket.on('other-items', function(items) {
            console.log(items)
            ctrl.items = items
        })

        socket.on('published', function(item) {
            ctrl.items.push(item)
        })

        ctrl.order = function(item) {
            item.ordered = true
            socket.emit("order", {
                user: $rootScope.userInfo.id,
                item: item
            })
        }
    }
});
