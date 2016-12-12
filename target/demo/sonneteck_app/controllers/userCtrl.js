angular.module('starter.user', [])
/**
 * 用户
 */
.controller('UsersCtrl', ['$scope', 'Users','HttpService','dialogsManager','$state','$timeout', '$ionicLoading',function($scope, Users,HttpService,dialogsManager,$state,$timeout, $ionicLoading) {

    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    document.getElementById('loadding').style.visibility="hidden";


    if(navigator.userAgent.match(/OS [8-9]_\d[_\d]* like Mac OS X/)){//判断IOS版本
        if(window.webkit.messageHandlers.getHeadTitle){
            window.webkit.messageHandlers.getHeadTitle.postMessage({body: "User"});
        }
        if(window.webkit.messageHandlers.settingBtnShowOrNot){
            window.webkit.messageHandlers.settingBtnShowOrNot.postMessage({body: "1"});
        }
        if(window.webkit.messageHandlers.backBtnShowOrNot){
            window.webkit.messageHandlers.backBtnShowOrNot.postMessage({body: "0"});
        }
    }else {
        if (window.js.getHeadTitle) {
            window.js.getHeadTitle('User'); // 调用原生提供的修改标题方法。
        }
        if (window.js.settingBtnShowOrNot) {
            window.js.settingBtnShowOrNot(1);
        }
        if(window.js.backBtnShowOrNot) {
            window.js.backBtnShowOrNot(0)
        }
    }

    Users.all().then(function (data) {
        $ionicLoading.hide();
        if(data.code != '0'){
            dialogsManager.showMessage(data.message,"red");
        }else {
            dialogsManager.showMessage(data.message,"green");
            $scope.users = [];
            for(var i=0;i<data.content.length;i++){
                $scope.users[i] = {};
                $scope.users[i].country = data.content[i].country;
                $scope.users[i].e_mail = data.content[i].e_mail;
                $scope.users[i].password = data.content[i].password;
                $scope.users[i].phone = data.content[i].phone;
                $scope.users[i].user_authorization = data.content[i].user_authorization;
                $scope.users[i].user_id = data.content[i].user_id;
                $scope.users[i].user_name = data.content[i].user_name;
                if(data.content[i].user_id == window.userId){
                    $scope.users[i].role = 'Admin'
                }else {
                    $scope.users[i].role = 'User'
                }
                // "father_user": window.userId
                // "father_user" : "xxxxxxxxx"
            }
        }
    })

    //下拉刷新
    $scope.doRefresh = function() {
        $timeout(function() {
            //simulate async response
            Users.all().then(function (data) {
                $ionicLoading.hide();
                if(data.code != '0'){
                    dialogsManager.showMessage(data.message,"red");
                }else {
                    dialogsManager.showMessage(data.message,"green");
                    $scope.users = [];
                    for(var i=0;i<data.content.length;i++){
                        $scope.users[i] = {};
                        $scope.users[i].country = data.content[i].country;
                        $scope.users[i].e_mail = data.content[i].e_mail;
                        $scope.users[i].password = data.content[i].password;
                        $scope.users[i].phone = data.content[i].phone;
                        $scope.users[i].user_authorization = data.content[i].user_authorization;
                        $scope.users[i].user_id = data.content[i].user_id;
                        $scope.users[i].user_name = data.content[i].user_name;
                        if(data.content[i].user_id == window.userId){
                            $scope.users[i].role = 'Admin'
                        }else {
                            $scope.users[i].role = 'User'
                        }
                        // "father_user": window.userId
                        // "father_user" : "xxxxxxxxx"
                    }
                }
            })
        $scope.$broadcast('scroll.refreshComplete');
        }, 1000);
    };

   //新建用户
    $scope.newUser = function () {
        $state.go('new-user');
    }
    $scope.toUserDetail = function (user) {
        if(user.role == 'Admin'){
            dialogsManager.showMessage("You can not edit Admin!","red");
        }else {
            $state.go('user-detail', {userId: user.user_id,userName: user.user_name,userPhone: user.phone,userPwd: user.password,userCoun: user.country,userRole: user.user_authorization,UserEMail: user.e_mail});
        }
    }
}])

