
var myApp = angular.module('sntApp', [
    'ui.router',
    'ngCookies',
    'ngResource',
    'ui.bootstrap',
    'myApp.services',
    'myApp.servicesa',
    'myApp.directives',
    'ngAnimate',
    'toaster', // 通知
    'cgBusy', // 加载
    'rzModule']);

myApp

    /* 用户权限，用于区分不同权限的用户所能浏览的页面 todo 有重复需要确认使用方案 */
    .constant('ACCESS_LEVELS', {
        superUser: 0,
        admin: 1,
        user: 2
    })
    .constant('POPTIMEOUT', 4000)

    /* 用户权限，用于区分不同权限的用户所能浏览的页面 */
    .constant('USER_ROLES', {
        all: '*',
        admin: 'admin',
        editor: 'editor',
        guest: 'guest'
    })
    /* 事件名 */
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
    .run(function ($rootScope, $state, $cookieStore, AUTH_EVENTS, AuthService, Session) {
        // // todo 考虑是否可以放在别的地方监听
        $rootScope.$on(AUTH_EVENTS.loginSuccess, function () { // 成功登陆
            $state.go('index');
        });
        $rootScope.$on(AUTH_EVENTS.loginFailed, function () { // 登录失败
            $state.go('login');
        });

        // $rootScope.$on(AUTH_EVENTS.notAuthorized, function() { // 没有权限
        //     $state.go('index');
        // });
        /* 启动时获取cookie信息，在session中缓存  todo 是否只需要操作cookie就好了？*/
        // var _user = $cookieStore.get('user_authorization');
        // Session.create(_user.sessionid, _user.id, _user.role);

        /* 监听地址栏变化，获取该路由权限，处理用户是否具有权限 */
        $rootScope.$on('$stateChangeStart', function (event, next) {
            var authorizedRoles = next.data.authorizedRoles;

            if (!AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                if (AuthService.isAuthenticated()) {
                    // user is not allowed
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } else {
                    // user is not logged in
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }
        });
    })
    .config(function ($httpProvider) {
        /* 获取用户拦截器，拦截请求响应，对其做出处理 */
        $httpProvider.interceptors.push(['$injector', function ($injector) {
            return $injector.get('AuthInterceptor');
        }
        ]);
    });
    

    
