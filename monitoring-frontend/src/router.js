module.exports = function(app){
    app.config(function($stateProvider, $urlRouterProvider){
        $stateProvider.state({
            name: 'overview',
            url: '/overview',
            component: 'overview'
        });
        $urlRouterProvider.otherwise('/overview');
    });
};
