var app = angular.module('tableApps', []);

app.controller('tableCtrl', function ($scope, $http) {
    $http.get("/api/upload/subjects")
        .then(function(response) {
            $scope.status = response.status;
            $scope.data = response.data;
        }, function(response) {
            $scope.data = response.data || "Request failed";
            $scope.status = response.status;
        })
    })
});