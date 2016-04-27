var app = angular.module('catApps', ['ngRoute'])
    .config(['$routeProvider','$locationProvider',function ($routeProvider, $locationProvider) {
        // configure the routing rules here
        $routeProvider.when('/category/:categoryName', {
            controller: 'subjectCtrl'
        });

        // enable HTML5mode to disable hashbang urls
        $locationProvider.html5Mode(true);
    }])
    .controller('subjectCtrl',['$scope', '$http', '$routeParams',function ($scope, $http, $routeParams) {
        console.log(JSON.stringify($routeParams));
        $http.get("/api/show/{{$routeParams.categoryName}}/subjects")
            .then(function(response) {
                $scope.category = $routeParams.categoryName;
                $scope.status = response.status;
                $scope.data = response.data;
                console.log($scope.data);
            }, function(response) {
                $scope.data = response.data || "Request failed";
                $scope.status = response.status;
                console.log($scope.data);
        });
    }]);
