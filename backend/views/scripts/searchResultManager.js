//var pageApp = angular.module('pageApp', ['angularUtils.directives.dirPagination']);

//pageApp.controller('paginationCtrl', function ($scope, $http) {
//    $scope.currentPage = 1;
//    $scope.pageSize = 20;
//    $scope.rows = [];

//    function getResultsPage() {
//        $http.get('/api/searchResult')
//            .then(function (result) {
//                $scope.rows = result.data;
//                $scope.total = result.data.length;
//                console.log($scope.rows);
//            }, function (result) {
//                $scope.rows = result.data || 'Request failed';
//                $scope.status = response.status;
//        });
//    };
//});

//var pageApp = pageApp.module('pageApp', [])
//.controller('paginationCtrl', function ($scope, $http) {
//    $scope.rows = [];
//    $scope.totalRows = 0;
//    $scope.rowsPerPage = 25;
//    getResultsPage(1);

//    $scope.pagination = {
//         current: 1
//    };

//    $scope.pageChanged = function (newPage) {
//        getResultsPage(newPage);
//    };

//    function getResultsPage(pageNumber) {
//        $http.get('path/to/api/searchResult')
//            .then(function (result) {
//                $scope.rows = result.data.Item;
//                $scope.totalRows = result.data.Count;
//        });
//    }

//});