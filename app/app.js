import $ from 'jquery';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

import 'angular-aria';
import 'angularjs-datepicker';

import {HomeController} from 'components/home/home.controller';
import {TodoController} from 'components/todo/todo.controller';

"use strict";

function config($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'components/home/home.html',
      controller: 'homeController as homeCtrl'
    })
    .state('todo', {
      url: '/todo',
      templateUrl: 'components/todo/todo.html',
      controller: 'todoController as todoCtrl'
    })
  ;

  $urlRouterProvider.otherwise('/home');
}

function removeLoading() {
  angular.element("#loading-gear").remove();
}

/*
 * Instantiate Module
 */
angular.module('app', ['ui.router', 'ngAria', '720kb.datepicker'])
  .config(config)
  .run(removeLoading)
  .controller('homeController', HomeController)
  .controller('todoController', TodoController);

/*
 * Bootstrap Angular
 * Should be done manually here, since it is loaded lazily.
 */
angular.element(document).ready(function () {
  angular.bootstrap(document, ['app']);
});