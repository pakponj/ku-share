var includeApp = angular.module('includeApp', []);
includeApp.controller('HeaderCtrl', ['$scope', function ($scope) {
    $scope.header = { name: 'header.html', url: 'header.html' };
}]);