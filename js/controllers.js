'use strict';

/* controllers.js */

var d2botfileControllers = angular.module('d2botfileControllers', []);

d2botfileControllers.controller('EditHeroController', ['$scope', '$routeParams', 'heroFactory', 'itemFactory', 'abilityFactory', function($scope, $routeParams, heroFactory, itemFactory, abilityFactory) {
  //get hero data
  heroFactory.get(function(data){
    $scope.heroes = data.heroes;
    $scope.hero = $scope.heroes[$routeParams.heroIdx];
  });
  //get item data
  itemFactory.get(function(data) {
    $scope.items = data.itemdata;
  });
  //get ability data
  abilityFactory.get(function(data) {
    $scope.abilities = data.abilitydata;
  });

  //other scope variables
  $scope.orderHero = 'localized_name';
  $scope.orderItem = 'value.dname';
  $scope.orderAbility = 'value.dname';
  $scope.heroIdx = $routeParams.heroIdx;
}]);
