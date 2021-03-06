'use strict';

/* app.js */

var d2botfileApp = angular.module('d2botfileApp', [
  'ngRoute',
  'ng-sortable',
  'd2botfileControllers',
  'd2botfileFilters',
  'd2botfileServices'
]);

d2botfileApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/create-upload', {
        templateUrl: 'partials/create-upload.html',
        controller: 'BotFileController'
      }).
      when('/edit', {
        templateUrl: 'partials/edit-hero-list.html',
        controller: 'EditHeroController'
      }).
      when('/edit/:heroIdx', {
        templateUrl: 'partials/edit-hero-list.html',
        controller: 'EditHeroController'
      }).
      when('/download', {
        templateUrl: 'partials/download.html',
        controller: 'BotFileController'
      }).
      when('/about', {
        templateUrl: 'partials/about.html'
      }).
      otherwise({
        redirectTo: '/create-upload'
      });
  }]);
