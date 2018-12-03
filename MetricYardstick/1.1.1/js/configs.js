angularApp.config(function ($routeProvider, $locationProvider) {

    $routeProvider

        //Routes for User Areas 

        .when('/', {
            controller: 'user_homeCtrl',
            templateUrl: '/1.1.1/html/user/user_home.html',
            routedata: {
                secure: true,
                title: 'Home',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/skills/', {
            controller: 'user_skillsCtrl',
            templateUrl: '/1.1.1/html/user/user_skills.html',
            routedata: {
                secure: true,
                title: 'My Skills',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/addskills/', {
            controller: 'user_addskillsCtrl',
            templateUrl: '/1.1.1/html/user/user_addskills.html',
            routedata: {
                secure: true,
                title: 'Add Skills',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/addskill/:id/:type', {
            controller: 'user_addskillCtrl',
            templateUrl: '/1.1.1/html/user/user_addskill.html',
            routedata: {
                secure: true,
                title: 'Add Skill',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/editskill/:id/:type', {
            controller: 'user_editskillCtrl',
            templateUrl: '/1.1.1/html/user/user_editskill.html',
            routedata: {
                secure: true,
                title: 'Edit a Skill',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/wishlist/', {
            controller: 'user_wishlistCtrl',
            templateUrl: '/1.1.1/html/user/user_wishlist.html',
            routedata: {
                secure: true,
                title: 'Skill Wishlist',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/reports/', {
            controller: 'user_reportsCtrl',
            templateUrl: '/1.1.1/html/user/user_reports.html',
            routedata: {
                secure: true,
                title: 'Reports and Dashboards',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/search/', {
            controller: 'user_searchCtrl',
            templateUrl: '/1.1.1/html/user/user_search.html',
            routedata: {
                secure: true,
                title: 'Skill Search',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/settings/', {
            controller: 'user_settingsCtrl',
            templateUrl: '/1.1.1/html/user/user_settings.html',
            routedata: {
                secure: true,
                title: 'My Settings',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/help/', {
            controller: 'user_helpCtrl',
            templateUrl: '/1.1.1/html/user/user_help.html',
            routedata: {
                secure: true,
                title: 'Help Area',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/user/:id', {
            controller: 'user_viewCtrl',
            templateUrl: '/1.1.1/html/user/user_view.html',
            routedata: {
                secure: true,
                title: 'View User Area',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        //Routes for Admin Areas 

        .when('/admin/', {
            controller: 'admin_homeCtrl',
            templateUrl: '/1.1.1/html/admin/admin_home.html',
            routedata: {
                secure: true,
                title: 'Admin Area',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminusers/', {
            controller: 'admin_usersCtrl',
            templateUrl: '/1.1.1/html/admin/admin_users.html',
            routedata: {
                secure: true,
                title: 'User Account Managment',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminimport/', {
            controller: 'admin_importCtrl',
            templateUrl: '/1.1.1/html/admin/admin_import.html',
            routedata: {
                secure: true,
                title: 'Admin User Import',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminskills/', {
            controller: 'admin_skillsCtrl',
            templateUrl: '/1.1.1/html/admin/admin_skills.html',
            routedata: {
                secure: true,
                title: 'Skill Catalog Managment',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminaddarea/', {
            controller: 'admin_addareaCtrl',
            templateUrl: '/1.1.1/html/admin/admin_addarea.html',
            routedata: {
                secure: true,
                title: 'Add a Skill Area',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/admineditarea/:id', {
            controller: 'admin_editareaCtrl',
            templateUrl: '/1.1.1/html/admin/admin_editarea.html',
            routedata: {
                secure: true,
                title: 'Edit a Skill Area',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/admindeletearea/:areaid', {
            controller: 'admin_deleteareaCtrl',
            templateUrl: '/1.1.1/html/admin/admin_deletearea.html',
            routedata: {
                secure: true,
                title: 'Delete a Skill Area',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminaddcategory/:areaid/:areatype', {
            controller: 'admin_addcategoryCtrl',
            templateUrl: '/1.1.1/html/admin/admin_addcategory.html',
            routedata: {
                secure: true,
                title: 'Add a Skill category',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/admineditcategory/:id', {
            controller: 'admin_editcategoryCtrl',
            templateUrl: '/1.1.1/html/admin/admin_editcategory.html',
            routedata: {
                secure: true,
                title: 'Edit Skill category',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/admindeletecategory/:categoryid', {
            controller: 'admin_deletecategoryCtrl',
            templateUrl: '/1.1.1/html/admin/admin_deletecategory.html',
            routedata: {
                secure: true,
                title: 'Delete a Skill category',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminaddskill/:categoryid', {
            controller: 'admin_addskillCtrl',
            templateUrl: '/1.1.1/html/admin/admin_addskill.html',
            routedata: {
                secure: true,
                title: 'Add a Skill',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/admineditskill/:id', {
            controller: 'admin_editskillCtrl',
            templateUrl: '/1.1.1/html/admin/admin_editskill.html',
            routedata: {
                secure: true,
                title: 'Edit a Skill',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/admindeleteskill/:skillid', {
            controller: 'admin_deleteskillCtrl',
            templateUrl: '/1.1.1/html/admin/admin_deleteskill.html',
            routedata: {
                secure: true,
                title: 'Delete a Skill Selection',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/admincampaigns/', {
            controller: 'admin_campaignsCtrl',
            templateUrl: '/1.1.1/html/admin/admin_campaigns.html',
            routedata: {
                secure: true,
                title: 'SkillResults Campaigns',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminsettings/', {
            controller: 'admin_settingsCtrl',
            templateUrl: '/1.1.1/html/admin/admin_settings.html',
            routedata: {
                secure: true,
                title: 'Global Settings',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminhelp/', {
            controller: 'admin_helpCtrl',
            templateUrl: '/1.1.1/html/admin/admin_help.html',
            routedata: {
                secure: true,
                title: 'Admin Help Area',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        //Public Routes for Login and Authentication Areas 

        .when('/login/', {
            controller: 'loginCtrl',
            templateUrl: '/1.1.1/html/login/login.html',
            routedata: {
                secure: false,
                title: 'Login',
                area: 'admin'
            }
        })

        .when('/auth/:userid/:authkey01/:authkey02/', {
            controller: 'authCtrl',
            templateUrl: '/1.1.1/html/login/auth.html',
            routedata: {
                secure: false,
                title: 'Auth',
                area: 'admin'
            }
        })

        .when('/register/', {
            controller: 'registerCtrl',
            templateUrl: '/1.1.1/html/register/register.html',
            routedata: {
                secure: false,
                title: 'Register',
                area: 'admin'
            }
        })

        //If the Route is not found
        .otherwise({
            redirectTo: '/'
        });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);

});
