var app = angular.module('tableApps', []);

console.log('tableApp')

app.controller('tableCtrl', function ($scope, $http) {
    console.log("hello");
    $http.get("/api/upload/subjects")
        .then(function(response) {
            $scope.status = response.status;
            $scope.data = response.data;
            console.log(data);
        }, function(response) {
            $scope.data = response.data || "Request failed";
            $scope.status = response.status;
    });
});