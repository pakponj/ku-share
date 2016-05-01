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

    .controller('fileOpenCtrl', ['$scope', '$http', '$location', 'commentService', function ($scope, $http, $location, commentService) {

        var fileToOpen = ($location.path()).substring($location.path().indexOf('/', 1) + 1);
        console.log(fileToOpen);

        if (fileToOpen !== 'filePath') {
            $http.get('/api/view/file/' + fileToOpen)
            .then(function (response) {
                //$scope.filePath = 'http://docs.google.com/gview?url='+ location.host + '/uploads/' + response.data[0].filePath + '&embedded=true';
                $scope.filePath = '../scripts/ViewerJS/#../../uploads/' + response.data[0].filePath;
                commentService.setUserID(response.data[0].ownerID);
                $scope.fileID = response.data[0].fileID;
                commentService.setFileID($scope.fileID);
                console.log($scope.filePath);
                console.log('userID: ',commentService.getUserID());

                //load comments
                console.log("Get comments from fileID: ", $scope.fileID);

                $http({
                    method: 'GET',
                    url: '/api/comments/'+$scope.fileID
                })
                .then(function (response) {
                    $scope.comments = response.data;
                }, function () {
                    console.log('Error: failed to load comments of fileID', commentService.getFileID());
                })
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
        $scope.getCategoryname = function(){
            return $scope.data[0].categoryName
        }
    })

    .controller('userCtrl', ['$scope', '$http', function ($scope, $http) {

        $scope.getUsername = function () {
            $http.get('/api/username')
                .then(function (response) {
                    $scope.data = response.data;
                    //console.log($scope.data);
                    console.log('Response: ',response)
                    console.log('Response.data: ', response.data);
                    //logout case somehow gives a [] response back
                    if (typeof response.data[0] != 'undefined') $scope.username = response.data[0].username;
                    else $scope.username = 'ANONYMOUS'
                }, function (response) {
                    console.log('Error: failed to get username...');
                    $scope.username = 'ANONYMOUS';
                }
            );
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
        $scope.getSearch = function() {
            return $location.search().searchInfo
        }
    }])

    .controller('showFilesBySubjectCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        var subjectinfo = ($location.path()).substring($location.path().indexOf('/', 1) + 1);
        console.log(subjectinfo);
        $http.get('/api/search/by/subject/' + subjectinfo)
            .then(function (response) {
                $scope.data = response.data;
                $scope.status = response.status;
            });
        $scope.getSubject = function () {
            return $scope.data[0].subjectName
        }
    }])

    .controller('browseCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $http.get('/api/show/browse')
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

        $scope.getDate = function(date){
            var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
            var d = new Date(date);
            return days[d.getDay()]+' '+d.getFullYear() + "-" + months[d.getMonth()] + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);
        }
    }])
    .controller('postCommentCtrl', ['$scope', '$http', 'commentService', function ($scope, $http, commentService) {

        $scope.SendData = function () {
            console.log('sending data...')
            //Send as JSON
            var dataToSend = JSON.stringify({
                commentDetail: $scope.commentDetail,
                userID: commentService.getUserID(),
                fileID: commentService.getFileID()
            });
            console.log(dataToSend);
            $http({
                method: 'POST',
                url: '/api/comment',
                data: dataToSend,
                headers: {'Content-Type': 'application/json'}
            })
                .then(function (response) {
                    $scope.comments = response.data
                }, function(response) {
                    console.log('Error posting');
                });
        }

        $scope.commentsFromFileID = '/api/comments/' + commentService.getFileID();

        /*Unused get comments function -> service set fileID slower than this function
          so commentService.getFileID() returns undefined..., so RIP
        */
        $scope.getComments = function () {

            console.log("Get comments from fileID: ", commentService.getFileID());

            $http({
                method: 'GET',
                url: $scope.commentsFromFileID
            })
            .then(function (response) {
                $scope.comments = response.data;
            }, function () {
                console.log('Error: failed to load comments of fileID', commentService.getFileID());
            })

        };

        $scope.getDate = function (date) {
            var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            var d = new Date(date);
            return days[d.getDay()] + ' ' + d.getFullYear() + "-" + months[d.getMonth()] + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);
        };

    }]);

app.service('commentService', function () {
    var userID, fileID, commentsFunc;

    var setUserID = function (newUserID) {
        userID = newUserID;
    };

    var setFileID = function (newFileID) {
        fileID = newFileID;
    };

    //var setCommentsFunc = function (newCommentsFunc) {
    //    commentsFunc = newCommentsFunc;
    //};

    var getUserID = function () { return userID; };
    var getFileID = function () { return fileID; };
    //var showCommentsFunc = function (fileID) {
    //    commentsFunc(fileID);
    //};

    return {
        setUserID: setUserID,
        setFileID: setFileID,
        getUserID: getUserID,
        getFileID: getFileID
    };
});
