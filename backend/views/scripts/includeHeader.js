var includeApp = angular.module('includeApp', ['ngCookies']);
includeApp.controller('HeaderCtrl', ['$scope', function ($scope) {
    $scope.header = { name: 'header.html', url: 'header.html' };
}]);
//includeApp.controller('UsernameCtrl', ['$scope', '$http', '$templateCache',
//    function ($scope, $http, $templateCache) {
//        $scope.method = 'GET';
//        $scope.url = '/profile/username';
//        $scope.session = '/profile'

//        $scope.fetch = function () {
//            $scope.code = null;
//            $scope.response = null;

//            $http({ method: $scope.method, url: $scope.url, cache: $templateCache })
//                .then(function (response) {
//                    $scope.data = response.data;
//                    $scope.status = response.status;
//                }, function (response) {
//                    $scope.data = response.data || 'request failed';
//                    $scope.status = response.status;
//                });
//        };
//    }]);

includeApp.controller('userCtrl', ['$scope', '$cookies', function ($scope, $cookies) {

    $scope.saveUsername = function (username) {
        console.log(username);
        $cookies.put('username', username);
    };

    $scope.getUsername = function () {
        console.log($cookies.get('uesrname'));
        return $cookies.get('username');
    };

}]);

includeApp.controller('dropdownCtrl', function ($scope, $http) {
    $http.get("/api/upload/subjects")
        .then(function(response) {
            $scope.status = response.status;
            $scope.subjects = response.data;
        }, function(response) {
            $scope.data = response.data || "Request failed";
            $scope.status = response.status;
    });
});
