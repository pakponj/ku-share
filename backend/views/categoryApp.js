var app = angular.module('catApps', ['ngRoute'])
    .config(['$routeProvider','$locationProvider',function ($routeProvider, $locationProvider) {
        // configure the routing rules here
        $routeProvider.when('/category/:categoryName', {
            controller: 'subjectCtrl'
        })
        .when('view/:openfile', {
            controller: 'fileOpenCtrl'
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
    }])
    .controller('fileOpenCtrl', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
        console.log($location.path());
        var fileToOpen = ($location.path()).substring(location.path().indexOf('/', 1) + 1);
        console.log(fileToOpen);

        $http.get('/api/view/file/' + fileToOpen)
            .then(function (response) {
                $scope.status = response.status;
                $scope.data = response.data;
                console.log($scope.data);
            });
    }])
    .controller('HeaderCtrl', ['$scope', function ($scope) {
        $scope.header = { name: 'header.html', url: 'header.html' };
    }]);