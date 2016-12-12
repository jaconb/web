angular.module('sntApp').controller('RegionChannelCtrl', function ($scope, $state, $rootScope, $stateParams, AuthService, toaster, POPTIMEOUT,$uibModal,$cookieStore) {
    var regionId = $stateParams.regionId;
    $scope.gatewayId = $stateParams.gatewayId;
    var regionAddr = $stateParams.regionAddr; // 开关信息
    $scope.regionName = $stateParams.regionName;

    var controlRegionInfo = {
        region_guid:regionId,
        gateway_id: $scope.gatewayId,
        region_addr: regionAddr
    }

    $scope.openRegionCtrl = function (size) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'regionControlModalContent.html',
            controller: 'RegionCtrlModalInstanceCtrl',
            size: size,
            resolve: {
                controlRegionInfo: function () {
                    return controlRegionInfo;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };
    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
})
.controller('RegionCtrlModalInstanceCtrl',function ($scope, $state, $rootScope, $stateParams, AuthService, toaster, POPTIMEOUT,$uibModal,$cookieStore,controlRegionInfo,$uibModalInstance) {
    // console.log('controlRegionInfo',controlRegionInfo)
    var regionId = controlRegionInfo.region_guid;
    var gatewayId = controlRegionInfo.gateway_id;
    var regionAddr = controlRegionInfo.region_addr;

    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';

    // 控制滑块
    $scope.slider_callbacks = {
        value: 55,
        options: {
            ceil: 100,
            floor: 0,
            step : 1
        }
    };
    var data = {
        region_guid: regionId,
        gateway_id: gatewayId
    };
    // 获取区域下通道信息
    var token = $cookieStore.get('token');
    $scope.channelInfoProm = AuthService.myHttp(token,data, 'GET', 'region/region_channel').then(function (data) {
        if(data.code == '0' && data.content){
            $scope.RegionChannelList = [];
            for(var i=0;i<data.content.length;i++){
                $scope.RegionChannelList[i] = {};
                $scope.RegionChannelList[i].channel_name = data.content[i].channel_name;
                $scope.RegionChannelList[i].channel_number = data.content[i].channel_number;
                $scope.RegionChannelList[i].channel_value = Math.round(data.content[i].channel_value*100/255);
            }
        }else {
            toaster.pop({type: 'error', title: 'Error', body: data.message, timeout: POPTIMEOUT});
        }
    });
    // 开关控制
    //开
    $scope.regionControlOn = function () {
        var controlRegionOn = {
            "table_region": [{
                "region_addr": regionAddr,
                "gateway_id": gatewayId,
                "region_guid": regionId,
                "region_switch": "01",
                "region_delay": "1"
            }]
        };
        var token = $cookieStore.get('token');
        $scope.controlRegionProm = AuthService.myHttp(token,controlRegionOn, 'PUT', 'region/controll').then(function (data) {
            if (data.code != '0') {
                toaster.pop({type: 'error', title: 'Error', body: data.message, timeout: POPTIMEOUT});
                // $scope.my.switchState = true;
            } else {
                toaster.pop({type: 'success', title: 'Success', body: data.message, timeout: POPTIMEOUT});
            }
        })
    };
    //关
    $scope.regionControlOff = function () {
        var controlRegionOff = {
            "table_region": [{
                "region_addr": regionAddr,
                "gateway_id": gatewayId,
                "region_guid": regionId,
                "region_switch": "00",
                "region_delay": "1"
            }]
        };
        var token = $cookieStore.get('token');
        $scope.controlRegionProm = AuthService.myHttp(token,controlRegionOff, 'PUT', 'region/controll').then(function (data) {
            if (data.code != '0') {
                toaster.pop({type: 'error', title: 'Error', body: data.message, timeout: POPTIMEOUT});
                // $scope.my.switchState = true;
            } else {
                toaster.pop({type: 'success', title: 'Success', body: data.message, timeout: POPTIMEOUT});
            }
        })
    };
    //控制区域通道
    $scope.controlRegion = function (regionChannel) {
        var controlRegionData = {
            "table_region": [{
                "region_addr": regionAddr,
                "gateway_id": gatewayId,
                "region_guid": regionId,
                "region_value": {
                    "channel_value": "" + Math.round(regionChannel.channel_value*255/100),
                    "channel_number": regionChannel.channel_number
                },
                "region_delay": "1"
            }]
        };
        var token = $cookieStore.get('token');
        $scope.controlRegionProm = AuthService.myHttp(token,controlRegionData, 'PUT', 'region/controll').then(function (data) {
            if (data.code != '0') {
                toaster.pop({type: 'error', title: 'Error', body: data.message, timeout: POPTIMEOUT});
            } else {
                toaster.pop({type: 'success', title: 'Success', body: data.message, timeout: POPTIMEOUT});
            }
        });
    };
    
    $scope.ok = function () {
        $uibModalInstance.dismiss('cancel');
    }
})