/**
 * 新建用户
 */
    .controller('NewUserCtrl',function ($scope, $state, $stateParams, $ionicPopup, Users,dialogsManager,$timeout, $ionicLoading) {
        // if (window.js) {
        //     if (window.js.getHeadTitle) {
        //         window.js.getHeadTitle('New User'); // 调用原生提供的修改标题方法。
        //     }
        //     if (window.js.settingBtnShowOrNot) {
        //         window.js.settingBtnShowOrNot(0);
        //     }
        //     if (window.js.backBtnShowOrNot) {
        //         window.js.backBtnShowOrNot(1)
        //     }
        // }
        if(navigator.userAgent.match(/OS [8-9]_\d[_\d]* like Mac OS X/)){//判断IOS版本
            if(window.webkit.messageHandlers.getHeadTitle){
                window.webkit.messageHandlers.getHeadTitle.postMessage({body: "New User"});
            }
            if(window.webkit.messageHandlers.settingBtnShowOrNot){
                window.webkit.messageHandlers.settingBtnShowOrNot.postMessage({body: "1"});
            }
            if(window.webkit.messageHandlers.backBtnShowOrNot){
                window.webkit.messageHandlers.backBtnShowOrNot.postMessage({body: "1"});
            }
        }else {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('New User'); // 调用原生提供的修改标题方法。
            }
            if (window.js.settingBtnShowOrNot) {
                window.js.settingBtnShowOrNot(1);
            }
            if(window.js.backBtnShowOrNot) {
                window.js.backBtnShowOrNot(1)
            }
        }


        $scope.countries = [
            {"countryId" : "86"},
            {"countryId" : "852"},
            {"countryId" : "886"},
            {"countryId" : "853"},
            {"countryId" : "1"},
            {"countryId" : "61"}
        ]
        $scope.my = {};
        $scope.my.newUserName = '';//子用户名
        $scope.my.newUserPassword = '';//子用户密码
        $scope.my.newUserEmail = '';//子用户邮箱
        $scope.my.newUserPhone = '';//子用户电话
        $scope.my.country = '';//子用户手机号前缀
        
        $scope.newUser = function () {
            /**
             * 控制器与服务交互
             */
            var filterEmail  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            // var filterPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            if(!filterEmail.test($scope.my.newUserEmail)){
                dialogsManager.showMessage("Email Address Format Error","red");
            }else {
                if($scope.my.newUserName == '' || $scope.my.newUserPassword == '' || $scope.my.newUserPhone == '' || $scope.my.country == ''){
                    dialogsManager.showMessage("Message can not be null","red");
                }else {
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    Users.newUser($scope.my).then(function (data) {
                        $ionicLoading.hide();
                        if(data.code == '0'){
                            dialogsManager.showMessage(data.message,"green");
                        }else {
                            dialogsManager.showMessage(data.message,"red");
                        }
                    })
                }
            }
        }
    })
/**
 * 用户详情
 */
