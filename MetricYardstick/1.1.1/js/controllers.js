//User Area Controllers

angularApp.controller("user_homeCtrl", function ($scope) {

    console.log('Home Controller Processed');

});

angularApp.controller("user_skillsCtrl", function ($scope, $rootScope, $http) {

    $scope.initialize = function () {

        //Initalize Data Models
        $scope.userskills = {};

        //Load Data Models
        $scope.loaduserskills();

    }

    //Load User Skills Function
    $scope.loaduserskills = function () {

        $http.get('/api/UserSkills/GetUsersSkills/' + $rootScope.user.userId + "/master",
             {
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                 }

            //On Success Response from API
             }).then(function successCallback(masterdata) {


                $http.get('/api/UserSkills/GetUsersSkills/' + $rootScope.user.userId + "/custom",
                     {
                         headers: {
                             'Content-Type': 'application/json',
                             'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                         }

                         //On Success Response from API
                     }).then(function successCallback(customdata) {

                         $scope.userskills = masterdata.data.concat(customdata.data);

                         //on Fail, log the failure data.

                     }, function errorCallback(response) {


                         console.log(response);

                     });

                //on Fail, log the failure data.

            }, function errorCallback(response) {


                console.log(response);

            });

    };

    $scope.initialize();

    console.log('Skills Controller Processed');

});

