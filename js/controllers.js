'use strict';

/* controllers.js */

var d2botfileControllers = angular.module('d2botfileControllers', []);

d2botfileControllers.controller('EditHeroListController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
  $http.get('data/heroes.json').success(function(data) {
    $scope.heroes = data.result.heroes;
  });
  $scope.orderProp = 'displayname';
  $scope.heroId = $routeParams.heroId;
}]);
