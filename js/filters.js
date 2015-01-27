'use strict';

/* filters.js */

var d2botfileFilters = angular.module('d2botfileFilters', []);

//order object of objects by a key
d2botfileFilters.filter('orderObjectBy', function() {
  return function(objects, key) {
    var result = [];
    angular.forEach(objects, function(object){
    	result.push(object);
    });
    result.sort(function (obj1,obj2){
    	return (obj1[key] < obj2[key] ? -1 : 1);
    });
    return result;
  };
});

//get hero's localized_name based on heroIdx
d2botfileFilters.filter('getHeroLocalizedName', function() {
    return function(heroIdx, heroes){
        if(heroes === undefined){
            return false;
        }
        return heroes[heroIdx].localized_name;
    }
});
