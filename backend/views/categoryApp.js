var app = angular.module('catApps', ['ngRoute', 'ngCookies'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        // configure the routing rules here
        $routeProvider.when('/category/:categoryName', {
            controller: 'subjectCtrl'
        })
        //.when('view/:openfile', {
        //    controller: 'fileOpenCtrl',
        //})
        .when('/search/:item', {
            controller: 'searchResultCtrl'
        })
        .when('/category/:categoryID', {
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

    .controller('fileOpenCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

        var fileToOpen = ($location.path()).substring($location.path().indexOf('/', 1) + 1);
        console.log(fileToOpen);

        if (fileToOpen !== 'filePath') {
            $http.get('/api/view/file/' + fileToOpen)
            .then(function (response) {
                $scope.filePath = '../scripts/ViewerJS/#../../uploads/' + response.data[0].filePath;
                console.log($scope.filePath);
                //$scope.fileInfo = $scope.filePath;
                //$scope.fileInfo = $scope.filePath;
            });
        }


    }])

    .controller('HeaderCtrl', ['$scope', function ($scope) {

        $scope.header = { name: 'header.html', url: 'header.html' };
    }])

    .controller('tableCatCtrl', function ($scope, $http, $location) {
        var categoryinfo = ($location.path()).substring($location.path().indexOf('/', 1) + 1);

        $http.get('/api/search/by/category/' + categoryinfo)
            .then(function (response) {
                $scope.status = response.status;
                $scope.data = response.data;
            });
    })

    .controller('userCtrl', ['$scope', '$cookies', function ($scope, $cookies) {

        var now = new Date(),
            exp = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        var userCookie;

        $scope.saveUsername = function (username) {
            console.log('Saving  username' + username);
            userCookie = username;
            $cookies.put('username', userCookie, {
                expires: exp
            });
        };

        $scope.getUsername = function () {
            //console.log("Cookie: "+userCookie);
            if (userCookie == null) userCookie = $cookies.get('username');
            return userCookie;
        };

    }])

    .controller('dropdownCtrl', ['$scope', '$http', function ($scope, $http) {
        $http.get('/api/upload/show/subject')
            .then(function (response) {
                $scope.subjects = response.data;
                $scope.status = response.status;
            });
    }])

    .controller('searchResultCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        console.log($location.search().searchInfo);
        $http.get('/api/search/all/' + $location.search().searchInfo)
            .then(function (response) {
                $scope.data = response.data;
                console.log(response.data);
                $scope.status = response.status;
            });

    }])

    .controller('showFilesBySubjectCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        var subjectinfo = ($location.path()).substring($location.path().indexOf('/', 1) + 1);
        console.log(subjectinfo);
        $http.get('/api/search/by/subject/' + subjectinfo)
            .then(function (response) {
                $scope.data = response.data;
                $scope.status = response.status;
            });
    }])

    .controller('getProfileCtrl', ['$scope', '$http', function ($scope, $http) {

        $http.get('/api/profile/information')
            .then(function (response) {
                $scope.data = response.data;
                $scope.status = response.status;
                $scope.profileInfo = $scope.data[0];
                $scope.uploadHistory = $scope.data[1];
                $scope.commentHistory = $scope.data[2];
            });
    }])

    .controller('getCommentsCtrl', ['$scope', '$http', function ($scope, $http) {
        $http.get('')
            .then(function (response) {
                $scope.comments = response.data;
            });
    }]);
    //.controller('getViewDocumentCtrl', ['$scope', '$http', function ($scope, $http) {
    //    var filePath = ($location.path()).substring($location.path().indexOf('/', 1) + 1);
    //    $http.get('/api/view/file/' + filePath);

    //}])
;
