'use strict';

/* app.js */

var d2botfileApp = angular.module('d2botfileApp', [
  'ngRoute',
  'd2botfileControllers'
]);

d2botfileApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/create-upload', {
        templateUrl: 'partials/create-upload.html'
      }).
      when('/edit', {
        templateUrl: 'partials/edit-hero-list.html',
        controller: 'EditHeroListController'
      }).
      when('/edit/:heroId', {
        templateUrl: 'partials/edit-hero-list.html',
        controller: 'EditHeroListController'
      }).
      when('/download', {
        templateUrl: 'partials/download.html'
      }).
      when('/about', {
        templateUrl: 'partials/about.html'
      }).
      otherwise({
        redirectTo: '/create-upload'
      });
  }]);
