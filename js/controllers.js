'use strict';

/* controllers.js */

var d2botfileControllers = angular.module('d2botfileControllers', []);

d2botfileControllers.controller('BotFileController', ['$rootScope','$scope','$routeParams','heroFactory','botfileFactory',function($rootScope, $scope, $routeParams, heroFactory, botfileFactory) {

  $scope.botfile = "";
  $scope.heroConfig = [];

  //scope functions
  $scope.init = function(){
    heroFactory.get(function(data){
      for (var i = 0; i < data.heroes.length; i++) {
        $scope.heroConfig.push(
          {
            "name": data.heroes[i].name
          }
        );
      }
    });
  };

  //get text from uploaded file
  $scope.uploadBotfile = function(element){
     $scope.$apply(function(scope) {
         var botfile = element.files[0];
         var reader = new FileReader();
         reader.onload = function(evt) {
            $scope.botfile = reader.result;
            //get value of "Bot" attribute for each hero
            for(var i = 0; i < $scope.heroConfig.length; i++){
              $scope.heroConfig[i]["Bot"] = $scope.getAttributeValue($scope.getAttributeValue($scope.botfile,$scope.heroConfig[i].name,true),"Bot",true);
              //parse "Bot" value for each hero
              $scope.parseBotValue($scope.heroConfig[i].name,$scope.heroConfig[i].Bot);
            }
            //console.log($scope.heroConfig[1].Bot);
         };
         reader.readAsText(botfile);
     });
  };

  //get value of attribute attr (surrounded by "{ }") that exists in string str
  //isObj determines whether the value is an object or not
  //this method returns string, not object
  $scope.getAttributeValue = function(str, attr, isObj){
    var search = '\"'+attr+'\"'; //add double quotes
    if(str.indexOf(search) > -1){ //if attr exists in str
      var beginIdx = str.indexOf(search) + search.length;
      var endIdx = -1;

      var braceCounter = 0;
      var found = false;
      var currentIdx = beginIdx;

      if(isObj){ //if the value is an object
        //assume the file is a valid VDF
        do{
          if(str.charAt(currentIdx) == '{'){
            braceCounter++;
            if(braceCounter == 0){
              found = true;
            }
          }
          else if(str.charAt(currentIdx) == '}'){
            braceCounter--;
            if(braceCounter == 0){
              found = true;
            }
          }
          currentIdx++;
        }
        while(!found);

        endIdx = currentIdx--; //assign the index of the closing brace
      }
      else{
        var quote_count = 0;
        while(quote_count < 2){
          if(str.charAt(currentIdx) == '\"'){
            quote_count++;
            if(quote_count == 1){
              beginIdx = currentIdx + 1; //get first character inside quote
            }
            else if(quote_count == 2){
              endIdx = currentIdx - 1; //get last character inside quote
            }
          }
          currentIdx++;
        }
      }

      return str.substring(beginIdx,endIdx+1);
    }
    else{
      return "";
    }
  }

  //parse acquired "Bot" value to defined JSON format
  //this is a modified VDF parser, because the Item Loadout has its own handling
  $scope.parseBotValue = function(hero_name, str){

    //parse "Loadout"
    var str_loadout = $scope.getAttributeValue(str,"Loadout",true);
    var loadout = [];
    if(str_loadout != ""){
      //get every elements between quotes
      var array_raw_loadout = str_loadout.match(/"(.*?)"/gm); 
      for(var i = 0; i < array_raw_loadout.length; i = i + 2){
        var name = array_raw_loadout[i].replace(/item_|"/gm,"");
        //quick fix for power treads item name problem
        if(name == "treads"){
          name = "power_treads";
        }
        var priority = array_raw_loadout[i+1].split(" | ");
        var sellable = ((priority.length > 1) && (priority[1] == "ITEM_SELLABLE\"") ? true : false);
        //create new element in loadout array
        loadout.push(
          {
            "name": name,
            "priority": priority[0].replace(/"/g,""),
            "sellable": sellable
          }
        );
      }
    }

    //parse "Build"
    var str_build = $scope.getAttributeValue(str,"Build",true);
    var build = ( str_build == "" ? {} : JSON.parse($scope.parseVDF(str_build)) );
    //parse "HeroType"
    var str_herotype = $scope.getAttributeValue(str,"HeroType",false);
    var herotype = ( str_herotype == "" ? "" : $scope.parseVDF(str_herotype) );
    //parse "LaningInfo"
    var str_laninginfo = $scope.getAttributeValue(str,"LaningInfo",true);
    var laninginfo = ( str_laninginfo == "" ? {} : JSON.parse($scope.parseVDF(str_laninginfo)) );

    /*console.log(JSON.stringify(loadout, undefined, 2));
    console.log(JSON.stringify(build, undefined, 2));
    console.log(JSON.stringify(herotype, undefined, 2));
    console.log(JSON.stringify(laninginfo, undefined, 2));*/

    //write to botfileconfig localstorage
    botfileFactory.setBotLoadout(hero_name,loadout);
    botfileFactory.setBotBuild(hero_name,build);
    botfileFactory.setBotHeroType(hero_name,herotype);
    botfileFactory.setBotLaningInfo(hero_name,laninginfo);
  };

  //parse a VDF file or part of VDF file into JSON format
  //credit to https://gist.github.com/AlienHoboken/5571903
  $scope.parseVDF = function(str){
    var result = str;
    //replace open braces
    var replace = '\"$1\": {';
    result = result.replace(/"([^"]*)"(\s*){/gm, replace);
    //replace values
    replace = '\"$1\": \"$2\",';
    result = result.replace(/"([^"]*)"\s*"([^"]*)"/gm, replace);
    //remove trailing commas
    replace = '$1';
    result = result.replace(/,(\s*[}\]])/gm, replace);
    //add commas
    replace = '$1,$2$3$4';
    result = result.replace(/([}\]])(\s*)("[^"]*":\s*)?([{\[])/gm, replace);
    //object as value
    replace = '},$1';
    result = result.replace(/}(\s*"[^"]*":)/gm, replace);
    
    return result;
  };

  //fire init function
  $scope.init();

}]);

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
          //$scope.addLoadoutElement("recipe",targetIdx); //for visual purpose
          $scope.addLoadoutElement("recipe_"+item_id,targetIdx); //the true code
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