angularApp.controller("user_addskillsCtrl", function ($scope, $rootScope, $http, $routeParams, $location) {

    $scope.initialize = function () {

        //Initalize Data Models
        $scope.userskills = {};
        $scope.searchskills = [];
        $scope.searchtext = "";

        //Load Data Models
        $scope.loadsearchskills();

        //Call the Load Area Data Function to populate the view
        $scope.loadareas();
    }

    //Load Skills Function
    $scope.loadsearchskills = function () {

        var allskills = [];

        $http.get('/api/SkillsMasters',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function (masterdata) {

                $http.get('/api/SkillsCustoms',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                        }

                        //On Success Response from API
                    }).then(function (customdata) {

                        $scope.allskills = masterdata.data.concat(customdata.data);

                        //loop through scope to 
                        angular.forEach($scope.allskills, function (value, key) {
                            var skill = { name: value.name, value: value.name.toLowerCase(), description: value.description, id: value.id, type: value.type };
                            allskills.push(skill);
                        });

                        $scope.searchskills = allskills;

                        //on Fail, log the failure data.
                    }, function errorCallback(response) {

                        console.log(response);
                    });

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
            });

    };

    //Function - Load Area Data
    $scope.loadareas = function () {

        //Initialze the Area Model
        $scope.areas = [];

        //Make a call to get the Master Areas
        $http.get('/api/AreasMasters',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }

                    //On Success Response from API
                }).then(function successCallback(response) {

                    //Add the Master Areas to the Areas Model
                    $scope.areas = response.data;

                    //Make a call to the Custom Areas
                    $http.get('/api/AreasCustoms',
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                            }

                            //On Success Response from API
                        }).then(function successCallback(response) {

                            //Add the Custom Areas to the Areas Model
                            $scope.areas = $scope.areas.concat(response.data);

                            //Sort the Areas Scope
                            $scope.sortObj($scope.areas);

                            //If this is the first time here, select the first Area in the List
                            if ($rootScope.admin_catalog_state.currentArea == 0) {

                                console.log('First time Here:')
                                console.log('Selecting - ID: ' + $scope.areas[0].id + ' Type: ' + $scope.areas[0].type)


                                $scope.selectArea($scope.areas[0].id, $scope.areas[0].type);

                                //Otherwise, call the select Area function
                            } else {

                                console.log('Navigating back:')
                                console.log('Selecting - ID: ' + $rootScope.admin_catalog_state.currentArea + ' Type: ' + $rootScope.admin_catalog_state.currentAreaType)

                                $scope.selectArea($rootScope.admin_catalog_state.currentArea, $rootScope.admin_catalog_state.currentAreaType);

                            };

                            //on Fail, log the failure data.
                        }, function errorCallback(response) {

                            //Log the Error
                            console.log(response);

                        });

                    //on Fail, log the failure data.
                }, function errorCallback(response) {

                    console.log(response);

                });

    };

    //Function - Load Category Data
    $scope.loadcategories = function (areaid, areatype) {

        //initialize the categories
        $scope.categories = [];

        //If the Parent Area is a Master, call the get Category by Master Area Endpoint.
        if (areatype == "master") {

            //Make a call to get the Master (& possibly custom) Categories in the Master Area
            $http.get('/api/CategoriesbyAreaMasters/' + areaid + '/',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }

                    //On Success Response from API
                }).then(function successCallback(response) {

                    //Check for Null Data
                    if (!response.data.length == 0) {

                        //Populate the Category Model with the response data
                        $scope.categories = response.data;

                        //Sort the Category Scope
                        $scope.sortObj($scope.categories);

                        //If this is the first time here, select the first Area in the List
                        if (!$scope.categories.find(o => o.id === $rootScope.admin_catalog_state.currentCategory && o.type === $rootScope.admin_catalog_state.currentCategoryType) || $rootScope.admin_catalog_state.currentCategory == 0) {

                            $scope.selectCategory($scope.categories[0].id, $scope.categories[0].type);

                            //Otherwise, call the select Area function
                        } else {

                            $scope.selectCategory($rootScope.admin_catalog_state.currentCategory, $rootScope.admin_catalog_state.currentCategoryType);

                        };

                    } else {

                        //The catagory is empty, so clear the skills as well. 
                        $scope.skills = [];

                    };

                    //on Fail, log the failure data.
                }, function errorCallback(response) {

                    console.log(response);

                });

            //Otherwise, if the Parent Area is a Custom, just grab all the custom areas. 
        } else {

            //Make a call to get the Custom Categories
            $http.get('/api/CategoriesbyAreaCustoms/' + areaid + '/',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }

                    //On Success Response from API
                }).then(function successCallback(response) {

                    //Check for Null Data
                    if (response.data[0]) {

                        //Populate the Category Model with the reponse data
                        $scope.categories = response.data;

                        //Sort the Category Scope
                        $scope.sortObj($scope.categories);

                        //If this is the first time here, select the first Area in the List
                        if (!$scope.categories.find(o => o.id === $rootScope.admin_catalog_state.currentCategory && o.type === $rootScope.admin_catalog_state.currentCategoryType) || $rootScope.admin_catalog_state.currentCategory == 0) {

                            $scope.selectCategory($scope.categories[0].id, $scope.categories[0].type);

                            //Otherwise, call the select Area function
                        } else {

                            $scope.selectCategory($rootScope.admin_catalog_state.currentCategory, $rootScope.admin_catalog_state.currentCategoryType);

                        };

                    } else {

                        //the custom category is empty, so clear out the skills as well
                        $scope.skills = [];

                    };

                    //on Fail, log the failure data.
                }, function errorCallback(response) {

                    console.log(response);

                });

        };

    };

    //Function - Load Skill Data
    $scope.loadskills = function (categoryid, categorytype) {

        //initialize the categories
        $scope.skills = [];

        //If the Parent Area is a Master, call the get Category by Master Area Endpoint.
        if (categorytype == "master") {

            //Make a call to get the Master (& possibly custom) Categories in the Master Area
            $http.get('/api/SkillsGroupMasters/' + categoryid + '/',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }

                    //On Success Response from API
                }).then(function successCallback(response) {

                    //Populate the Category Model with the response data
                    $scope.skills = response.data;

                    //Sort the Category Scope
                    $scope.sortObj($scope.skills);

                    //If this is the first time here, select the first Skill in the List
                    if ($rootScope.admin_catalog_state.currentSkill == 0) {

                        $scope.selectSkill($scope.skills[0].id, $scope.skills[0].type);

                        //Otherwise, call the select Area function
                    } else {

                        $scope.selectSkill($rootScope.admin_catalog_state.currentSkill, $rootScope.admin_catalog_state.currentSkillType);

                    };

                    //on Fail, log the failure data.
                }, function errorCallback(response) {

                    console.log(response);

                });

            //Otherwise, if the Parent Area is a Custom, just grab all the custom areas. 
        } else {

            //Make a call to get the Custom Categories
            $http.get('/api/SkillsGroupCustoms/' + categoryid + '/',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }

                    //On Success Response from API
                }).then(function successCallback(response) {

                    //Populate the Category Model with the reponse data
                    $scope.skills = response.data;

                    //Sort the Category Scope
                    $scope.sortObj($scope.skills);

                    //If this is the first time here, select the first Skill in the List
                    if ($rootScope.admin_catalog_state.currentSkill == 0) {

                        $scope.selectSkill($scope.skills[0].id, $scope.skills[0].type);

                        //Otherwise, call the select Area function
                    } else {

                        $scope.selectSkill($rootScope.admin_catalog_state.currentSkill, $rootScope.admin_catalog_state.currentSkillType);

                    };

                    //on Fail, log the failure data.
                }, function errorCallback(response) {

                    console.log(response);

                });

        };

    };

    //Function - Select Area
    $scope.selectArea = function (id, type) {

        //Set the Current Area Selection 
        $rootScope.admin_catalog_state.currentArea = id;
        $rootScope.admin_catalog_state.currentAreaType = type;

        //Load the categories
        $scope.loadcategories(id, type);

    };

    //Function - Select Category
    $scope.selectCategory = function (id, type) {

        $rootScope.admin_catalog_state.currentCategory = id;
        $rootScope.admin_catalog_state.currentCategoryType = type;

        //$rootScope.admin_catalog_state.currentSkill = 0;
        //$rootScope.admin_catalog_state.currentSkillType = '';

        $scope.loadskills(id, type);

    };

    //Function - Select Skill
    $scope.selectSkill = function (id, type) {

        $rootScope.admin_catalog_state.currentSkill = id;
        $rootScope.admin_catalog_state.currentSkillType = type;

    };

    //Function - Sort The Areas Model by Name
    $scope.sortObj = function (object) {

        //Sort Areas Aphabetically
        object.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

    };

    $scope.initialize();

    console.log('Add Skills Controller Processed');

});

angularApp.controller("user_addskillCtrl", function ($scope, $http, $routeParams, $location) {

    $scope.initialize = function () {

        //Load the Data
        $scope.loadskill();
    }

    //Function to Load the Form Data
    $scope.loadskill = function () {

        //Make a Rest Call
        $http.get('/api/UserSkills/GetSelectedSkill/' + $routeParams.id + "/" + $routeParams.type,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Succsess of the REST call
            }).then(function (response) {
                console.log(response);
                $scope.skill = response.data[0];
                //Set selected skill id and rating to 0 to disable button
                $scope.skill.rating = 0;

                //On Failure of the REST call
            }, function errorCallback(response) {

                console.log(response);

            });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        var dataObj = {
            SkillId: $scope.skill.id,
            Rating: $scope.skill.rating,
            Type: $scope.skill.type
        };

        //TODO: Check for UserSkill: Add Controller Function to see IF EXISTS

        $http.post('/api/UserSkills', dataObj,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }
            }).then(function (response) {

                $location.path('/skills/');

                console.log(response);

            }, function errorCallback(response) {

                console.log("Add User Skill Failed");
            });


    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/addskills/');
    };

    $scope.initialize();

    console.log('Add Skill Area Controller Processed');

});

