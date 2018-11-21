//Create the Angular Application and load each module
var angularApp = angular.module('angularApp', ['ngRoute', 'ngMaterial', 'ngMessages', 'ngAnimate'])

//Run at the start of the Angular Application
angularApp.run(function ($rootScope, $location) {

    //Initalize the Global User Object
    $rootScope.user = {};

    //Function to Logout User
    $rootScope.logout = function () {

        localStorage.removeItem('accessToken');

        $location.path('/login/');
    };

    //Global Variables to Maintain Catalog View State
    $rootScope.admin_catalog_state = {
        currentArea: 0,
        currentAreaType: '',
        currentCategory: 0,
        currentCategoryType: '',
        currentSkill: 0,
        currentSkillType: '',
    };

});