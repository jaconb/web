angular.module('sntApp').controller('RegionalCtrl', function($scope, $state, USER_ROLES, AuthService,toaster,POPTIMEOUT,$cookieStore) {
    
    // 页面加载
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';
    // 获取区域信息
    var token = $cookieStore.get('token');
    $scope.regionProm = AuthService.myHttp(token,{},'GET','region').then(function (data) {
        if(data.code == '0'){
            $scope.RegionAndSensorData = data.content;
            var i = 0;
            queryRegionRealData(i);
            function queryRegionRealData(i) {
                $scope.RegionAndSensorData[i].realTimeData = {};
                var regionInfo = {
                    region_guid: $scope.RegionAndSensorData[i].region_guid,
                    gateway_id: $scope.RegionAndSensorData[i].gateway_id,
                    type: 'nows',
                    size: '1'
                };
                $scope.prom = AuthService.myHttp(token,regionInfo, 'GET', 'sensor/nowData').then(function (response) {
                    if(response.content){
                        $scope.RegionAndSensorData[i].realTimeData = response.content[0];
                        if((i+1) != $scope.RegionAndSensorData.length){
                            return queryRegionRealData(i+1);
                        }
                    }else {
                        if((i+1) != $scope.RegionAndSensorData.length){
                            return queryRegionRealData(i+1);
                        }
                    }
                })
            }
        }else {
            toaster.pop({type: 'error', title: 'Error', body: data.message, timeout: POPTIMEOUT});
        }
    })

    //进入区域详情页面
    $scope.toDetail = function(item) {
        $state.go('index.detail', {
            regionId: item.region_guid,
            gatewayId: item.gateway_id,
            regionAddr: item.region_addr,
            regionName : item.region_name,
            regionSwitch: item.region_switch});
    };
    // todo 去区域管理，第一期暂不提供
    $scope.toBultModify = function() {
        $state.go('index.modify');
    }
});