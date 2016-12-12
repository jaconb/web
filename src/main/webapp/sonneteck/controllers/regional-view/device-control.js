angular.module('sntApp').controller('lightControlCtrl',function($scope,$state,AuthService,$cookieStore) {
    // 调用获取设备接口获取该区域下的设备。
    var user_id = $scope.user_id;
    var regionId = $scope.region_guid;
    var regionInfo = {user_id : user_id , region_id : regionId};
    var token = $cookieStore.get('token');
    var controlDevice = AuthService.myHttp(token,regionInfo, 'GET', 'table_device');
    controlDevice.then(function(data) {
        log(data);
    })
})