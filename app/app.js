import angular from 'angular';
import uiRouter from 'angular-ui-router';

import {HomeController} from 'components/home.controller';

"use strict";

function config($locationProvider, $stateProvider, $urlRouterProvider) {

  // set to html5mode
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'components/home.html',
      controller: 'homeController as homeCtrl'
    });

  $urlRouterProvider.otherwise('/');
}

/*
 * Instantiate Module
 */
angular.module('app', ['ui.router'])
  .config(config)
  .controller('homeController', HomeController);

/*
 * Bootstrap Angular
 * Should be done manually here, since it is loaded lazily.
 */
angular.element(document).ready(function () {
  angular.bootstrap(document, ['app']);
});