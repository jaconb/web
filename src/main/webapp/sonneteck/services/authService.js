/**
 * 权限服务。
 * 主要负责处理用户登录及用户权限问题
 * 可扩展
 */
myApp.factory('AuthService', function ( Session, $http, $cookieStore, $rootScope, USER_ROLES, AUTH_EVENTS,$state,toaster,POPTIMEOUT) {
  var authService = {};
  // var url = '/deej-bussiness/inter/sonneteck';
  var url = '/inter/sonneteck';
    // var url = '/lois/inter/sonneteck';
  /* 
   * 处理用户登录 
   * @param credentials object
   * 
   * @describe 
   * 向服务器发起登录请求，处理服务器返回的影虎信息，将用户信息缓存到Session服务与cookie中。
   * */
  authService.myHttp = function (token, data, method, serverName) {
      
        !method ? method = 'GET': method = method.toUpperCase();
        !serverName ? serverName = 'login': serverName;
                
        var userId = $cookieStore.get('user_id');
        // var accountId = $cookieStore.get('account_id');
        if (!userId) {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            return $http.get('/');
        }
        data.user_id = userId;
        // data.account_id = accountId;
        var param = {
                    method: method,
                    serverName: serverName,
                    data:data,
                    token:token
                };
   
        return $http.post(url, param).then(function (res) {
            if(res.data.code == '-2'){
                // toaster.pop({type: 'error', title: 'Error', body: res.data.message, timeout: POPTIMEOUT});
                $state.go('login');
            }else {
                return res.data;
            }
        });
  };
  authService.login = function (data, method, serverName) {
        !method ? method = 'POST': method = method.toUpperCase();
        !serverName ? serverName = 'login': serverName;
        
        var param = {
                    method: method,
                    serverName: serverName,
                    data:data
                };
                
        return $http.post(url, param).then(function (res) {
                return res.data;
            });
  };
  
  /**
   * 用户身份验证
   * @return boolean
   * 
   * @describe 判断session中用户信息
   * @todo 只判断id是否足够
   */
  authService.isAuthenticated = function () {
        return !!$cookieStore.get('user_authorization');
  };
  
  /**
   * 用户权限验证
   * @return boolean
   */
  authService.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        var role = $cookieStore.get('user_authorization')? $cookieStore.get('user_authorization') : 'login';
        return (authorizedRoles.indexOf(role) !== -1);
  };
  return authService;
})

/**
 * 子用户管理服务
 */
myApp.factory('User',function (AuthService,$cookieStore) {
    var user = {};
    var User = {
        get: function () {
            return user;
        },
        set: function (data) {
          user = data
        },
        /**
         * 新建子用户
         */
        newUser: function (data) {
            var userData = {
                "user_name":data.newUserName,
                "password":data.newUserPassword,
                "e_mail":data.newUserEmail,
                "phone":data.newUserPhone,
                "country" : data.country.countryId,
                "father_user" : $cookieStore.get('user_id')
            }
            var token = $cookieStore.get('token');
            return AuthService.myHttp(token,userData,'POST','user').then(function (data) {
                return data;
            })
        },
        /**
         * 删除子用户
         */
        deleteUser: function (data) {
            var deleteUserData = {
                "child_user_id":data.user_id
            }
            var token = $cookieStore.get('token');
            return AuthService.myHttp(token,deleteUserData,'DELETE','user').then(function (data) {
                return data;
            })
        },
        /**
         * 编辑子用户
         */
        editUser: function (data) {
            var editUserData = {
                "child_user_id":data.user_id,
                "user_name":data.user_name,
                "password":data.password,
                "e_mail":data.e_mail,
                "phone":data.phone,
                "country" : data.country,
                "user_authorization":data.user_authorization
            }
            var token = $cookieStore.get('token');
            return AuthService.myHttp(token,editUserData,'PUT','user').then(function (data) {
                return data;
            })
        },
        /**
         * 禁用子用户
         */
        disableUser: function (data) {
            var disableUserData = {
                "child_user_id":data.user_id,
                "user_name":data.user_name,
                "password":data.password,
                "e_mail":data.e_mail,
                "phone":data.phone,
                "user_authorization":'0'
            }
            var token = $cookieStore.get('token');
            return AuthService.myHttp(token,disableUserData,'PUT','user').then(function (data) {
                if(data.code != '0'){
                    return false;
                }
                return data || true;
            })
        },
        /**
         * 解禁子用户
         */
        enableUser: function (data) {
            var enableUserData = {
                "child_user_id":data.user_id,
                "user_name":data.user_name,
                "password":data.password,
                "e_mail":data.e_mail,
                "phone":data.phone,
                "user_authorization":'1'
            }
            var token = $cookieStore.get('token');
            return AuthService.myHttp(token,enableUserData,'PUT','user').then(function (data) {
                if(data.code != '0'){
                    return false;
                }
                return data || true;
            })
        }
    }
    return User;
})


