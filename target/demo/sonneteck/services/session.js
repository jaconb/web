/**
 * session服务
 * 目前用于存储用户信息。
 * 可更换或扩展。
 */
myApp.service('Session', function () {
    /**
     * 创建session信息
     * @param sessionId string
     * @param userId string
     * @param userRole string
     * @param name string
     * @return null
     */
    this.create = function (sessionId, userId, userRole, name) {
        this.id = sessionId;
        this.userId = userId;
        this.userRole = userRole;
        this.name = name;
    };
    /**
     * 设置session信息
     * @param sessionId string
     * @param userId string
     * @param userRole string
     * @param name string
     * @return null
     */
    this.set = function (sessionId, userId, userRole, name) {
        this.id = sessionId;
        this.userId = userId;
        this.userRole = userRole;
        this.name = name;
    };
    /**
     * 清空session信息
     * @param null
     * @return null
     */
    this.destroy = function () {
        this.id = null;
        this.userId = null;
        this.userRole = null;
        this.name = null;
    };
    /**
     * 获取token
     * @param token string
     * @return token
     */
    this.getToken = function () {
        return this.token;
    };
    /**
     * 设置token
     * @param token string
     * @return null
     */
    this.setToken = function (token) {
        this.token = token;
    };
    return this;
})