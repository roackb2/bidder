app.component('otherItems', {
    templateUrl: 'html/other-items.html',
    controller: function OtherItemController($scope, $rootScope, socket) {
        var ctrl = this

        socket.on('other-items', function(items) {
            console.log(stringify(items))
            if(!items) {
                items = []
            }
            ctrl.items = items
        })

        socket.on('published', function(item) {
            ctrl.items.push(item)
        })

        ctrl.order = function(item) {
            if(!item.biddingPrice || item.biddingPrice < item.price) {
                alert("bidding price must be greater than the selling price")
                return
            }
            item.ordered = true
            socket.emit("order", {
                user: $rootScope.userInfo.id,
                item: item
            })
        }
    }
});
