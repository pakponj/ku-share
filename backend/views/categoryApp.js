var app = angular.module('catApps', ['ngRoute', 'ngCookies'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        // configure the routing rules here
        $routeProvider.when('/category/:categoryName', {
            controller: 'subjectCtrl'
        })
        .when('view/:openfile', {
            controller: 'fileOpenCtrl'
        })
        .when('/category', {
            controller: 'tableCatCtrl'
        });

        // enable HTML5mode to disable hashbang urls
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }])

    .controller('subjectCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        //console.log($location.path());
        var subject = ($location.path()).substring($location.path().indexOf('/', 1) + 1);
        console.log(subject);
        $http.get("/api/show/" + (subject) + "/subjects")
            .then(function (response) {
                $scope.status = response.status;
                $scope.data = response.data;
            }, function (response) {
                $scope.data = response.data || "Request failed";
                $scope.status = response.status;
            });
    }])

    .controller('fileOpenCtrl', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
        console.log($routeParams)
        //console.log($location.path());
        //var fileToOpen = ($location.path()).substring(location.path().indexOf('/', 1) + 1);
        //console.log(fileToOpen);

        $http.get('/api/view/file/' + fileToOpen)
            .then(function (response) {
                $scope.status = response.status;
                $scope.data = response.data;
                console.log($scope.data);
            });
    }])

    .controller('HeaderCtrl', ['$scope', function ($scope) {
        $scope.header = { name: 'header.html', url: 'header.html' };
    }])

    .controller('tableCatCtrl', function ($scope, $http) {
        $http.get("/api/show/category")
            .then(function (response) {
                $scope.status = response.status;
                $scope.data = response.data;
            }, function (response) {
                $scope.data = response.data || "Request failed";
                $scope.status = response.status;
            });
    })

    .controller('userCtrl', ['$scope', '$cookies', function ($scope, $cookies) {

        var now = new Date(),
            exp = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        $scope.saveUsername = function (username) {
            console.log(username);
            $cookies.put('username', username, {
                expires: exp
            });
        };

        $scope.getUsername = function () {
            console.log($cookies.get('username'));
            return $cookies.get('username');
        };

    }])

    .controller('dropdownCtrl', ['$scope', '$http', function ($scope, $http) {
        $http.get('/api/upload/show/subject')
            .then(function (response) {
                $scope.subjects = response.data;
                $scope.status = response.status;
            });
    }])

    //.controller('searchSenderCtrl', ['$scope', '$http', function ($scope, $http) {
    //    console.log($scope.searchInfo);
    //    $http.get('/api/search/all/' + $scope.searchInfo)
    //        .then(function (response) {
    //            $scope.data = response.data;
    //            $scope.status = response.status;
    //        });
    //}])

    .controller('searchResultCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        console.log($location.search('searchInfo'));
        $http.get('/api/search/all/' + $locatin.search('searchInfo'))
            .then(function (response) {
                $scope.data = response.data;
                $scope.status = response.status;
            });

    }]);

    //.controller('disableSettingCtrl'. ['$scope', function($scope){
    
    //}]);