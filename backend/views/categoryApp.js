var app = angular.module('catApps', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
        // configure the routing rules here
        $routeProvider.when('/category/:categoryName', {
            controller: 'subjectCtrl'
        });

        // enable HTML5mode to disable hashbang urls
        $locationProvider.html5Mode(true);
    });

app.controller('subjectCtrl', [ '$scope', '$http', function ($scope, $http, $routeParams) {
        console.log($routeParams.categoryName);
        $http.get("/api/show/{{$routeParams.categoryName}}/subjects")
            .then(function(response) {
                $scope.status = response.status;
                $scope.data = response.data;
            }, function(response) {
                $scope.data = response.data || "Request failed";
                $scope.status = response.status;
        });
    }]);
    // .controller('PagesCtrl', function ($routeParams) {
    //     console.log($routeParams.id, $routeParams.type);
    // });