angularApp.controller("user_editskillCtrl", function ($scope, $http, $routeParams, $location) {

    $scope.initialize = function () {
        //Initialize the data models
        $scope.skill = {};

        //Load the Data
        $scope.loadskill();

    }

    //Function to Load the Form Data
    $scope.loadskill = function () {

        //Make a Rest Call
        $http.get('/api/UserSkills/' + $routeParams.id + "/" + $routeParams.type,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

            //On Succsess of the REST call
            }).then(function (response) {

                $scope.skill = response.data[0];

                //On Failure of the REST call
            }, function errorCallback(response) {

                console.log(response);

            });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        ////Make a Rest Call
        var req = {
            method: 'PUT',
            url: '/api/UserSkills/' + $scope.skill.id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            data: $scope.skill
        }
        console.log(req)
        $http(req)
            //On Succsess of the REST call
            .then(function (response) {

                $location.path('/skills/');

                //On Failure of the REST call
            }, function (response) {

                console.log(response);

            });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/skills/');
    };

    $scope.initialize();

    console.log('Edit Skill Area Controller Processed');

});

angularApp.controller("user_wishlistCtrl", function ($scope) {

    console.log('Wishlist Controller Processed');

});

angularApp.controller("user_reportsCtrl", function ($scope) {

    console.log('Reports Controller Processed');

});

angularApp.controller("user_searchCtrl", function ($scope, $http, $location) {

    $scope.initialize = function () {

        //Initalize Data Models
        $scope.searchtext = "";
        $scope.skills = [];
        $scope.users = [];
        //Load Data Models
        $scope.loadskills();
        $scope.loadusers();
    }

    //Load Skills Function
    $scope.loadskills = function () {

        var allskills = [];

        $http.get('/api/SkillsMasters',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function (masterdata) {

                $http.get('/api/SkillsCustoms',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                        }

                    //On Success Response from API
                }).then(function (customdata) {

                    $scope.allskills = masterdata.data.concat(customdata.data);

                    //loop through scope to 
                    angular.forEach($scope.allskills, function (value, key) {
                        var skill = { name: value.name, value: value.name.toLowerCase(), description: value.description, id: value.id, type: value.type };
                        allskills.push(skill);
                    });

                    $scope.skills = allskills;

                    //on Fail, log the failure data.
                }, function errorCallback(response) {

                    console.log(response);
                });

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
            });

    };

    $scope.loadusers = function () {

        $http.get('/api/OrganizationUsers/GetOrganizationsUsers',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }
                //On Success Response from API
            }).then(function successCallback(response) {

                $scope.users = response.data;

                //on Fail, log the failure data.
            }, function errorCallback(response) {


                console.log(response);

            });

    };

    $scope.addskill = function (id, type) {

        $location.path('/addskill/' + id + '/' + type);

    };

    $scope.viewuser = function (id) {

        $location.path('/user/' + id);
    };

    $scope.initialize();

    console.log('Search Controller Processed');

});

angularApp.controller("user_settingsCtrl", function ($scope) {

    console.log('User Settings Controller Processed');

});

angularApp.controller("user_helpCtrl", function ($scope) {

    console.log('User Help Controller Processed');

});

angularApp.controller("user_viewCtrl", function ($scope, $http, $routeParams) {

    $scope.initialize = function () {

        //Initalize Data Models
        $scope.userskills = {};
        $scope.viewuser = {};

        //Load Data Models
        $scope.loaduser();
        $scope.loaduserskills();

    }

    //Load User Object
    $scope.loaduser = function (id) {

        $http.get('/api/Authenticate/' + $routeParams.id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(viewuser) {

                $scope.viewuser = viewuser.data[0];

                //on Fail, log the failure data.

            }, function errorCallback(response) {


                console.log(response);

            });

    };

    //Load User Skills Function
    $scope.loaduserskills = function (id) {

        $http.get('/api/UserSkills/GetUsersSkills/' + $routeParams.id + "/master",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(masterdata) {


                $http.get('/api/UserSkills/GetUsersSkills/' + $routeParams.id + "/custom",
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                        }

                        //On Success Response from API
                    }).then(function successCallback(customdata) {

                        $scope.userskills = masterdata.data.concat(customdata.data);

                        //on Fail, log the failure data.

                    }, function errorCallback(response) {


                        console.log(response);

                    });

                //on Fail, log the failure data.

            }, function errorCallback(response) {


                console.log(response);

            });

    };

    $scope.initialize();

    console.log('View User Controller Processed');

});

//Admin Area Controllers

angularApp.controller("admin_homeCtrl", function ($scope) {

    console.log('Admin Home Controller Processed');

});

