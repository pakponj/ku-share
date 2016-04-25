var app = angular.module('tableApps', []);

app.controller('tableCtrl', function ($scope, $http) {
    $http.get("data.json").success(function ( respond ) {
        $scope.tables = respond.records;
        console.log(respond);
    })
});