.controller('UserDetailCtrl', function($scope, $state, $stateParams, $ionicPopup, Users,dialogsManager,$timeout, $ionicLoading) {
    // if (window.js) {
    //     if (window.js.getHeadTitle) {
    //         window.js.getHeadTitle('User Detail'); // 调用原生提供的修改标题方法。
    //     }
    //     if (window.js.settingBtnShowOrNot) {
    //         window.js.settingBtnShowOrNot(0);
    //     }
    //     if (window.js.backBtnShowOrNot) {
    //         window.js.backBtnShowOrNot(1)
    //     }
    // }
    if(navigator.userAgent.match(/OS [8-9]_\d[_\d]* like Mac OS X/)){//判断IOS版本
        if(window.webkit.messageHandlers.getHeadTitle){
            window.webkit.messageHandlers.getHeadTitle.postMessage({body: "User Detail"});
        }
        if(window.webkit.messageHandlers.settingBtnShowOrNot){
            window.webkit.messageHandlers.settingBtnShowOrNot.postMessage({body: "1"});
        }
        if(window.webkit.messageHandlers.backBtnShowOrNot){
            window.webkit.messageHandlers.backBtnShowOrNot.postMessage({body: "1"});
        }
    }else {
        if (window.js.getHeadTitle) {
            window.js.getHeadTitle('User Detail'); // 调用原生提供的修改标题方法。
        }
        if (window.js.settingBtnShowOrNot) {
            window.js.settingBtnShowOrNot(1);
        }
        if(window.js.backBtnShowOrNot) {
            window.js.backBtnShowOrNot(1)
        }
    }



    var userId = $stateParams.userId;
    var userEMail = $stateParams.UserEMail;
    $scope.userName = $stateParams.userName;
    $scope.userPhone = $stateParams.userPhone;
    $scope.userPwd = $stateParams.userPwd;
    $scope.userCoun = $stateParams.userCoun;
    $scope.userRole = $stateParams.userRole;


    $scope.toReName = function() {
        $state.go('user-rename', {userId: userId,userName: $scope.userName,userPhone: $scope.userPhone,userPwd: $scope.userPwd,userCoun: $scope.userCoun,userRole: $scope.userRole,UserEMail: userEMail});
    }
    $scope.toRePwd = function() {
        console.log('11');
        $state.go('user-repwd', {userId: userId,userName: $scope.userName,userPhone: $scope.userPhone,userPwd: $scope.userPwd,userCoun: $scope.userCoun,userRole: $scope.userRole,UserEMail: userEMail});
    }
    $scope.toRePhone = function () {
        $state.go('user-rephone',{userId: userId,userName: $scope.userName,userPhone: $scope.userPhone,userPwd: $scope.userPwd,userCoun: $scope.userCoun,userRole: $scope.userRole,UserEMail: userEMail});
    }
    $scope.toReEmail = function () {
        $state.go('user-reemail',{userId: userId,userName: $scope.userName,userPhone: $scope.userPhone,userPwd: $scope.userPwd,userCoun: $scope.userCoun,userRole: $scope.userRole,UserEMail: userEMail});
    }
    // 禁用用户提示框
    $scope.disableConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'prompt',
            template: 'Do you want to disable this user?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                // Setup the loader
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                var disableUserData = {
                    "child_user_id":userId,
                    "user_name":$scope.userName,
                    "password":$scope.userPwd,
                    "e_mail":userEMail,
                    "phone":$scope.userPhone,
                    "user_authorization":'0'
                }
                Users.editUser(disableUserData).then(function (data) {
                    $ionicLoading.hide();
                    if(data.code == '0'){
                        dialogsManager.showMessage(data.message,"green");
                        Users.all().then(function (data) {
                            for(var i = 0;i<data.length;i++){
                                if(data[i].user_id == userId){
                                    $scope.userRole = data[i].user_authorization;
                                }
                            }
                        })
                    }else {
                        dialogsManager.showMessage(data.message,"red");
                    }
                });
            } else {
                console.log('no');
            }
        });
    };
    //启用用户提示框
    $scope.enableConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'prompt',
            template: 'Do you want to enable this user?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                // Setup the loader
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                console.log('yes');
                var enableUserData = {
                    "child_user_id":userId,
                    "user_name":$scope.userName,
                    "password":$scope.userPwd,
                    "e_mail":userEMail,
                    "phone":$scope.userPhone,
                    "user_authorization":'1'
                }
                console.log('启用子用户传参',enableUserData);
                Users.editUser(enableUserData).then(function (data) {
                    $ionicLoading.hide();
                    if(data.code == '0'){
                        dialogsManager.showMessage(data.message,"green");
                        Users.all().then(function (data) {
                            for(var i = 0;i<data.length;i++){
                                if(data[i].user_id == userId){
                                    $scope.userRole = data[i].user_authorization;
                                }
                            }
                        })
                    }else {
                        dialogsManager.showMessage(data.message,"red");
                    }
                });
            } else {
                console.log('no');
            }
        });
    };
    //删除用户提示框
    $scope.deleteConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'prompt',
            template: 'Do you want to delete this user?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                // Setup the loader
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                var deleteUserData = {
                    "child_user_id":userId
                }
                Users.remove(deleteUserData).then(function (data) {
                    $ionicLoading.hide();
                    if(data.code != '0'){
                        dialogsManager.showMessage(data.message,"red");
                    }else {
                        dialogsManager.showMessage(data.message,"green");
                        $state.go('users')
                    }
                })
            } else {
                console.log('no');
            }
        });
    };
    $scope.disableUser = function(){
        $scope.disableConfirm();
    };
    $scope.enableUser = function () {
        $scope.enableConfirm();
    };
    $scope.deleteUser = function () {
        $scope.deleteConfirm();
    }
})