angularApp.controller("admin_usersCtrl", function ($scope, $http, $location, $mdDialog, $q, UserFactory) {

    $scope.initialize = function () {

        $scope.adduser.useremail = '';
        $scope.orgusers = {};
        $scope.userlimit = {};
        $scope.importedusers = [];

        $scope.getmaxusers();
        $scope.getorgusers();

    };

    $scope.getorgusers = function () {

        $http.get('/api/organizationusers/GetOrganizationsUsers/',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }
            }).then(function (response) {

                $scope.orgusers = response.data;
                //$scope.orgid = $scope.orgusers[0].orgId;

            }, function errorCallback(response) {

                console.log("Failed");
            });
    };

    $scope.getmaxusers = function () {

        $http.get('/api/organizationusers/GetOrganizationMaxUsers/',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }
            }).then(function (response) {

                $scope.userlimit = response.data;

            }, function errorCallback(response) {

                console.log("Failed");
            });
    };

    $scope.maxusers = function () {
        //TODO: Tie to max users in database 
        if ($scope.orgusers.length > $scope.userlimit) {

            return true;

        }
        else {

            return false;

        }
    };

    $scope.showConfirmAll = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Send Link to All?')
              .textContent('Authentication Login Links will be sent ALL users.')
              .ariaLabel('Send All Login Links')
              .targetEvent(ev)
              .ok('Confirm')
              .cancel('Cancel');

        //Decided Confirm
        $mdDialog.show(confirm).then(function () {
            //Send Login Link to User
            console.log('Confirm Clicked');

            //Call the Factory
            UserFactory.send($scope.orgusers)

                //User send succeeded
                .then(function () {

                    //Log the Success
                    console.log('Factory Call Succeeded');
                    $scope.emailAllSuccess = true;

                })

                //User send failed
                .catch(function (error) {

                    //Log the Error
                    console.log('Factory Call Failed');
                    console.log(error.message);

                });

            //Decided Cancel
        }, function () {

            console.log('Cancel Clicked');

        });
    };

    $scope.showConfirmSingle = function (usremail) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Send Link?')
              .textContent('An Authentication Login Link will be sent to the user.')
              .ariaLabel('Send Login Link')
              //.targetEvent(ev)
              .ok('Confirm')
              .cancel('Cancel');

        //Decided Confirm
        $mdDialog.show(confirm).then(function () {
            //Send Login Link to User
            $scope.sendlogin(usremail);

            //Decided Cancel
        }, function () {
            console.log('Cancelled');
        });
    };

    $scope.sendlogin = function (usremail) {

        var dataObj = {
            email: usremail,
            template: "adminSentTemplate.html",
        };

        $http.post('/api/authenticate', dataObj,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(function (response) {

                console.log("Login Link Sent to User");
                //console.log(response.data);

            }, function errorCallback(response) {

                console.log("Login Failed");
            });

    };

    $scope.adduser = function () {

        var dataObj = {
            email: $scope.adduser.useremail,

        };

        $http.post('/api/account/registeruser', dataObj,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }
            }).then(function (response) {

                console.log(response);
                $scope.initialize();

            }, function errorCallback(response) {

                console.log("Add Users Failed");
            });

    };

    $scope.initialize();

    console.log('Admin Users Controller Processed');

});

angularApp.controller("admin_importCtrl", function ($scope, $http, $location, $mdDialog, $q, UserFactory) {

    $scope.initialize = function () {

        $scope.orgusers = {};
        $scope.userlimit = {};
        $scope.importedusers = [];
        $scope.divconfirm = true;
        $scope.getmaxusers();
        $scope.getorgusers();

    };

    $scope.fileloaded = function () {
        console.log('loaded');
    }

    $scope.getorgusers = function () {

        $http.get('/api/organizationusers/GetOrganizationsUsers/',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }
            }).then(function (response) {

                $scope.orgusers = response.data;
                //$scope.orgid = $scope.orgusers[0].orgId;

            }, function errorCallback(response) {

                console.log("Failed");
            });
    };

    $scope.getmaxusers = function () {

        $http.get('/api/organizationusers/GetOrganizationMaxUsers/',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }
            }).then(function (response) {

                $scope.userlimit = response.data;

            }, function errorCallback(response) {

                console.log("Failed");
            });
    };

    $scope.maxusers = function () {
        //TODO: Tie to max users in database 
        if ($scope.orgusers.length > $scope.userlimit) {

            return true;

        }
        else {

            return false;

        }
    };

    $scope.readcsv = function (form) {
        //clear out previous data
        $scope.importedusers = [];


        var filename = document.getElementById("csvImport");
        if (filename.value.length < 1) {
            //($scope.warning = "Please upload a file");
        } else {

            var file = filename.files[0];
            if (filename.files[0]) {

                var reader = new FileReader();
                reader.onload = function (e) {
                    var rows = e.target.result.split("\n");
                    for (var i = 0; i < rows.length; i++) {
                        var cells = rows[i].split(",");
                        for (var j = 0; j < cells.length; j++) {

                            //make sure email isn't empty
                            if (cells[j].length > 5) {

                                //trim whitespace
                                var useremail = cells[j].trim();

                                //make sure it is valid email address
                                var regex = /^.+@.+\..+$/;

                                if (regex.test(useremail))
                                {
                                    var regextest = true;
                                }
                                else
                                {
                                    var regextest = false;                             
                                }


                                var impuser = { id: i, email: useremail, valid: regextest };

                                //push user information to scope
                                $scope.importedusers.push(impuser);

                                //force digest
                                //$scope.$apply();

                            }
                        }
                    }

                    //show import button
                    $scope.divconfirm = false;
                    $scope.$apply();

                }
                reader.readAsText(filename.files[0]);

            }

            return false;
        }

    };

    $scope.initialize();

    console.log('Admin Users Controller Processed');

});

