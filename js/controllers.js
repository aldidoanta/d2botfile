'use strict';

/* controllers.js */

var d2botfileControllers = angular.module('d2botfileControllers', []);

d2botfileControllers.controller('EditHeroController', ['$rootScope','$scope', '$routeParams', 'heroFactory', 'itemFactory', 'abilityFactory', 'botfileFactory', function($rootScope, $scope, $routeParams, heroFactory, itemFactory, abilityFactory, botfileFactory) {
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
  $scope.abilityNumber = 4;
  $scope.levelNumber = 25;

  //scope functions
  $scope.range = function(num){
    return new Array(num);
  };
  $scope.setBotfileConfig = function(){ //save current bot config
    //save ability build
    var build = {};
    for(var i = 1; i <= $scope.levelNumber; i++){
      //iterate over id

    }
    botfileFactory.setBotBuild($scope.hero.name,build);
  };
  $scope.selected = false;
}]);
