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
	//get hero data
    heroFactory.get(function(data){
    	if(localStorage.getItem("botfileConfig") === null){
    		//contains bot configuration for each hero
			var botfileConfig = {};
    		var heroes = data.heroes;
		      for(var i = 0; i < heroes.length; i++){
		      	//init botfileConfig
		      	botfileConfig[heroes[i].name] =
	      		{
	      			"Bot": {
	      				"Loadout": [],
	      				"Build": {},
	      				"HeroType": "",
	      				"LaningInfo": {}
	      			}
	      		};
		      }
	      localStorage.setItem("botfileConfig",JSON.stringify(botfileConfig));
    	}
    });

	return {
		getBotfileConfig : function(){
			var storage_botfileConfig = JSON.parse(localStorage.getItem("botfileConfig"));;
			// return botfileConfig;
			return storage_botfileConfig;
		},
		getBotLoadout : function(hero_name){
			var storage_botfileConfig = JSON.parse(localStorage.getItem("botfileConfig"));
			// return botfileConfig[hero_name].Bot.Loadout;
			return storage_botfileConfig[hero_name].Bot.Loadout;
		},
		getBotBuild : function(hero_name){
			var storage_botfileConfig = JSON.parse(localStorage.getItem("botfileConfig"));
			// return botfileConfig[hero_name].Bot.Build;
			return storage_botfileConfig[hero_name].Bot.Build;
		},
		getBotHeroType : function(hero_name){
			var storage_botfileConfig = JSON.parse(localStorage.getItem("botfileConfig"));
			// return botfileConfig[hero_name].Bot.HeroType;
			return storage_botfileConfig[hero_name].Bot.HeroType;
		},
		getBotLaningInfo : function(hero_name){
			var storage_botfileConfig = JSON.parse(localStorage.getItem("botfileConfig"));
			// return botfileConfig[hero_name].Bot.LaningInfo;
			return storage_botfileConfig[hero_name].Bot.LaningInfo;
		},
		setBotLoadout : function(hero_name, data){
			var storage_botfileConfig = JSON.parse(localStorage.getItem("botfileConfig"));
			// botfileConfig[hero_name].Bot.Loadout = data;
			storage_botfileConfig[hero_name].Bot.Loadout = data;
			localStorage.setItem("botfileConfig",JSON.stringify(storage_botfileConfig));
			return storage_botfileConfig;
		},
		setBotBuild : function(hero_name, data){
			var storage_botfileConfig = JSON.parse(localStorage.getItem("botfileConfig"));
			// botfileConfig[hero_name].Bot.Build = data;
			storage_botfileConfig[hero_name].Bot.Build = data;
			localStorage.setItem("botfileConfig",JSON.stringify(storage_botfileConfig));
			return storage_botfileConfig;
		},
		setBotHeroType : function(hero_name, data){
			var storage_botfileConfig = JSON.parse(localStorage.getItem("botfileConfig"));
			//botfileConfig[hero_name].Bot.HeroType = data;
			storage_botfileConfig[hero_name].Bot.HeroType = data;
			localStorage.setItem("botfileConfig",JSON.stringify(storage_botfileConfig));
			return storage_botfileConfig;
		},
		setBotLaningInfo : function(hero_name, data){
			var storage_botfileConfig = JSON.parse(localStorage.getItem("botfileConfig"));
			// botfileConfig[hero_name].Bot.LaningInfo = data;
			storage_botfileConfig[hero_name].Bot.LaningInfo = data;
			localStorage.setItem("botfileConfig",JSON.stringify(storage_botfileConfig));
			return storage_botfileConfig;
		}
	}
}]);