angularApp.controller("admin_skillsCtrl", function ($scope, $rootScope, $http) {

    //Function - Load Area Data
    $scope.loadareas = function () {

        //Initialze the Area Model
        $scope.areas = [];

        //Make a call to get the Master Areas
        $http.get('/api/AreasMasters', 
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }        

            //On Success Response from API
        }).then(function successCallback(response) {

            //Add the Master Areas to the Areas Model
            $scope.areas = response.data;

            //Make a call to the Custom Areas
            $http.get('/api/AreasCustoms',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    } 

                //On Success Response from API
            }).then(function successCallback(response) {

                //Add the Custom Areas to the Areas Model
                $scope.areas = $scope.areas.concat(response.data);

                //Sort the Areas Scope
                $scope.sortObj($scope.areas);

                console.log('Area Model Loaded');
                console.log($scope.areas);

                //If this is the first time here, select the first Area in the List
                if ($rootScope.admin_catalog_state.currentArea == 0) {

                    console.log('First time Here:')
                    console.log('Selecting - ID: ' + $scope.areas[0].id + ' Type: ' + $scope.areas[0].type)


                    $scope.selectArea($scope.areas[0].id, $scope.areas[0].type);

                    //Otherwise, call the select Area function
                } else {

                    console.log('Navigating back:')
                    console.log('Selecting - ID: ' + $rootScope.admin_catalog_state.currentArea + ' Type: ' + $rootScope.admin_catalog_state.currentAreaType)

                    $scope.selectArea($rootScope.admin_catalog_state.currentArea, $rootScope.admin_catalog_state.currentAreaType);

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                //Log the Error
                console.log(response);

            });

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function - Load Category Data
    $scope.loadcategories = function (areaid, areatype) {

        //initialize the categories
        $scope.categories = [];

        //If the Parent Area is a Master, call the get Category by Master Area Endpoint.
        if (areatype == "master") {

            console.log('Parent Area is Master - Loading Master Catagories (plus any customs added to the master area)')

            //Make a call to get the Master (& possibly custom) Categories in the Master Area
            $http.get('/api/CategoriesbyAreaMasters/' + areaid + '/',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }   

                //On Success Response from API
            }).then(function successCallback(response) {

                console.log(response.data.length);

                //Check for Null Data
                if (!response.data.length == 0) {

                    //Populate the Category Model with the response data
                    $scope.categories = response.data;

                    //Sort the Category Scope
                    $scope.sortObj($scope.categories);

                    //If this is the first time here, select the first Area in the List
                    if (!$scope.categories.find(o => o.id === $rootScope.admin_catalog_state.currentCategory && o.type === $rootScope.admin_catalog_state.currentCategoryType) || $rootScope.admin_catalog_state.currentCategory == 0) {

                        $scope.selectCategory($scope.categories[0].id, $scope.categories[0].type);

                        //Otherwise, call the select Area function
                    } else {

                        $scope.selectCategory($rootScope.admin_catalog_state.currentCategory, $rootScope.admin_catalog_state.currentCategoryType);

                    };

                } else {

                    //The catagory is empty, so clear the skills as well. 
                    $scope.skills = [];

                };



                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);

            });

            //Otherwise, if the Parent Area is a Custom, just grab all the custom areas. 
        } else {

            console.log('Parent Area is Custom - Loading Custom Catagories')

            //Make a call to get the Custom Categories
            $http.get('/api/CategoriesbyAreaCustoms/' + areaid + '/',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }   

                //On Success Response from API
            }).then(function successCallback(response) {

                console.log(response.data);

                //Check for Null Data
                if (response.data[0]) {

                    console.log('catagory not null');

                    //Populate the Category Model with the reponse data
                    $scope.categories = response.data;

                    //Sort the Category Scope
                    $scope.sortObj($scope.categories);

                    //If this is the first time here, select the first Area in the List
                    if (!$scope.categories.find(o => o.id === $rootScope.admin_catalog_state.currentCategory && o.type === $rootScope.admin_catalog_state.currentCategoryType) || $rootScope.admin_catalog_state.currentCategory == 0) {

                        $scope.selectCategory($scope.categories[0].id, $scope.categories[0].type);

                        //Otherwise, call the select Area function
                    } else {

                        $scope.selectCategory($rootScope.admin_catalog_state.currentCategory, $rootScope.admin_catalog_state.currentCategoryType);

                    };

                } else {

                    console.log('catagory is null');

                    //the custom category is empty, so clear out the skills as well
                    $scope.skills = [];

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);

            });

        };

    };

    //Function - Load Skill Data
    $scope.loadskills = function (categoryid, categorytype) {

        //initialize the categories
        $scope.skills = [];

        //If the Parent Area is a Master, call the get Category by Master Area Endpoint.
        if (categorytype == "master") {

            //Make a call to get the Master (& possibly custom) Categories in the Master Area
            $http.get('/api/SkillsGroupMasters/' + categoryid + '/',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }   

                //On Success Response from API
            }).then(function successCallback(response) {

                //Populate the Category Model with the response data
                $scope.skills = response.data;

                //Sort the Category Scope
                $scope.sortObj($scope.skills);

                //If this is the first time here, select the first Skill in the List
                if ($rootScope.admin_catalog_state.currentSkill == 0) {

                    $scope.selectSkill($scope.skills[0].id, $scope.skills[0].type);

                    //Otherwise, call the select Area function
                } else {

                    $scope.selectSkill($rootScope.admin_catalog_state.currentSkill, $rootScope.admin_catalog_state.currentSkillType);

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);

            });

            //Otherwise, if the Parent Area is a Custom, just grab all the custom areas. 
        } else {

            //Make a call to get the Custom Categories
            $http.get('/api/SkillsGroupCustoms/' + categoryid + '/',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Populate the Category Model with the reponse data
                $scope.skills = response.data;

                //Sort the Category Scope
                $scope.sortObj($scope.skills);

                //If this is the first time here, select the first Skill in the List
                if ($rootScope.admin_catalog_state.currentSkill == 0) {

                    $scope.selectSkill($scope.skills[0].id, $scope.skills[0].type);

                    //Otherwise, call the select Area function
                } else {

                    $scope.selectSkill($rootScope.admin_catalog_state.currentSkill, $rootScope.admin_catalog_state.currentSkillType);

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);

            });

        };

    };

    //Function - Select Area
    $scope.selectArea = function (id, type) {

        //Set the Current Area Selection 
        $rootScope.admin_catalog_state.currentArea = id;
        $rootScope.admin_catalog_state.currentAreaType = type;

        //Load the categories
        $scope.loadcategories(id, type);

    };

    //Function - Select Category
    $scope.selectCategory = function (id, type) {

        console.log('Catagory Selected');

        $rootScope.admin_catalog_state.currentCategory = id;
        $rootScope.admin_catalog_state.currentCategoryType = type;

        //$rootScope.admin_catalog_state.currentSkill = 0;
        //$rootScope.admin_catalog_state.currentSkillType = '';

        $scope.loadskills(id, type);

    };

    //Function - Select Skill
    $scope.selectSkill = function (id, type) {

        $rootScope.admin_catalog_state.currentSkill = id;
        $rootScope.admin_catalog_state.currentSkillType = type;

    };

    //Function - Sort The Areas Model by Name
    $scope.sortObj = function (object) {

        //Sort Areas Aphabetically
        object.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

    };

    //Call the Load Area Data Function to populate the view
    $scope.loadareas();

});