/**
 * 修改用户名
 */
    .controller('UserRenameCtrl', function($scope, $state, $stateParams, $ionicPopup, Users,dialogsManager,$timeout, $ionicLoading){
        // if (window.js) {
        //     if (window.js.getHeadTitle) {
        //             window.js.getHeadTitle('Reset User Name'); // 调用原生提供的修改标题方法。
        //     }
        //     if (window.js.settingBtnShowOrNot) {
        //         window.js.settingBtnShowOrNot(0);
        //     }
        //     if (window.js.backBtnShowOrNot) {
        //         window.js.backBtnShowOrNot(1)
        //     }
        // }
        if(navigator.userAgent.match(/OS [8-9]_\d[_\d]* like Mac OS X/)){//判断IOS版本
            if(window.webkit.messageHandlers.getHeadTitle){
                window.webkit.messageHandlers.getHeadTitle.postMessage({body: "Reset User Name"});
            }
            if(window.webkit.messageHandlers.settingBtnShowOrNot){
                window.webkit.messageHandlers.settingBtnShowOrNot.postMessage({body: "1"});
            }
            if(window.webkit.messageHandlers.backBtnShowOrNot){
                window.webkit.messageHandlers.backBtnShowOrNot.postMessage({body: "1"});
            }
        }else {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Reset User Name'); // 调用原生提供的修改标题方法。
            }
            if (window.js.settingBtnShowOrNot) {
                window.js.settingBtnShowOrNot(1);
            }
            if(window.js.backBtnShowOrNot) {
                window.js.backBtnShowOrNot(1)
            }
        }


        $scope.user = {
            userId : $stateParams.userId,
            userEMail :$stateParams.UserEMail,
            userName : $stateParams.userName,
            userPhone : $stateParams.userPhone,
            userPwd : $stateParams.userPwd,
            userCoun : $stateParams.userCoun,
            userRole : $stateParams.userRole
        }
        console.log('修改用户名页面收到的信息',$scope.user)
        //修改用户名提示框
        $scope.renameConfirm = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'prompt',
                template: 'Do you want to rename this user?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    // Setup the loader
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    var renameUserData = {
                        "child_user_id":$scope.user.userId,
                        "user_name":$scope.user.userName,
                        "password":$scope.user.userPwd,
                        "e_mail":$scope.user.userEMail,
                        "phone":$scope.user.userPhone,
                        "country" : $scope.user.userCoun,
                        "user_authorization":$scope.user.userRole
                    }
                    Users.editUser(renameUserData).then(function (data) {
                        $ionicLoading.hide();
                        if(data.code == '0'){
                            dialogsManager.showMessage(data.message,"green");
                        }else {
                            dialogsManager.showMessage(data.message,"red");
                            $state.go('users');
                        }
                    })
                } else {
                    console.log('no');
                }
            });
        };
        $scope.rename = function () {
            $scope.renameConfirm();
        }
    })
    /**
     * 修改手机号
     */
    .controller('UserRephoneCtrl', function($scope, $state, $stateParams, $ionicPopup, Users,dialogsManager,$timeout, $ionicLoading){
        // if (window.js) {
        //     if (window.js.getHeadTitle) {
        //         window.js.getHeadTitle('Reset Phone Number'); // 调用原生提供的修改标题方法。
        //     }
        //     if (window.js.settingBtnShowOrNot) {
        //         window.js.settingBtnShowOrNot(0);
        //     }
        //     if (window.js.backBtnShowOrNot) {
        //         window.js.backBtnShowOrNot(1)
        //     }
        // }
        if(navigator.userAgent.match(/OS [8-9]_\d[_\d]* like Mac OS X/)){//判断IOS版本
            if(window.webkit.messageHandlers.getHeadTitle){
                window.webkit.messageHandlers.getHeadTitle.postMessage({body: "Reset Phone Number"});
            }
            if(window.webkit.messageHandlers.settingBtnShowOrNot){
                window.webkit.messageHandlers.settingBtnShowOrNot.postMessage({body: "1"});
            }
            if(window.webkit.messageHandlers.backBtnShowOrNot){
                window.webkit.messageHandlers.backBtnShowOrNot.postMessage({body: "1"});
            }
        }else {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Reset Phone Number'); // 调用原生提供的修改标题方法。
            }
            if (window.js.settingBtnShowOrNot) {
                window.js.settingBtnShowOrNot(1);
            }
            if(window.js.backBtnShowOrNot) {
                window.js.backBtnShowOrNot(1)
            }
        }


        $scope.user = {
            userId : $stateParams.userId,
            userEMail :$stateParams.UserEMail,
            userName : $stateParams.userName,
            userPhone : $stateParams.userPhone,
            userPwd : $stateParams.userPwd,
            userCoun : $stateParams.userCoun,
            userRole : $stateParams.userRole
        }
        //修改手机号提示框
        $scope.rePhoneConfirm = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'prompt',
                template: 'Do you want to reset this phone number?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    // Setup the loader
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    var renameUserData = {
                        "child_user_id":$scope.user.userId,
                        "user_name":$scope.user.userName,
                        "password":$scope.user.userPwd,
                        "e_mail":$scope.user.userEMail,
                        "phone":$scope.user.userPhone,
                        "country" : $scope.user.userCoun,
                        "user_authorization":$scope.user.userRole
                    }
                    Users.editUser(renameUserData).then(function (data) {
                        $ionicLoading.hide();
                        if(data.code == '0'){
                            dialogsManager.showMessage(data.message,"green");
                        }else {
                            dialogsManager.showMessage(data.message,"red");
                            $state.go('users');
                        }
                    })
                } else {
                    console.log('no');
                }
            });
        };
        $scope.rePhone = function () {
            $scope.rePhoneConfirm();
        }
    })
    /**
     * 修改邮箱
     */
    .controller('UserReemailCtrl', function($scope, $state, $stateParams, $ionicPopup, Users,dialogsManager,$timeout, $ionicLoading){
        // if (window.js) {
        //     if (window.js.getHeadTitle) {
        //         window.js.getHeadTitle('Reset Email Address'); // 调用原生提供的修改标题方法。
        //     }
        //     if (window.js.settingBtnShowOrNot) {
        //         window.js.settingBtnShowOrNot(0);
        //     }
        //     if (window.js.backBtnShowOrNot) {
        //         window.js.backBtnShowOrNot(1)
        //     }
        // }
        if(navigator.userAgent.match(/OS [8-9]_\d[_\d]* like Mac OS X/)){//判断IOS版本
            if(window.webkit.messageHandlers.getHeadTitle){
                window.webkit.messageHandlers.getHeadTitle.postMessage({body: "Reset Email Address"});
            }
            if(window.webkit.messageHandlers.settingBtnShowOrNot){
                window.webkit.messageHandlers.settingBtnShowOrNot.postMessage({body: "1"});
            }
            if(window.webkit.messageHandlers.backBtnShowOrNot){
                window.webkit.messageHandlers.backBtnShowOrNot.postMessage({body: "1"});
            }
        }else {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Reset Email Address'); // 调用原生提供的修改标题方法。
            }
            if (window.js.settingBtnShowOrNot) {
                window.js.settingBtnShowOrNot(1);
            }
            if(window.js.backBtnShowOrNot) {
                window.js.backBtnShowOrNot(1)
            }
        }
        $scope.user = {
            userId : $stateParams.userId,
            userEMail :$stateParams.UserEMail,
            userName : $stateParams.userName,
            userPhone : $stateParams.userPhone,
            userPwd : $stateParams.userPwd,
            userCoun : $stateParams.userCoun,
            userRole : $stateParams.userRole
        }
        //修改邮箱提示框
        $scope.reEmailConfirm = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'prompt',
                template: 'Do you want to reset this email address?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    // Setup the loader
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    var renameUserData = {
                        "child_user_id":$scope.user.userId,
                        "user_name":$scope.user.userName,
                        "password":$scope.user.userPwd,
                        "e_mail":$scope.user.userEMail,
                        "phone":$scope.user.userPhone,
                        "country" : $scope.user.userCoun,
                        "user_authorization":$scope.user.userRole
                    }
                    Users.editUser(renameUserData).then(function (data) {
                        $ionicLoading.hide();
                        if(data.code == '0'){
                            dialogsManager.showMessage(data.message,"green");
                        }else {
                            dialogsManager.showMessage(data.message,"red");
                            $state.go('users');
                        }
                    })
                } else {
                    console.log('no');
                }
            });
        };
        $scope.reEmail = function () {
            $scope.reEmailConfirm();
        }
    })
