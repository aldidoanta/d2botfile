'use strict';

/* services.js */

var d2botfileServices = angular.module('d2botfileServices', ['ngResource']);

d2botfileServices.factory('heroFactory', ['$resource', function($resource){
	return $resource('data/heroes.json');
}]);

d2botfileServices.factory('itemFactory', ['$resource', function($resource){
	return $resource('data/items.json');
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
      				"Loadout": {

      				},
      				"Build": {
      					"1": "",
      					"2": "",
      					"3": "",
      					"4": "",
      					"5": "",
      					"6": "",
      					"7": "",
      					"8": "",
      					"9": "",
      					"10": "",
      					"11": "",
      					"12": "",
      					"13": "",
      					"14": "",
      					"15": "",
      					"16": "",
      					"17": "",
      					"18": "",
      					"19": "",
      					"20": "",
      					"21": "",
      					"22": "",
      					"23": "",
      					"24": "",
      					"25": ""
      				},
      				"HeroType": "",
      				"LaningInfo": {
      					"SoloDesire": "",
						"RequiresBabysit": "",
						"ProvidesBabysit": "",
						"SurvivalRating": "",
						"RequiresFarm": "",
						"ProvidesSetup": "",
						"RequiresSetup": ""
      				}
      			}
      		};
      }
    });

	return {
		getBotfileConfig : function(){
			return botfileConfig;
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