angularApp.controller("admin_addareaCtrl", function ($scope, $http, $location) {

    console.log('Admin Add Area Controller Processed');

    //Initialize the data models
    $scope.area = {
        Type: "custom",
    };

    //Function to Submit the Form
    $scope.submit = function () {

        //Make a Rest Call
        $http.post('/api/AreasCustoms/', $scope.area,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

            //On Succsess of the REST call
            }).then(function (response) {

                $scope.area = response.data;

                $location.path('/adminskills/');

                //On Failure of the REST call
            }, function errorCallback(response) {

                console.log(response);

            });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminskills/');
    };

});

angularApp.controller("admin_editareaCtrl", function ($scope, $http, $routeParams, $location) {

    console.log('Admin Edit Area Controller Processed');

    //Initialize the data models
    $scope.area = {};

    //Function to Load the Form Data
    $scope.loadarea = function () {

        //Make a Rest Call
        $http.get('/api/AreasCustoms/' + $routeParams.id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

            //On Succsess of the REST call
            }).then(function (response) {

                $scope.area = response.data;

                //On Failure of the REST call
            }, function errorCallback(response) {

                console.log(response);

            });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        //Make a Rest Call
        $http.put('/api/AreasCustoms/' + $routeParams.id, $scope.area,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

            //On Succsess of the REST call
            }).then(function (response) {

                $location.path('/adminskills/');

                //On Failure of the REST call
            }, function errorCallback(response) {

                console.log(response);

            });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminskills/');
    };

    //Load the Data
    $scope.loadarea();

});

angularApp.controller("admin_deleteareaCtrl", function ($scope, $http, $routeParams, SkillFactory, CategoryFactory, AreaFactory) {

    console.log('Admin Delete Area Controller Processed');

    //Looping Function to populate all the skills connected with each category
    $scope.populateSkills = function (categoryarrayid) {

        //Get the categoryID from the categoryarrayid
        categoryid = $scope.categories[categoryarrayid].id


        $http.get('/api/SkillsGroupCustoms/' + categoryid + '/',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                } 

            //On Success Response from API
        }).then(function successCallback(response) {

            //Add the Skills to the Category Model
            $scope.categories[categoryarrayid].skills = response.data;

            //Increment the categoryarrayid
            categoryarrayid = categoryarrayid + 1;

            //Check to see we are done adding skills or we have more to do:
            if (categoryarrayid < $scope.categories.length) {

                //Still more skills to delete, so keep going...
                $scope.populateSkills(categoryarrayid);

            }

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log('error!');
            console.log(response);

        });

    };

    //Function to Load the Category Model (with Skills)
    $scope.populateCategory = function (categoryid) {

        //Make a call to get everything under with the target area
        $http.get('/api/CategoriesbyAreaCustoms/' + categoryid + '/',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                } 

            //On Success Response from API
        }).then(function successCallback(response) {

            //Populate the Skills Model with the reponse data for the UI
            $scope.categories = response.data;

            //Call the populateSkills Function to load all the skills for each category
            $scope.populateSkills(0);

            //Get the lenght of the Skills Array to remove
            //$scope.length = $scope.skills.length;

            console.log($scope.categories);

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Self Calling Function to loop through and delete all skills connected to the category
    $scope.deleteskillloop = function (categoryarrayid, skillarrayid) {

        //get the skill id to delete from the skillarrayid
        skillid = $scope.categories[categoryarrayid].skills[skillarrayid].id;

        //Call the Factory
        SkillFactory.delete(skillid)

            //Factory call succeeded
            .then(function (result) {

                //Log the Success
                console.log('Factory Call Succeeded');

                //Update the Display by marking the skill deleted
                //$scope.skills[id].status = "deleted";

                //Increase the Counter
                skillarrayid = skillarrayid + 1;

                //Check to see we are done deleting skills or we have more to do:
                if (skillarrayid < $scope.categories[categoryarrayid].skills.length) {

                    //Still more skills to delete, so keep going...
                    $scope.deleteskillloop(categoryarrayid, skillarrayid);

                } else {

                    console.log('All Skills Deleted!');

                    //Get the CategoryID from the CategoryArrayID
                    categoryid = $scope.categories[categoryarrayid].id;

                    //Call the Factory
                    CategoryFactory.delete(categoryid)

                        //Category Delete Succeeded
                        .then(function (result) {

                            //Log the Success
                            console.log('Factory Call Succeeded');

                            //Re-direct the User to the console projects page 
                            // $location.path('/adminskills/');

                        })

                        //Category Delete Failed
                        .catch(function (error) {

                            //Log the Error
                            console.log('Factory Delete Category Failed');
                            console.log(error.message);

                        });
                }
            })

            //Project creation failed
            .catch(function (error) {

                //Log the Error
                console.log('Factory Call Failed');
                console.log(error.message);

            });
    };

    //Function to Remove all the Categories
    $scope.deletecategoryloop = function (categoryarrayid) {

        //Get the categoryID from the current categoryarrayid
        categoryid = $scope.categories[categoryarrayid].id;

        //Call the function to remove all the skills from the Category
        $scope.deleteskillloop(categoryarrayid, 0);

        //increase the categoryarray by 1
        categoryarrayid = categoryarrayid + 1;

        //Check to see we are done deleting categories or we have more to do:
        if (categoryarrayid < $scope.categories.length) {

            //Still more skills to delete, so keep going...
            $scope.deletecategoryloop(categoryarrayid);

        } else {

            //Call the Factory to Delete the Area
            AreaFactory.delete($routeParams.areaid)

                //Category Delete Succeeded
                .then(function (result) {

                    //Log the Success
                    console.log('Factory Call Succeeded');

                    //Re-direct the User to the console projects page 
                    // $location.path('/adminskills/');

                })

                //Category Delete Failed
                .catch(function (error) {

                    //Log the Error
                    console.log('Factory Delete Category Failed');
                    console.log(error.message);

                });



            console.log('all done...');

        };

    };

    //Function to Delete the Category and all skills. 
    $scope.delete = function () {

        console.log('delete');

        $scope.deletecategoryloop(0);

    };

    //Call the function to Load the Data
    $scope.populateCategory($routeParams.areaid);

});

