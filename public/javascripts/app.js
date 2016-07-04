var app = angular.module('biddingApp', []);

app.controller('MainController', ['$scope', 'socket', function($scope, socket) {
    ctrl = this
    socket.on('username', function(username) {
        ctrl.username = username
    })
}])
