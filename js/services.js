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