angularApp.controller("admin_addcategoryCtrl", function ($scope, $rootScope, $http, $routeParams, $location) {

    console.log('Admin Add category Controller Processed');

    //Initialize the data models
    $scope.category = {
        Type: "custom"
    };

    $scope.areacategoriesmasters = {
        AreaId: $routeParams.areaid,
        AreaType: $routeParams.areatype,
        Type: "custom",
        CategoryId: 0
    };

    //Function to Submit the Form
    $scope.submit = function () {

        //Make a Rest Call
        $http.post('/api/CategoriesCustoms/', $scope.category,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }


            //On Succsess of the REST call
            }).then(function (response) {

                console.log(response);

                $scope.areacategoriesmasters.CategoryId = response.data.id;
                $scope.areacategoriesmasters.CategoryType = response.data.type;

                //Make a second Rest Call
                $http.post('/api/AreaCategoriesCustoms/', $scope.areacategoriesmasters,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                        }

                    //On Succsess of the REST call
                    }).then(function (response) {

                        console.log(response);

                        $location.path('/adminskills/');

                        //On Failure of the REST call
                    }, function errorCallback(response) {
                        console.log(response);
                    });

                    //On Failure of the REST call
                    }, function errorCallback(response) {

                console.log($scope.skill);

                console.log(response);

                });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminskills/');
    };

});

angularApp.controller("admin_editcategoryCtrl", function ($scope, $http, $routeParams, $location) {

    //Initialize the data models
    $scope.category = {};

    //Function to Load the Form Data
    $scope.loadcategory = function () {

        //Make a Rest Call
        $http.get('/api/CategoriesCustoms/' + $routeParams.id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }


            //On Succsess of the REST call
            }).then(function (response) {

                $scope.category = response.data;

                console.log($scope.category);

                //On Failure of the REST call
            }, function errorCallback(response) {

                console.log(response);

            });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        //Make a Rest Call
        $http.put('/api/CategoriesCustoms/' + $routeParams.id, $scope.category,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

            //On Succsess of the REST call
            }).then(function (response) {

                $location.path('/adminskills/');

                //On Failure of the REST call
            }, function errorCallback(response) {

                console.log(response);

            });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminskills/');
    };

    //Load the Data
    $scope.loadcategory();

});

angularApp.controller("admin_deletecategoryCtrl", function ($scope, $routeParams, $location, $http, SkillFactory, CategoryFactory) {

    //Make a call to get the Custom Categories
    $http.get('/api/SkillsGroupCustoms/' + $routeParams.categoryid + '/',
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            } 

        //On Success Response from API
    }).then(function successCallback(response) {

        //Populate the Skills Model with the reponse data for the UI
        $scope.skills = response.data;

        //Get the lenght of the Skills Array to remove
        $scope.length = $scope.skills.length;

        console.log($scope.skills);

        //on Fail, log the failure data.
    }, function errorCallback(response) {

        console.log(response);

    });


    //Self Calling Function to loop through and delete all skills connected to the category
    //-------------------------------------------------------------------------------------
    $scope.deleteskillloop = function (id) {

        //Call the Factory
        SkillFactory.delete($scope.skills[id].id)

            //Project update succeeded
            .then(function (result) {

                //Log the Success
                console.log('Factory Call Succeeded');

                //Update the Display by marking the skill deleted
                $scope.skills[id].status = "deleted";

                //Increase the Counter
                id = id + 1;

                //Check to see we are done deleting skills or we have more to do:
                if (id < $scope.length) {

                    //Still more skills to delete, so keep going...
                    $scope.deleteskillloop(id);

                } else {

                    console.log('All Skills Deleted!');

                    //Call the Factory
                    CategoryFactory.delete($routeParams.categoryid)

                        //Project update succeeded
                        .then(function (result) {

                            //Log the Success
                            console.log('Factory Call Succeeded');

                            //Re-direct the User to the console projects page 
                            $location.path('/adminskills/');

                        })

                        //Project creation failed
                        .catch(function (error) {

                            //Log the Error
                            console.log('Factory Call Failed');
                            console.log(error.message);

                        });
                }
            })

            //Project creation failed
            .catch(function (error) {

                //Log the Error
                console.log('Factory Call Failed');
                console.log(error.message);

            });
    };


    //Function to Delete the Category and all skills. 
    $scope.delete = function () {

        console.log('delete');

        $scope.deleteskillloop(0);

    };

});

