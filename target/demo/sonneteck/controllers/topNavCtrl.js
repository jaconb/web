angular.module('sntApp').controller('topNavCtrl', function ($scope, $state, $rootScope, $cookieStore, AuthService, USER_ROLES,$uibModal) {
    //用户名
    $scope.userName = $cookieStore.get('user_name');
    // var user_authorization = $cookieStore.get('user_authorization');
    // if(user_authorization == '1'){
    //     $scope.isUsed = 'disabled';
    // }
    $scope.navs = [
        {
            title: 'Regional View',
            className: 'active',
            url: 'index',
            role: AuthService.isAuthorized(['1', '2', '3'])
        },
        {
            title: 'User Administration',
            className: '',
            url: 'index.user',
            role: AuthService.isAuthorized(['2', '3'])
        },
        {
            title: 'Advanced Configuration',
            className: '',
            url: 'index.config',
            role: AuthService.isAuthorized(['2', '3'])
        }
    ]
    $scope.navs.forEach(function (element) {
        if ($state.current.name.indexOf(element.url) !== -1) {
            element.className = 'active';
            if (element != $scope.navs[0]) $scope.navs[0].className = '';
        }
    }, this);

    $scope.changeClass = function (element) {
        element.nav.className = 'active';
        angular.forEach($scope.navs, function (nav) {
            if (nav.title != element.nav.title) {
                nav.className = '';
            }
        })
    };
    // $scope.toUserManage = function () {
    //     $state.go('index.user');
    //     for(var i = 0; i <  $scope.navs.length; i++){
    //         $scope.navs[i].className = '';
    //     }
    // }

    $scope.logout = function () {
        $rootScope.user_id = null;
        $cookieStore.remove('user_id')
        $cookieStore.remove('user_name');
        $cookieStore.remove('user_authorization');
        $cookieStore.remove('account_id');
        $cookieStore.remove('token');
        $state.go('login');
    };

    $scope.animationsEnabled = true;
    $scope.resetPwd = function () {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'resetPwd.html',
            controller: 'ResetPwdModalCtrl'
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    }
    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

})
.controller('ResetPwdModalCtrl',function ($timeout,$scope, $state, AuthService, $rootScope, $uibModal, $stateParams, $log,$cookieStore,$uibModalInstance, toaster, POPTIMEOUT) {
    var token = $cookieStore.get('token');
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';

    $scope.oldPwd = '';
    $scope.newPwd = '';
    $scope.againNewPwd = '';
    var storage = window.sessionStorage;
    var pwd = storage["user_pwd"];
    var token = $cookieStore.get('token');
    $scope.ok = function () {
        if($scope.oldPwd != pwd || $scope.oldPwd == ''){
            toaster.pop({type: 'error', title: 'Error', body: 'Please enter valid old password!', timeout: POPTIMEOUT});
        }else if($scope.newPwd == '' || $scope.againNewPwd == ''){
            toaster.pop({type: 'error', title: 'Error', body: 'Please enter the new password!', timeout: POPTIMEOUT});
        } else if($scope.newPwd != $scope.againNewPwd){
            toaster.pop({type: 'error', title: 'Error', body: 'Enter the new password twice inconsistent!', timeout: POPTIMEOUT});
        }else {
            var resetPwdData = {
                'pass_word': $scope.newPwd
            }
            $scope.resetPwdProm = AuthService.myHttp(token,resetPwdData,'PUT','user/passWord').then(function (result) {
                if(result.code == '0'){
                    storage.removeItem("user_pwd");
                    $cookieStore.remove('user_id')
                    $cookieStore.remove('user_name');
                    $cookieStore.remove('user_authorization');
                    $cookieStore.remove('account_id');
                    $cookieStore.remove('token');
                    $uibModalInstance.close();
                    toaster.pop({type: 'success', title: 'Success', body: 'Reset password successfully, please login again!', timeout: POPTIMEOUT});
                    $timeout(function () {
                        $state.go('login');
                    },2000);
                }else {
                    toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
                }
            })
        }
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})