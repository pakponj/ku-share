var app = angular.module('catApps', ['ngRoute'])
    .config(['$routeProvider','$locationProvider',function ($routeProvider, $locationProvider) {
        // configure the routing rules here
        $routeProvider.when('/category/:categoryName', {
            controller: 'subjectCtrl',
        });

        // enable HTML5mode to disable hashbang urls
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }])
    .controller('subjectCtrl',['$scope', '$http', '$routeParams', '$location',function ($scope, $http, $routeParams, $location, $route) {
        console.log($location.path());
        var subject = ($location.path()).substring($location.path().indexOf('/',1)+1);
        console.log(subject);
        //console.log($routeParams.categoryName);
        //console.log($route.current.params);
        //console.log(JSON.stringify($routeParams));
        $http.get("/api/show/"+(subject)+"/subjects")
            .then(function(response) {
                $scope.category = subject;
                $scope.status = response.status;
                $scope.data = response.data;
                console.log($scope.data);
            }, function(response) {
                $scope.data = response.data || "Request failed";
                $scope.status = response.status;
                console.log($scope.data);
            });
    }]);
