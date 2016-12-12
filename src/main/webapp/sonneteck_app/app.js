// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
        'starter.services',
        'starter.region',
        'starter.user',
        'starter.regionChart'
    ])

    .run(function ($ionicPlatform, $rootScope, $ionicPopup) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        document.getElementById('loadding').style.visibility = "hidden"; // todo，暂时先放在这里，需要对白屏问题的加载做出解决。

        // 提示框
        $rootScope.promptBox = function (title, template, callback) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: template
            });

            alertPopup.then(function (res) {
                if (callback) callback();
            });
        };

        // 删除设备提示-确认/取消删除
        $rootScope.showConfirm = function (title, template, callback) { // 提示窗口
            var confirmPopup = $ionicPopup.confirm({
                title: title,
                template: template
            });
            confirmPopup.then(function (res) {
                if (res) {
                    if (callback) callback();
                } else {
                    console.log('no');
                }
            });
        };


        // window.GetUserInfoCallBack = function (result) {
        //     var user = jQuery.parseJSON(result.replace(/\r\n|\n/g, ""));
        //     if(user.content.user_authorization == '1'){
        //         window.userId = user.content.father_user;
        //         window.role = user.content.authorizedRoles;
        //         // window.accountId = user.content.account_id;
        //     }else {
        //         window.userId = user.content.user_id;
        //         window.role = user.content.authorizedRoles;
        //         // window.accountId = user.content.account_id;
        //     }
        // }
        // if(navigator.userAgent.match(/OS [8-9]_\d[_\d]* like Mac OS X/)){//判断IOS版本
        //     if(window.webkit.messageHandlers.getUserInfo){
        //          window.webkit.messageHandlers.getUserInfo.postMessage({body: ""});
        //     }
        // }else {
        //     if (window.js.getUserInfo) {
        //         window.js.getUserInfo();
        //     }
        // }

    })

    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.views.maxCache(0);
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center');
    });
