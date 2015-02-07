'use strict';

/* services.js */

var d2botfileServices = angular.module('d2botfileServices', ['ngResource']);

d2botfileServices.factory('heroFactory', ['$resource', function($resource){
	return $resource('data/heroes.json');
}]);

d2botfileServices.factory('itemFactory', ['$resource', function($resource){
	return $resource('data/items.json');
}]);

d2botfileServices.factory('itemgroupFactory', ['$resource', function($resource){
	return $resource('data/items_group.json');
}]);

d2botfileServices.factory('abilityFactory', ['$resource', function($resource){
	return $resource('data/abilities.json');
}]);

d2botfileServices.factory('botfileFactory', ['heroFactory', function(heroFactory){
	//contains bot configuration for each hero
	var botfileConfig = {};
	//get hero data
    heroFactory.get(function(data){
      var heroes = data.heroes;
      for(var i = 0; i < heroes.length; i++){
      	//init botfileConfig
      	botfileConfig[heroes[i].name] =
      		{
      			"Bot": {
      				"Loadout": {},
      				"Build": {},
      				"HeroType": "",
      				"LaningInfo": {}
      			}
      		};
      }
    });

	return {
		getBotfileConfig : function(){
			return botfileConfig;
		},
		getBotLoadout : function(hero_name){
			return botfileConfig[hero_name].Bot.Loadout;
		},
		getBotBuild : function(hero_name){
			return botfileConfig[hero_name].Bot.Build;
		},
		getBotHeroType : function(hero_name){
			return botfileConfig[hero_name].Bot.HeroType;;
		},
		getBotLaningInfo : function(hero_name){
			return botfileConfig[hero_name].Bot.LaningInfo;
		},
		setBotLoadout : function(hero_name, data){
			botfileConfig[hero_name].Bot.Loadout = data;
			return botfileConfig;
		},
		setBotBuild : function(hero_name, data){
			botfileConfig[hero_name].Bot.Build = data;
			return botfileConfig;
		},
		setBotHeroType : function(hero_name, data){
			botfileConfig[hero_name].Bot.HeroType = data;
			return botfileConfig;
		},
		setBotLaningInfo : function(hero_name, data){
			botfileConfig[hero_name].Bot.LaningInfo = data;
			return botfileConfig;
		},

	}
}]);
