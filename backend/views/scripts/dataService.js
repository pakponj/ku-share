//angular.module('serviceApp',[])
//.controller('userServiceCtrl', function ($scope, $http) {
//    $http.get('/api/category').success(function (data) {
//        $scope.username = data;
//        alert('Load username successed');
//    })
//});
var serviceApp = angular.module('serviceApp', []);
serviceApp.controller('UsernameCtrl', ['$scope', '$http', '$templateCache',
    function ($scope, $http, $templateCache) {
        $scope.method = 'GET';
        $scope.url = '/profile';

        $scope.fetch= function() {
            $scope.code = null;
            $scope.response = null;

            $http({method: $scope.method, url: $scope.url, cache: $templateCache})
                .then(function(response) {
                    $scope.data = response.data;
                    $scope.status = response.status;
                }, function(response) {
                    $scope.data = response.data || 'request failed';
                    $scope.status = response.status;
            });
        };
    }]);
//angular.module('serviceApp', [])
//.controller('getSubjectsCtrl', ['$scope', function ($http) {
//    $http.get('/api/upload/subjects').success(function (data) {
//        $scope.subjects = data;
//        alert('Load subjects successed');
//    })
//}]);
