'use strict';

require('bootstrap');

var angular = require('angular');

require('leaflet');
require('angular-simple-logger');
require('ui-leaflet');

require("@uirouter/angularjs");

var app = angular.module('DMPFrontend', ['ui.router', require('angular-nvd3'), 'ui-leaflet']);

require('./router.js')(app);

require('./services/dmpapi.js')(app);

require('./components/overview.js')(app);