/**
 * 修改子用户密码
 */
    .controller('UserRepwdCtrl', function($scope, $state, $stateParams, $ionicPopup, Users,dialogsManager,$timeout, $ionicLoading){
        // if (window.js) {
        //     if (window.js.getHeadTitle) {
        //         window.js.getHeadTitle('Reset Password'); // 调用原生提供的修改标题方法。
        //     }
        //     if (window.js.settingBtnShowOrNot) {
        //         window.js.settingBtnShowOrNot(0);
        //     }
        //     if (window.js.backBtnShowOrNot) {
        //         window.js.backBtnShowOrNot(1)
        //     }
        // }

        if(navigator.userAgent.match(/OS [8-9]_\d[_\d]* like Mac OS X/)){//判断IOS版本
            if(window.webkit.messageHandlers.getHeadTitle){
                window.webkit.messageHandlers.getHeadTitle.postMessage({body: "Reset Password"});
            }
            if(window.webkit.messageHandlers.settingBtnShowOrNot){
                window.webkit.messageHandlers.settingBtnShowOrNot.postMessage({body: "1"});
            }
            if(window.webkit.messageHandlers.backBtnShowOrNot){
                window.webkit.messageHandlers.backBtnShowOrNot.postMessage({body: "1"});
            }
        }else {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Reset Password'); // 调用原生提供的修改标题方法。
            }
            if (window.js.settingBtnShowOrNot) {
                window.js.settingBtnShowOrNot(1);
            }
            if(window.js.backBtnShowOrNot) {
                window.js.backBtnShowOrNot(1)
            }
        }

        $scope.user = {
            userId : $stateParams.userId,
            userEMail :$stateParams.UserEMail,
            userName : $stateParams.userName,
            userPhone : $stateParams.userPhone,
            userPwd : $stateParams.userPwd,
            userCoun : $stateParams.userCoun,
            userRole : $stateParams.userRole,
            newPwd : '',
            repeatPwd :''
        }
        //修改用户名提示框
        $scope.repwdConfirm = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'prompt',
                template: 'Do you want to set password?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    // Setup the loader
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    var repwdUserData = {
                        "child_user_id":$scope.user.userId,
                        "user_name":$scope.user.userName,
                        "password":$scope.user.newPwd,
                        "e_mail":$scope.user.userEMail,
                        "phone":$scope.user.userPhone,
                        "country" : $scope.user.userCoun,
                        "user_authorization":$scope.user.userRole
                    }
                    Users.editUser(repwdUserData).then(function (data) {
                        $ionicLoading.hide();
                        if(data.code == '0'){
                            dialogsManager.showMessage(data.message,"green");
                        }else {
                            dialogsManager.showMessage(data.message,"red");
                            $state.go('users');
                        }
                    })
                } else {
                    console.log('no');
                }
            });
        };
        $scope.repwd = function () {
            if($scope.user.newPwd  !== $scope.user.repeatPwd){
                dialogsManager.showMessage("The two passwords differ","red");
            }else if($scope.newPwd == '' || $scope.repeatPwd == ''){
                dialogsManager.showMessage("Password can not be null","red");
            }else {
                $scope.repwdConfirm();
            }
        }
    })