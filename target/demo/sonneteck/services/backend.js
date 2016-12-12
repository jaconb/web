/**
 * token验证服务。
 * todo 考虑是否可加入到权限服务中。 
 * */
angular. module('sntApp') .service('Backend', function($http, $q, $rootScope, Session) { 
    this.getDashboardData = function() {
        $http({ 
            method: 'GET',
            url: 'http://myserver.com/api/dashboard',
            params: { 
                // token: Session.getToken()
            }
        }).success(function(data) { 
                return data.data; 
            })
            .catch(function(reason) { 
                $q.reject(reason); 
            }); 
        }; 
    });