angularApp.controller("admin_addskillCtrl", function ($scope, $http, $routeParams, $location) {

    console.log('Admin Add Skill Controller Processed');

    console.log($routeParams);

    //Initialize the data models
    $scope.skill = {
        Hidden: false,
        Type: "custom",
    };

    $scope.categoryskillsmaster = {
        CategoryId: $routeParams.categoryid,
        CategoryType: "custom",
        Type: "custom",
        SkillId: ''
    };

    //Function to Submit the Form
    $scope.submit = function () {

        //Make a Rest Call
        $http.post('/api/SkillsCustoms/', $scope.skill,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

            //On Succsess of the REST call
            }).then(function (response) {

                $scope.categoryskillsmaster.SkillId = response.data.id;
                $scope.categoryskillsmaster.SkillType = response.data.type;

                console.log($scope.categoryskillsmaster);

                //Make a second Rest Call
                $http.post('/api/CategorySkillsCustoms/', $scope.categoryskillsmaster,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                        }

                    //On Succsess of the REST call
                    }).then(function (response) {

                        console.log(response);

                        $location.path('/adminskills/');

                        //On Failure of the REST call
                    }, function errorCallback(response) {
                        console.log(response);
                    });

                //On Failure of the REST call
            }, function errorCallback(response) {

                console.log($scope.skill);

                console.log(response);

            });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminskills/');
    };


});

angularApp.controller("admin_editskillCtrl", function ($scope, $http, $routeParams, $location) {

    //Initialize the data models
    $scope.skill = {};

    console.log('Admin Edit Skill Controller Processed');

    //Function to Load the Form Data
    $scope.loadskill = function () {

        //Make a Rest Call
        $http.get('/api/SkillsCustoms/' + $routeParams.id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

            //On Succsess of the REST call
            }).then(function (response) {

                $scope.skill = response.data;

                console.log($scope.skill);

                //On Failure of the REST call
            }, function errorCallback(response) {

                console.log(response);

            });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        //Make a Rest Call
        $http.put('/api/SkillsCustoms/' + $routeParams.id, $scope.skill,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

            //On Succsess of the REST call
            }).then(function (response) {

                $location.path('/adminskills/');

                //On Failure of the REST call
            }, function errorCallback(response) {

                console.log(response);

            });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminskills/');
    };

    //Load the Data
    $scope.loadskill();

});

angularApp.controller("admin_deleteskillCtrl", function ($scope, $rootScope, $location, $routeParams, SkillFactory) {

    console.log('Admin Delete Skill Controller Processed');

    //Populate the 
    $scope.skillid = $routeParams.skillid;

    //Function to call the Project Factory and edit the project. 
    $scope.delete = function () {

        //Call the Factory
        SkillFactory.delete($scope.skillid)

            //Project update succeeded
            .then(function (result) {

                //Log the Success
                console.log('Factory Call Succeeded');
                console.log(result);


                //Reset the Current Skill in the Root Scope
                $rootScope.admin_catalog_state.currentSkill = 0;

                //Re-direct the User to the console projects page 
                $location.path('/adminskills/');

            })

            //Project creation failed
            .catch(function (error) {

                //Log the Error
                console.log('Factory Call Failed');
                console.log(error.message);

            });

    };

});

angularApp.controller("admin_campaignsCtrl", function ($scope) {

    console.log('Admin Campaigns Controller Processed');

});

angularApp.controller("admin_settingsCtrl", function ($scope) {

    console.log('Admin Settings Controller Processed');

});

angularApp.controller("admin_helpCtrl", function ($scope) {

    console.log('Admin Help Controller Processed');

});

//Authentication Controllers

angularApp.controller("loginCtrl", function ($scope, $http) {

    $scope.loginemail = function () {

        var dataObj = {
            email: $scope.loginemail.email,
            template: "loginTemplate.html",
        };

        $http.post('/api/authenticate', dataObj,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {

                $scope.secureloginlink = response.data;
                console.log(response);

            }, function errorCallback(response) {

                console.log("Login Failed");
            });

    };

    console.log('Login Controller Processed');

});

angularApp.controller("authCtrl", function ($scope, $location, $routeParams, $http) {

    //Get the Route Parameters
    $scope.routeparams = {
        UserId: $routeParams.userid,
        Authkey01: $routeParams.authkey01,
        Authkey02: $routeParams.authkey02
    };

    //Call the Authenticate EndPoint
    $http({
        method: 'GET',
        url: '/api/authenticate?UserId=' + $scope.routeparams.UserId + '&Authkey01=' + $scope.routeparams.Authkey01 + '&Authkey02=' + $scope.routeparams.Authkey02

    }).then(function successCallback(response) {

        localStorage.setItem('accessToken', response.data.access_token);
        $location.path('/');

    }, function errorCallback(response) {

        console.log("ERROR: " + response);

    });

});

angularApp.controller("registerCtrl", function ($scope, $location, $http) {


    $scope.register = function () {
        console.log('starting register');
        var dataObj = {
            email: $scope.register.email,
            organization: $scope.register.organization,
            maxusers: 5,
        };

        $http.post('/api/account/registeradmin', dataObj,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {

                console.log(response);
                localStorage.setItem('accessToken', response.data.access_token);
                localStorage.setItem('userName', response.data.userName);
                localStorage.setItem('userId', response.data.userId);
                $location.path('/');

            }, function errorCallback(response) {

                console.log("Register Failed");
            });

    };


    console.log('Register Controller Processed');

});
