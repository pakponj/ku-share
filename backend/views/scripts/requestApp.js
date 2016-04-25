var app = angular.module('myApp', ['ngResource']);

app.factory('Post', function ($resource) {
    return $resource('/api/posts/:id');
});

app.controller('PostIndexCtrl', function ($scope, Post) {
    Post.query(function (data) {
        $scope.posts = data;
    });
});

app.controller('PostShowCtrl' ,function($scope, Post){
    Post.get({ id: 1 }, function (data) {
        $scope.post = data;
    });
});