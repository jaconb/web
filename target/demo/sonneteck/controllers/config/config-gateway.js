angular.module('sntApp').controller('GatewayConfigCtrl',function ($scope, $state, AuthService, $rootScope, $uibModal, $stateParams, $log,$cookieStore) {

    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';
    //查找用户网关
    var token = $cookieStore.get('token');
    $scope.gatewayProm = AuthService.myHttp(token,{},'GET','login/user_info').then(function (data) {
        if(data.content){
            $scope.gatewayList = data.content;
        }else {
            $scope.gatewayList = [];
        }
    })

    $scope.animationsEnabled = true;
    //网关详情
    $scope.gatewayDetail = function (size,gateway) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'gatewayDetail.html',
            controller: 'GatewayDetailModalCtrl',
            size: size,
            resolve: {
                gateway: function () {
                    return gateway;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };
    //更新网关
    $scope.updateGateway = function (gateway) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'updateGateway.html',
            controller: 'UpdateGatewayModalCtrl',
            resolve: {
                gateway: function () {
                    return gateway;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };
})
/**
 * 网关下的设备列表弹窗
 */
.controller('GatewayDetailModalCtrl',function ($scope, $state, AuthService, $rootScope, $stateParams, $log,$cookieStore,gateway,$uibModalInstance,toaster,POPTIMEOUT) {
    var token = $cookieStore.get('token');
    $scope.renameDeviceDiv = false;
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';
    $scope.gatewayId = gateway.gateway_id;
    var findGatewayDevice = {
        'gateway_id': gateway.gateway_id
    };
    $scope.gatewayDeviceInfo = [];
    $scope.findGatewayDeviceProm = AuthService.myHttp(token,findGatewayDevice,'GET','gateway/device').then(function (result) {
        if(result.content){
            for(var i = 0; i <result.content.length; i ++){
                $scope.gatewayDeviceInfo[i] = {};
                if(result.content[i].device_type != 'NULL'){
                    $scope.gatewayDeviceInfo[i] = result.content[i];
                }
            }
        }else {
            $scope.gatewayDeviceInfo = [];
        }
    });
    $scope.renameDevice = function (device) {
        $scope.renameDeviceDiv = true;
        $scope.deviceName = device.device_name;
        $scope.deviceGuid = device.device_guid;
    }
    $scope.renameDeviceOk = function () {
        var renameDeviceData = {
            "gateway_id": gateway.gateway_id,
            "device_guid": $scope.deviceGuid,
            "device_name": $scope.deviceName
        }
        $scope.renameDeviceProm = AuthService.myHttp(token,renameDeviceData,'PUT','device/name').then(function (result) {
            if(result.code == '0'){
                toaster.pop({type: 'success', title: 'Success', body: result.message, timeout: POPTIMEOUT});
                var findGatewayDeviceProm = AuthService.myHttp(token,findGatewayDevice,'GET','gateway/device').then(function (result) {
                    if(result.content){
                        for(var i = 0; i <result.content.length; i ++){
                            $scope.gatewayDeviceInfo[i] = {};
                            if(result.content[i].device_type != 'NULL'){
                                $scope.gatewayDeviceInfo[i] = result.content[i];
                            }
                        }
                    }else {
                        $scope.gatewayDeviceInfo = [];
                    }
                });
                $scope.renameDeviceDiv = false;
            }else {
                toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
            }
        })
    }
    $scope.hideRenameDiv = function () {
        $scope.renameDeviceDiv = false;
    }
    $scope.ok = function () {
        $uibModalInstance.close();
    };
})
/**
 * 更新网关弹窗控制器
 */
.controller('UpdateGatewayModalCtrl',function ($scope, $state, AuthService, $rootScope, $stateParams, $log,$cookieStore,gateway,$uibModalInstance,toaster,POPTIMEOUT) {
    var token = $cookieStore.get('token');
    var account_id = $cookieStore.get('account_id');
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';
    $scope.gatewayId = gateway.gateway_id;

    var updateGatewayData = {
        'gateway_id' : $scope.gatewayId,
        'account_id' : account_id
    }
    $scope.ok = function () {
        $scope.updateGatewayProm = AuthService.myHttp(token,updateGatewayData,'POST','update/firmware').then(function (result) {
            if(result.code == '0'){
                toaster.pop({type: 'success', title: 'Success', body: result.message, timeout: POPTIMEOUT});
                $uibModalInstance.close();
            }else {
                toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
            }
        })
    };
    $scope.cancel = function () {
        $uibModalInstance.close();
    };
})
