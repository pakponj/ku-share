var app = angular.module('uploadApp', []);

app.controller('dropdownCtrl', function ($scope, $http) {
    $http.get("/api/upload/subjects")
        .then(function(response) {
            $scope.status = response.status;
            $scope.subjects = response.data;
        }, function(response) {
            $scope.data = response.data || "Request failed";
            $scope.status = response.status;
    });
});
