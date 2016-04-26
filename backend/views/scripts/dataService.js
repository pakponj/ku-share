angular.module('serviceApp',[])
.controller('userServiceCtrl', function ($scope, $http) {
    $http.get('/api/category').success(function (data) {
        $scope.username = data;
        alert('Load username successed');
    })
});
angular.module('serviceApp', [])
.controller('getSubjectsCtrl', ['$scope', function ($http) {
    $http.get('/api/upload/subjects').success(function (data) {
        $scope.subjects = data;
        alert('Load subjects successed');
    })
}]);
