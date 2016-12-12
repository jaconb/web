angular.module('sntApp').controller('GroupDeviceCtrl', function ($scope, $state, $stateParams, $rootScope, AuthService, $uibModal, $log,$cookieStore) {
    // 查询区域组
    var findRegionGroupData = {
        "region_guid": $stateParams.regionId,
        "gateway_id" : $stateParams.gatewayId
    };
    var token = $cookieStore.get('token');
    var groupProm = AuthService.myHttp(token,findRegionGroupData, 'GET', 'region/group').then(function(data){
        if(data.code == '0' && data.content){
            $scope.groupList = data.content;
        }else {
            $scope.groupList = [];
        }
    });
    // 分页
    $scope.totalItems = 64;
    $scope.currentPage = 4;
    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function() {
      $log.log('Page changed to: ' + $scope.currentPage);
    };
    $scope.maxSize = 5;
    $scope.bigTotalItems = 1;
    $scope.bigCurrentPage = 1;

    //区域组控制弹窗
    $scope.animationsEnabled = true;
    $scope.open = function (size, group) {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'groupModalContent.html',
          controller: 'GroupModalInstanceCtrl',
          size: size,
          resolve: {
            group: function () {
              return group;
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
.controller('GroupModalInstanceCtrl', function ($scope, $uibModalInstance, group, AuthService, toaster, POPTIMEOUT,$cookieStore) {

    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';

    // 获取组的通道
    var data = {
        gateway_id: group.gateway_id,
        table_group_guid: group.table_group_guid
    };
    // 区域下组通道信息
    var token = $cookieStore.get('token');
    $scope.regionGroupChannelInfoProm = AuthService.myHttp(token,data,'Get','device/group/group_channel').then(function (data) {
        if(data.code == "0" && data.content){
            $scope.groupChanneList = [];
            for(var i=0;i<data.content.length;i++){
                $scope.groupChanneList[i] = {};
                $scope.groupChanneList[i].channel_name = data.content[i].channel_name;
                $scope.groupChanneList[i].channel_value = Math.round(data.content[i].channel_value*100/255);
                $scope.groupChanneList[i].channel_number = data.content[i].channel_number;
            }
        }else {
            $scope.groupChanneList = [];
        }
    });

    //开
    $scope.groupControlOn = function () {
        var groupControlOnData = {
            "table_group": [{
                "group_guid": group.table_group_guid,
                "group_addr": group.group_addr,
                "gateway_id": group.gateway_id,
                "group_switch": "01",
                "group_delay": "1"
            }]
        };
        $scope.groupControlProm = AuthService.myHttp(token,groupControlOnData,'PUT','device/group/group_control').then(function (data) {
            if (data.code != '0') {
                toaster.pop({type: 'error', title: 'Group', body: data.message, timeout: POPTIMEOUT});
            } else {
                toaster.pop({type: 'success', title: 'Group', body: data.message, timeout: POPTIMEOUT});
            }
        })
    };
    //关
    $scope.groupControlOff = function () {
        var groupControlOnData = {
            "table_group": [{
                "group_guid": group.table_group_guid,
                "group_addr": group.group_addr,
                "gateway_id": group.gateway_id,
                "group_switch": "00",
                "group_delay": "1"
            }]
        };
        $scope.groupControlProm = AuthService.myHttp(token,groupControlOnData,'PUT','device/group/group_control').then(function (data) {
            if (data.code != '0') {
                toaster.pop({type: 'error', title: 'Group', body: data.message, timeout: POPTIMEOUT});
            } else {
                toaster.pop({type: 'success', title: 'Group', body: data.message, timeout: POPTIMEOUT});
            }
        })
    };
    //组通道控制
    $scope.control = function (groupChannel) {
        $scope.groupChannels = [];
        for(var i=0;i<groupChannel.length;i++){
            $scope.groupChannels[i] = {};
            $scope.groupChannels[i].channel_number = groupChannel[i].channel_number;
            $scope.groupChannels[i].channel_value = ""+Math.round(groupChannel[i].channel_value*255/100);
        }
        var groupControlData = {
            "table_group": [{
                "group_guid": group.table_group_guid,
                "group_addr": group.group_addr,
                "gateway_id": group.gateway_id,
                "group_value": $scope.groupChannels,
                "group_delay": "1"
            }]
        };
        $scope.groupControlProm = AuthService.myHttp(token,groupControlData,'PUT','device/group/group_control').then(function (data) {
            if (data.code != '0') {
                toaster.pop({type: 'error', title: 'Group', body: data.message, timeout: POPTIMEOUT});
            } else {
                toaster.pop({type: 'success', title: 'Group', body: data.message, timeout: POPTIMEOUT});
            }
        });
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.slider_callbacks = {
        value: 155,
        options: {
          ceil: 100,
          floor: 0,
          step : 1
        }
    };
});