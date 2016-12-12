/**
 * 拦截器服务。
 * 已在模块生成时导入。
 * 后期需要加入新的拦截规则在此服务中扩展即可。
 */
myApp.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS, Session) {
    return {
        /* 拦截响应，可通过响应结果操作自定义内容 */
        response: function(resp) {
            if (resp && resp.data && resp.data.name) {
                // 判断返回数据中的用户信息
            }
            
            /* todo 加入token规则时需要修改Session服务逻辑 */
            // if (resp.config.url == '/api/login') {
            //     Session.setToken(resp.data.token);
            // }
            
            return resp;
        },
        /* 拦截响应异常 */
        responseError: function (response) { 
            log('responseError run')
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized,
                419: AUTH_EVENTS.sessionTimeout,
                440: AUTH_EVENTS.sessionTimeout
            }[response.status], response);
            return $q.reject(response);
        },
        /* 拦截请求，可在请求参数中加入自定义内容 */
        request: function(req) {
            req.params = req.params || {}; 
            
            /* 在请求中加入token逻辑，通过用户是否持有令牌来检查用户身份 //todo 加入token规则时需要修改Session服务逻辑 */
            // if (Session.isAuthenticated() && !req.params.token) { 
            //     req.params.token = Session.getToken(); 
            // }
            
            return req;
        },
        /* 拦截请求异常 */
        requestError: function(reqErr) {
            log('requestError run')
            return reqErr;
        }
    };
})