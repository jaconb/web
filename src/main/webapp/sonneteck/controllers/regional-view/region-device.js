angular.module('sntApp').controller('RegionDeviceCtrl', function($scope, $state, $stateParams, $rootScope, AuthService, $uibModal, $log,$cookieStore) {
    //查找区域下的设备
    var data = {
      region_guid: $stateParams.regionId,
      gateway_id: $stateParams.gatewayId
    };
    // 获取区域设备
    var token = $cookieStore.get('token');
    $scope.regionDeviceProm = AuthService.myHttp(token,data, 'GET', 'region/device').then(function (data) {
        if(data.code == '0' && data.content){
            $scope.regionDeviceList = data.content;
        }else {
            $scope.regionDeviceList = [];
        }
    });
    // todo 分页，目前没有分页数据，需要服务端提供
    $scope.totalItems = 64;
    $scope.currentPage = 4;    
    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function() {
    };
    $scope.maxSize = 5;
    $scope.bigTotalItems = 1;
    $scope.bigCurrentPage = 1;
    
    // modal
    $scope.animationsEnabled = true;
    $scope.open = function (size, regionDevice) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'deviceModalContent.html',
        controller: 'DeviceModalInstanceCtrl',
        size: size,
        resolve: {
          regionDevice: function () {
            return regionDevice;
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
.controller('DeviceModalInstanceCtrl', function ($scope, $uibModalInstance, regionDevice, AuthService, toaster, POPTIMEOUT,$cookieStore) {
    $scope.channelList = [];
    for(var i=0;i<regionDevice.channel.length;i++){
        $scope.channelList[i] = {};
        $scope.channelList[i].channel_number = regionDevice.channel[i].channel_number;
        $scope.channelList[i].channel_name = regionDevice.channel[i].channel_name;
        $scope.channelList[i].channel_value = Math.round(regionDevice.channel[i].channel_value*100/255);
    }
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';

    //设备通道控制
    $scope.control = function (channel) {
        var changeDeviceData = {
            "table_device":[{
                "device_guid": regionDevice.table_device_guid,
                "device_addr": regionDevice.device_addr,
                "gateway_id": regionDevice.gateway_id,
                "device_value": {
                    "channel_number": channel.channel_number,
                    "value": ""+Math.round(channel.channel_value*255/100)
                },
                "device_delay": "1"
            }]
        };
        // 控制设备的通道
        var token = $cookieStore.get('token');
        $scope.controlPro = AuthService.myHttp(token,changeDeviceData,'PUT','table_device').then(function (data) {
            if (data.code != '0') {
                toaster.pop({type: 'error', title: 'Device', body: data.message, timeout: POPTIMEOUT});
            } else {
                toaster.pop({type: 'success', title: 'Device', body: data.message, timeout: POPTIMEOUT});
            }
        })
    };
    //灯开关打开
    $scope.deviceControlOn = function () {
        var onData = {
            "table_device": [{
                "device_guid": regionDevice.table_device_guid,
                "device_addr": regionDevice.device_addr,
                "gateway_id": regionDevice.gateway_id,
                "device_switch": "01",
                "device_type" : 'bulb',
                "device_delay": "1"
            }]
        };
        var token = $cookieStore.get('token');
        $scope.controlPro = AuthService.myHttp(token,onData,'PUT', 'table_device').then(function (data) {
            if (data.code != '0') {
                toaster.pop({type: 'error', title: 'Device', body: data.message, timeout: POPTIMEOUT});
                // $scope.enabled = !$scope.enabled; // 修改错误取原值
            } else {
                toaster.pop({type: 'success', title: 'Device', body: data.message, timeout: POPTIMEOUT});
            }
        })

    };
    //灯开关关闭
    $scope.deviceControlOff = function () {
        var offData = {
            "table_device": [{
                "device_guid": regionDevice.table_device_guid,
                "device_addr": regionDevice.device_addr,
                "gateway_id": regionDevice.gateway_id,
                "device_switch": "00",
                "device_type" : 'bulb',
                "device_delay": "1"
            }]
        };
        var token = $cookieStore.get('token');
        $scope.controlPro = AuthService.myHttp(token,offData,'PUT', 'table_device').then(function (data) {
            if (data.code != '0') {
                toaster.pop({type: 'error', title: 'Device', body: data.message, timeout: POPTIMEOUT});
                // $scope.enabled = !$scope.enabled; // 修改错误取原值
            } else {
                toaster.pop({type: 'success', title: 'Device', body: data.message, timeout: POPTIMEOUT});
            }
        });
    };

    // 滑块数据
    $scope.slider_callbacks = {
        options: {
          ceil: 100,
          floor: 0,
          step : 1
            //showTicksValues: 25.5
        }
    };
    // 确定
    $scope.ok = function () {
      $uibModalInstance.close(regionDevice);
    };
    // 取消
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };    
});
                        