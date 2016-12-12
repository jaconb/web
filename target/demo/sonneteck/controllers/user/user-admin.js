angular.module('sntApp').controller('UserCtrl', function ($scope, $uibModal, $log, $state,$rootScope,AuthService,$cookieStore) {

    // 页面加载
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';

    var user_id = $cookieStore.get('user_id');
    var token = $cookieStore.get('token');
    // 查询子用户
    $scope.userProm = AuthService.myHttp(token,{},'GET','user').then(function (data) {
        if(data.code == '0' && data.content){
            $scope.Adminnisusers = [];
            for(var i=0;i<data.content.length;i++){
                $scope.Adminnisusers[i] = {};
                $scope.Adminnisusers[i].country = data.content[i].country;
                $scope.Adminnisusers[i].e_mail = data.content[i].e_mail;
                $scope.Adminnisusers[i].password = data.content[i].password;
                $scope.Adminnisusers[i].phone = data.content[i].phone;
                $scope.Adminnisusers[i].user_authorization = data.content[i].user_authorization;
                $scope.Adminnisusers[i].user_id = data.content[i].user_id;
                $scope.Adminnisusers[i].user_name = data.content[i].user_name;
                if(data.content[i].user_id == user_id){
                    $scope.Adminnisusers[i].role = 'Admin'
                }else {
                    $scope.Adminnisusers[i].role = 'User'
                }
            }
        }else {
            $scope.Adminnisusers = [];
        }
    })

    //添加用户后查找子用户
    $rootScope.$on('addNewUserSuccess',function () {
        // 查询子用户
        var userProm = AuthService.myHttp(token,{},'GET','user').then(function (data) {
            if(data.code == '0' && data.content){
                $scope.Adminnisusers = [];
                for(var i=0;i<data.content.length;i++){
                    $scope.Adminnisusers[i] = {};
                    $scope.Adminnisusers[i].country = data.content[i].country;
                    $scope.Adminnisusers[i].e_mail = data.content[i].e_mail;
                    $scope.Adminnisusers[i].password = data.content[i].password;
                    $scope.Adminnisusers[i].phone = data.content[i].phone;
                    $scope.Adminnisusers[i].user_authorization = data.content[i].user_authorization;
                    $scope.Adminnisusers[i].user_id = data.content[i].user_id;
                    $scope.Adminnisusers[i].user_name = data.content[i].user_name;
                    if(data.content[i].user_id == user_id){
                        $scope.Adminnisusers[i].role = 'Admin'
                    }else {
                        $scope.Adminnisusers[i].role = 'User'
                    }
                }
            }else {
                $scope.Adminnisusers = [];
            }
        })
    })

    //删除子用户后查找子用户
    $rootScope.$on('deleteUserSuccess',function () {
        // 查询子用户
        var userProm = AuthService.myHttp(token,{},'GET','user').then(function (data) {
            if(data.code == '0' && data.content){
                $scope.Adminnisusers = [];
                for(var i=0;i<data.content.length;i++){
                    $scope.Adminnisusers[i] = {};
                    $scope.Adminnisusers[i].country = data.content[i].country;
                    $scope.Adminnisusers[i].e_mail = data.content[i].e_mail;
                    $scope.Adminnisusers[i].password = data.content[i].password;
                    $scope.Adminnisusers[i].phone = data.content[i].phone;
                    $scope.Adminnisusers[i].user_authorization = data.content[i].user_authorization;
                    $scope.Adminnisusers[i].user_id = data.content[i].user_id;
                    $scope.Adminnisusers[i].user_name = data.content[i].user_name;
                    if(data.content[i].user_id == user_id){
                        $scope.Adminnisusers[i].role = 'Admin'
                    }else {
                        $scope.Adminnisusers[i].role = 'User'
                    }
                }
            }else {
                $scope.Adminnisusers = [];
            }
        })
    })

    //禁用之后刷新
    $rootScope.$on('disableUserSuccess',function () {
        // 查询子用户
        var userProm = AuthService.myHttp(token,{},'GET','user').then(function (data) {
            if(data.code == '0' && data.content){
                $scope.Adminnisusers = [];
                for(var i=0;i<data.content.length;i++){
                    $scope.Adminnisusers[i] = {};
                    $scope.Adminnisusers[i].country = data.content[i].country;
                    $scope.Adminnisusers[i].e_mail = data.content[i].e_mail;
                    $scope.Adminnisusers[i].password = data.content[i].password;
                    $scope.Adminnisusers[i].phone = data.content[i].phone;
                    $scope.Adminnisusers[i].user_authorization = data.content[i].user_authorization;
                    $scope.Adminnisusers[i].user_id = data.content[i].user_id;
                    $scope.Adminnisusers[i].user_name = data.content[i].user_name;
                    if(data.content[i].user_id == user_id){
                        $scope.Adminnisusers[i].role = 'Admin'
                    }else {
                        $scope.Adminnisusers[i].role = 'User'
                    }
                }
            }else {
                $scope.Adminnisusers = [];
            }
        })
    })

    //修改之后查找子用户
    $rootScope.$on('editUserSuccess',function () {
        // 查询子用户
        var userProm = AuthService.myHttp(token,{},'GET','user').then(function (data) {
            if(data.code == '0' && data.content){
                $scope.Adminnisusers = [];
                for(var i=0;i<data.content.length;i++){
                    $scope.Adminnisusers[i] = {};
                    $scope.Adminnisusers[i].country = data.content[i].country;
                    $scope.Adminnisusers[i].e_mail = data.content[i].e_mail;
                    $scope.Adminnisusers[i].password = data.content[i].password;
                    $scope.Adminnisusers[i].phone = data.content[i].phone;
                    $scope.Adminnisusers[i].user_authorization = data.content[i].user_authorization;
                    $scope.Adminnisusers[i].user_id = data.content[i].user_id;
                    $scope.Adminnisusers[i].user_name = data.content[i].user_name;
                    if(data.content[i].user_id == user_id){
                        $scope.Adminnisusers[i].role = 'Admin'
                    }else {
                        $scope.Adminnisusers[i].role = 'User'
                    }
                }
            }else {
                $scope.Adminnisusers = [];
            }
        })
    })

    //删除用户提示框
    $scope.deleteUser = function (Users) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'deleteUserConfirm.html',
            controller: 'DeleteUserModalCtrl',
            resolve: {
                Users: function () {
                    return Users;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };

    // 新建子用户弹窗
    $scope.newUser = function () {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'newUser.html',
            controller: 'NewUserCtrl'
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };
    
    //子用户详情
    $scope.editUser = function (Users) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'userDetail.html',
            controller: 'UserDetailCtrl',
            resolve: {
                Users: function () {
                    return Users;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };

    //禁用用户提示框
    $scope.disableUser = function (Users) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'disableUserConfirm.html',
            controller: 'DisableUserDetailCtrl',
            resolve: {
                Users: function () {
                    return Users;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };
    //解禁子用户
    $scope.enableUser = function (Users) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'enabledUserConfirm.html',
            controller: 'EnabledUserDetailCtrl',
            resolve: {
                Users: function () {
                        return Users;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };
})

    /**
     * 子用户详情
     */
    .controller('UserDetailCtrl',function ($scope, $uibModalInstance,AuthService,$stateParams, toaster, POPTIMEOUT,$rootScope,User,Users) {

        // 页面加载
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = '';
        $scope.backdrop = false;
        $scope.promise = null;
        $scope.templateUrl = './pages/custom-loading-template.html';

        $scope.countries = [
            {"countryId" : "86"},
            {"countryId" : "852"},
            {"countryId" : "886"},
            {"countryId" : "853"},
            {"countryId" : "1"},
            {"countryId" : "61"}
        ]
        $scope.users = Users;
        $scope.editUserOk = function (users) {
            var filterEmail  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            // var filterPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            if(!filterEmail.test(users.e_mail)){
                toaster.pop({type: 'error', title: 'E-mail', body: 'Format Error', timeout: POPTIMEOUT});
            }else {
                if(users.user_name == '' || users.password == '' || users.phone == ''){
                    toaster.pop({type: 'error', title: 'Error', body:'Message could not be null', timeout: POPTIMEOUT});
                }else {
                    $scope.editUserProm = User.editUser(users).then(function (data) {
                        if(data.code == '0'){
                            toaster.pop({type: 'success', title: Users.user_name, body: data.message, timeout: POPTIMEOUT});
                            $rootScope.$broadcast('editUserSuccess');
                            $uibModalInstance.close();
                        }else {
                            toaster.pop({type: 'error', title: Users.user_name, body: data.message, timeout: POPTIMEOUT});
                        }
                    })
                }
                // }
            }
        };
        $scope.editUserCancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

    /**
     * 禁用子用户控制器
     */
    .controller('DisableUserDetailCtrl',function ($scope, $uibModalInstance,AuthService,$stateParams, toaster, POPTIMEOUT,$rootScope,User,Users) {
        // 页面加载
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = '';
        $scope.backdrop = false;
        $scope.promise = null;
        $scope.templateUrl = './pages/custom-loading-template.html';

        $scope.disableUserName = Users.user_name;
        // $scope.disOrEn = Users.user_authorization == '0'? 'Enabled' : 'Disabled'
        $scope.disableUserOk = function () {
            $scope.disabledUserProm = User.disableUser(Users).then(function (data) {
                if(data.code == '0'){
                    toaster.pop({type: 'success', title: Users.user_name, body: data.message, timeout: POPTIMEOUT});
                    $rootScope.$broadcast('disableUserSuccess');
                    $uibModalInstance.close();
                }else {
                    toaster.pop({type: 'error', title: Users.user_name, body: data.message, timeout: POPTIMEOUT});
                }
            })
        };
        $scope.disableUserCancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

    /**
     * 解禁子用户控制器
     */
    .controller('EnabledUserDetailCtrl',function ($scope, $uibModalInstance,AuthService,$stateParams, toaster, POPTIMEOUT,$rootScope,User,Users) {
        // 页面加载
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = '';
        $scope.backdrop = false;
        $scope.promise = null;
        $scope.templateUrl = './pages/custom-loading-template.html';

        $scope.enabledUserName = Users.user_name;
        // $scope.disOrEn = Users.user_authorization == '0'? 'Enabled' : 'Disabled'
        $scope.enabledUserOk = function () {
            $scope.enabledUserProm = User.enableUser(Users).then(function (data) {
                if(data.code == '0'){
                    toaster.pop({type: 'success', title: Users.user_name, body: data.message, timeout: POPTIMEOUT});
                    $rootScope.$broadcast('disableUserSuccess');
                    $uibModalInstance.close();
                }else {
                    toaster.pop({type: 'error', title: Users.user_name, body: data.message, timeout: POPTIMEOUT});
                }
            })
        };
        $scope.enablesUserCancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

    /**
     * 新建子用户控制器
     */
    .controller('NewUserCtrl',function ($scope, $uibModalInstance,AuthService,$stateParams, toaster, POPTIMEOUT,$rootScope,User) {
        // 页面加载
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = '';
        $scope.backdrop = false;
        $scope.promise = null;
        $scope.templateUrl = './pages/custom-loading-template.html';


        $scope.countries = [
            {"countryId" : "86"},
            {"countryId" : "852"},
            {"countryId" : "886"},
            {"countryId" : "853"},
            {"countryId" : "1"},
            {"countryId" : "61"}
        ]
        $scope.my = {};
        /**
         * 控制器与页面交互
         */
        $scope.my.newUserName = '';//子用户名
        $scope.my.newUserPassword = '';//子用户密码
        $scope.my.newUserEmail = '';//子用户邮箱
        $scope.my.newUserPhone = '';//子用户电话
        $scope.my.country = '';//子用户手机号前缀
        $scope.newUserOk = function () {
            /**
             * 控制器与服务交互
             */
            var filterEmail  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            // var filterPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            if(!filterEmail.test($scope.my.newUserEmail)){
                toaster.pop({type: 'error', title: 'E-mail', body: 'Format Error', timeout: POPTIMEOUT});
            }else {
                if($scope.my.newUserName == '' || $scope.my.newUserPassword == '' || $scope.my.newUserPhone == '' || $scope.my.country == ''){
                    toaster.pop({type: 'error', title: 'Error', body:'Message could not be null', timeout: POPTIMEOUT});
                }else {
                    $scope.newUserProm = User.newUser($scope.my).then(function (data) {
                        // $scope.newUserProm = data.content;
                        if(data.code == '0'){
                            toaster.pop({type: 'success', title: 'User', body: data.message, timeout: POPTIMEOUT});
                            $rootScope.$broadcast('addNewUserSuccess');
                            $uibModalInstance.close();
                        }else {
                            toaster.pop({type: 'error', title: 'User', body: data.message, timeout: POPTIMEOUT});
                        }
                    })
                }
            }
        };
        $scope.newUserCancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

/**
 * 删除子用户控制器
 */
    .controller('DeleteUserModalCtrl',function ($scope, $uibModalInstance,AuthService,$stateParams, toaster, POPTIMEOUT,$rootScope,User,Users) {

        // 页面加载
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = '';
        $scope.backdrop = false;
        $scope.promise = null;
        $scope.templateUrl = './pages/custom-loading-template.html';

        $scope.deleteUserName = Users.user_name;
        $scope.deleteUserOk = function () {
            $scope.deleteUserProm = User.deleteUser(Users).then(function (data) {
                if(data.code == '0'){
                    toaster.pop({type: 'success', title: Users.user_name, body: data.message, timeout: POPTIMEOUT});
                    $rootScope.$broadcast('deleteUserSuccess');
                    $uibModalInstance.close();
                }else {
                    toaster.pop({type: 'error', title: Users.user_name, body: data.message, timeout: POPTIMEOUT});
                }
            })
        };
        $scope.deleteUserCancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
