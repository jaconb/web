angular.module('sntApp').controller('LoginCtrl', function($scope, $rootScope, $cookieStore,$state, AUTH_EVENTS, AuthService, toaster, POPTIMEOUT) {
    // 登录加载
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-template.html';

    /* 从cookie中获取缓存的用户信息 */
    $scope.credentials = {
        e_mail: '',
        password: ''
    };

    $scope.login = function () {
        var loginData = {
            e_mail: $scope.credentials.e_mail,
            password: hex_md5($scope.credentials.password)
        };
        $scope.loginProm = AuthService.login(loginData,'POST','login').then(function (data) {
            if(data.code == "0"){
                var user = data.content;
                if(user.user_authorization == '1'){
                    $cookieStore.put('token',user.token)
                    $cookieStore.put('user_id', user.father_user);
                    $cookieStore.put('user_authorization',user.user_authorization);
                    $cookieStore.put('user_name',user.user_name);
                    $cookieStore.put('account_id',user.account_id);
                    var storage = window.sessionStorage;
                    storage["user_pwd"] = $scope.credentials.password
                }else {
                    $cookieStore.put('token',user.token)
                    $cookieStore.put('user_id', user.user_id);
                    $cookieStore.put('user_authorization',user.user_authorization);
                    $cookieStore.put('user_name',user.user_name);
                    $cookieStore.put('account_id',user.account_id);
                    var storage = window.sessionStorage;
                    storage["user_pwd"] = $scope.credentials.password
                }
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            }else if(data.code == "-1"){
                toaster.pop({type: 'error', title: 'Warning', body: data.message, timeout: POPTIMEOUT});
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            }else {
                toaster.pop({type: 'error', title: 'Warning', body: "Server error, please try again", timeout: POPTIMEOUT});
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            }
        })
    }
});
