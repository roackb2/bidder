var app = angular.module('biddingApp', []);

app.controller('MainController', ['$scope', '$rootScope', 'socket', function($scope, $rootScope, socket) {
    ctrl = this
    socket.on('user-info', function(info) {
        console.log(info)
        $rootScope.userInfo = info
        $scope.username = info.name
    })
}])
