var categoryApp = angular.module('categoryApp', []);

categoryApp.controller('CategoryListCtrl', function ($scope) {
    $scope.categories = [
        '1', '2', '3', '4', '5'
    ];
});