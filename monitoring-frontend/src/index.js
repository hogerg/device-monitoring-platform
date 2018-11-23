'use strict';

require('bootstrap');

var angular = require('angular');

require('leaflet');
require('angular-simple-logger');

require("@uirouter/angularjs");

var app = angular.module('DMPFrontend', ['ui.router', require('angular-nvd3')]);

require('./router.js')(app);

require('./services/dmpapi.js')(app);

require('./components/overview.js')(app);