'use strict';

/* controllers.js */

var d2botfileControllers = angular.module('d2botfileControllers', []);

d2botfileControllers.controller('EditHeroController', ['$rootScope','$scope', '$routeParams', 'heroFactory', 'itemFactory', 'itemgroupFactory','abilityFactory', 'botfileFactory', function($rootScope, $scope, $routeParams, heroFactory, itemFactory, itemgroupFactory, abilityFactory, botfileFactory) {

  //other scope variables
  $scope.orderHero = 'localized_name';
  $scope.orderItem = 'dname';
  $scope.orderAbility = 'value.dname';
  $scope.heroIdx = $routeParams.heroIdx;

  $scope.invokerHeroIdx = 72; 
  $scope.abilityNumber = 4;
  $scope.levelNumber = 25;
  $scope.selected = false;

  $scope.loadout = [
    //seed data
    {
      "name": "tango",
      "priority": "ITEM_CONSUMABLE",
      "sellable": true
    }
  ];

  $scope.heroRole = [
    "DOTA_BOT_HARD_CARRY",
    "DOTA_BOT_SEMI_CARRY",
    "DOTA_BOT_NUKER",
    "DOTA_BOT_GANKER",
    "DOTA_BOT_TANK",
    "DOTA_BOT_PUSH_SUPPORT",
    "DOTA_BOT_STUN_SUPPORT",
    "DOTA_BOT_PURE_SUPPORT",
  ];
  $scope.laningInfo = [
    "SoloDesire",
    "RequiresBabysit",
    "ProvidesBabysit",
    "SurvivalRating",
    "RequiresFarm",
    "ProvidesSetup",
    "RequiresSetup"
  ];

  //config for ng-sortable item
  $scope.sortableItemConfig = {
    group: {
      name:'itemBuild',
      pull:true,
      put:true
    },
    animation: 100,
    onAdd: function(event){
      event = event || window.event;
      var targetIdx = event.newIndex;
      $scope.addLoadoutElement(event.model.name,targetIdx);
    }
  };

  //config for ng-sortable item list
  $scope.sortableItemListConfig = {
    group: {
      name:'itemBuild',
      pull:'clone',
      put:false
    },
    sort: false,
    animation: 100
  };

  //scope functions
  $scope.init = function(){
    //get hero data
    heroFactory.get(function(data){
      $scope.heroes = data.heroes;
      if($routeParams.heroIdx !== undefined){
        $scope.hero = $scope.heroes[$routeParams.heroIdx];
        $scope.getBotfileConfigHero($scope.hero.name);
      }
    });
    //get item data
    itemFactory.get(function(data) {
      $scope.items = data.itemdata;
    });
    //get item_group data
    itemgroupFactory.get(function(data) {
      $scope.itemgroups = data.itemdata_group;
      $scope.itemreqrecipe = data.itemdata_require_recipe;

      $scope.itemList = (function(){
        var arr = [];
        for(var i = 0; i < $scope.itemgroups.length; i++){
          for(var j = 0; j < $scope.itemgroups[i].items.length; j++){
            arr.push($scope.itemgroups[i].items[j]);
          }
        }
        return arr;
      })();
    });
    //get ability data
    abilityFactory.get(function(data) {
      $scope.abilities = data.abilitydata;
    });
  };

  //used in ng-repeat to repeat a defined number of times
  $scope.range = function(num){
    return new Array(num);
  };

  //convert string to delimiter-separated Camel Case
  $scope.splitCamelCase = function(str){
    var newString = "";
    newString =  str.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){
                    return str.toUpperCase();
                  });
    return newString;
  };

  //search if an array of object contains a specific key-value pair
  $scope.isValueInArrObj = function(array,key,value){
    var result = array.filter(function(obj){
      return obj.key === value;
    });
    var found = result.length > 0 ? true : false;

    return found;
  }

  //add item loadout element
  $scope.addLoadoutElement = function(item_id,targetIdx){
    var defaultPriority = "";
    if((item_id != "bottle") && ($scope.isValueInArrObj($scope.itemgroups[0].items,"name",item_id))){ //check if item is in the consumable group
      defaultPriority = "ITEM_CONSUMABLE";
      $scope.loadout.splice(targetIdx, 0, {
        "name": item_id,
        "priority": defaultPriority,
        "sellable": false
      });
      if("dname" in $scope.loadout[targetIdx+1]){
        $scope.loadout.splice(targetIdx+1,1); //one "copied" event.model is removed from item list
      }
      $scope.$apply();
    }
    else{
      if(($scope.items[item_id] !== undefined) && ($scope.items[item_id].created == true)){
        defaultPriority = "ITEM_DERIVED";
        $scope.loadout.splice(targetIdx, 0, {
          "name": item_id,
          "priority": defaultPriority,
          "sellable": false
        });
        if("dname" in $scope.loadout[targetIdx+1]){
          $scope.loadout.splice(targetIdx+1,1); //one "copied" event.model is removed from item list
        }
        $scope.$apply();

        //iterate through the components
        if($scope.itemreqrecipe.indexOf(item_id) > -1){ //check if the item has a recipe component
          //TODO fix recipe item image looks like the actual item
          $scope.addLoadoutElement("recipe",targetIdx); //for visual purpose
          //$scope.addLoadoutElement("recipe_"+item_id,targetIdx); //the true code
        }
        for(var i = $scope.items[item_id].components.length-1; i >= 0 ; i--){
          $scope.addLoadoutElement($scope.items[item_id].components[i],targetIdx);
        }
      }
      else{
        defaultPriority = "ITEM_CORE";
        $scope.loadout.splice(targetIdx, 0, {
          "name": item_id,
          "priority": defaultPriority,
          "sellable": false
        });
        if("dname" in $scope.loadout[targetIdx+1]){
          $scope.loadout.splice(targetIdx+1,1); //one "copied" event.model is removed from item list
        }
        $scope.$apply();
      }
    }
  }

  //set the options for item loadout element's priority
  $scope.setPriorityOptions = function(defaultPriority){
    var options = [];
    switch (defaultPriority){
      case "ITEM_CONSUMABLE": {
        options = ["ITEM_CONSUMABLE"];
        break;
      }
      case "ITEM_DERIVED": {
        options = ["ITEM_DERIVED"];
        break;
      }
      default: {
        options = [
          "ITEM_CORE",
          "ITEM_EXTENSION",
          "ITEM_LUXURY"
        ];
        break;
      }
    }
    return options;
  };

  //remove item loadout element
  $scope.removeItem = function(item){
    $scope.loadout.splice($scope.loadout.indexOf(item), 1);
  };

  //load last saved bot config
  $scope.getBotfileConfigHero = function(hero_name){

    //load "Loadout"
    var loadout = botfileFactory.getBotLoadout(hero_name);
    if(loadout.length > 0){
      $scope.loadout = loadout;
    }

    //load "Build"
    var build = botfileFactory.getBotBuild(hero_name);
    for(var level in build){
      //iterate level
      if(build.hasOwnProperty(level)){
        switch(build[level]){
          case $scope.hero.abilities[0]:
            document.getElementById("a1"+"lv"+level).className += " selected";
            break;
          case $scope.hero.abilities[1]:
            document.getElementById("a2"+"lv"+level).className += " selected";
            break;
          case $scope.hero.abilities[2]:
            document.getElementById("a3"+"lv"+level).className += " selected";
            break;
          case $scope.hero.abilities[3]:
            document.getElementById("a4"+"lv"+level).className += " selected";
            break;
          case "attribute_bonus":
            document.getElementById("a5"+"lv"+level).className += " selected";
              break;
        }
      } 
    }

    //load "HeroType"
    var heroType = botfileFactory.getBotHeroType(hero_name);
    if(heroType != ""){
      var roles = heroType.split(" | ");
      roles.forEach(function(role){
        document.getElementById("role"+$scope.heroRole.indexOf(role)).checked = true;
      });
    }

    //load "LaningInfo"
    var laningInfo = botfileFactory.getBotLaningInfo(hero_name);
    for(var item in laningInfo){
      if(laningInfo.hasOwnProperty(item)){
          document.getElementById("laning_"+item).value = parseInt(laningInfo[item]);
      }
    }

  };

  //save current bot config
  $scope.setBotfileConfigHero = function(hero_name){

    //save "Loadout"
    botfileFactory.setBotLoadout(hero_name,$scope.loadout);


    //save "Build"
    var build = {};
    for(var i = 1; i <= $scope.abilityNumber; i++){
      for(var j = 1; j <= $scope.levelNumber; j++){
        //iterate ability id
        if(document.getElementById("a"+i+"lv"+j).className.indexOf("selected") > -1){
          //add to build
          build[String(j)] = $scope.hero.abilities[i-1];
        };
      } 
    }
    //same code for attribute bonus
    if($scope.heroIdx != $scope.invokerHeroIdx){
      for(var j = 1; j <= $scope.levelNumber; j++){
        if(document.getElementById("a5"+"lv"+j).className.indexOf("selected") > -1){
          //add to build
          build[String(j)] = "attribute_bonus";
        };
      } 
    }
    botfileFactory.setBotBuild(hero_name,build);

    //save "HeroType"
    var heroType = "";
    for(var i = 0; i < $scope.heroRole.length; i++){
      if(document.getElementById("role"+i).checked == true){
        if(heroType == ""){
          heroType += $scope.heroRole[i];
        }
        else{
          heroType += " | "+$scope.heroRole[i];
        }
      }
    }
    botfileFactory.setBotHeroType(hero_name,heroType);

    //save "LaningInfo"
    var laningInfo = {};
    for(var i = 0; i < $scope.laningInfo.length; i++){
      laningInfo[$scope.laningInfo[i]] = String(document.getElementById("laning_"+$scope.laningInfo[i]).value);
    }
    botfileFactory.setBotLaningInfo(hero_name,laningInfo);
  };

  //events
  $scope.$on('$routeChangeStart', function(){
    if($scope.heroIdx !== undefined){
      $scope.setBotfileConfigHero($scope.hero.name);
    }
  });

  //fire init function
  $scope.init();

}]);
