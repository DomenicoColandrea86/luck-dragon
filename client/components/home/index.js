import './home.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import homeRoute from './home.routes';

import HomeController from './home.controller';

export default angular.module('app.home', [uirouter])
  .config(homeRoute)
  .controller('HomeController', HomeController)
  .name;