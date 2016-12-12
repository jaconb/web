angular.module('starter.region', [])
/**
 * 区域控制器
 */
.controller('RegionalCtrl', ['$scope', '$state', '$rootScope','$timeout', '$ionicLoading', 'Regionals','dialogsManager','HttpService',function($scope, $state, $rootScope,$timeout, $ionicLoading, Regionals,dialogsManager,HttpService) {

    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    // if(navigator.userAgent.match(/OS [8-9]_\d[_\d]* like Mac OS X/)){//判断IOS版本
    //     if(window.webkit.messageHandlers.getHeadTitle){
    //         window.webkit.messageHandlers.getHeadTitle.postMessage({body: "Region"});
    //     }
    //     if(window.webkit.messageHandlers.settingBtnShowOrNot){
    //         window.webkit.messageHandlers.settingBtnShowOrNot.postMessage({body: "1"});
    //     }
    // }else {
    //     if (window.js.getHeadTitle) {
    //         window.js.getHeadTitle('Region'); // 调用原生提供的修改标题方法。
    //     }
    //     if (window.js.settingBtnShowOrNot) {
    //         window.js.settingBtnShowOrNot(1);
    //     }
    // }


    // 获取区域列表
    var regionalsProm = Regionals.all();
    regionalsProm.then(function(data) {
        // console.log('区域列表',data)
        if(data.code == '0'){
            dialogsManager.showMessage(data.message,"green");
            $scope.regionals = data.content;
            var i = 0;
            queryRegionRealData(i);
            function queryRegionRealData(i) {
                $scope.regionals[i].realTimeData = {};
                var regionInfo = {
                    region_guid: $scope.regionals[i].region_guid,
                    gateway_id: $scope.regionals[i].gateway_id,
                    type: 'nows',
                    size: '1'
                };
                $scope.prom = HttpService.myHttp(regionInfo, 'GET', 'sensor/nowData').then(function (response) {
                    $ionicLoading.hide();
                    if(response.content){
                        $scope.regionals[i].realTimeData = response.content[0];
                        if((i+1) != $scope.regionals.length){
                            return queryRegionRealData(i+1);
                        }
                    }else {
                        if((i+1) != $scope.regionals.length){
                            return queryRegionRealData(i+1);
                        }
                    }
                })
            }
        }else {
            dialogsManager.showMessage(data.message,"red");
        }
    })



    //下拉刷新
    $scope.doRefresh = function() {
        $timeout(function() {
            // 获取区域列表
            var regionalsProm = Regionals.all();
            regionalsProm.then(function(data) {
                // console.log('区域列表',data)
                if(data.code == '0'){
                    dialogsManager.showMessage(data.message,"green");
                    $scope.regionals = data.content;
                    var i = 0;
                    queryRegionRealData(i);
                    function queryRegionRealData(i) {
                        $scope.regionals[i].realTimeData = {};
                        var regionInfo = {
                            region_guid: $scope.regionals[i].region_guid,
                            gateway_id: $scope.regionals[i].gateway_id,
                            type: 'nows',
                            size: '1'
                        };
                        $scope.prom = HttpService.myHttp(regionInfo, 'GET', 'sensor/nowData').then(function (response) {
                            $ionicLoading.hide();
                            if(response.content){
                                $scope.regionals[i].realTimeData = response.content[0];
                                if((i+1) != $scope.regionals.length){
                                    return queryRegionRealData(i+1);
                                }
                            }else {
                                if((i+1) != $scope.regionals.length){
                                    return queryRegionRealData(i+1);
                                }
                            }
                        })
                    }
                }else {
                    dialogsManager.showMessage(data.message,"red");
                }
            })
            $scope.$broadcast('scroll.refreshComplete');

        }, 1000);
    };
    // 去区域详情
    $scope.toRegional = function(region) {
        console.log('进入区域详情')
        $state.go('regional-detail', {regionId : region.region_guid, gatewayId: region.gateway_id, regionName: region.region_name, regionAddr: region.region_addr});
    }
}])

/**
 * 区域详情
 */
.controller('RegionalDetailCtrl', ['$scope', '$state', '$stateParams', '$rootScope', 'Regional', 'HttpService', 'dialogsManager', '$timeout', '$ionicLoading',function($scope, $state, $stateParams, $rootScope, Regional, HttpService, dialogsManager, $timeout, $ionicLoading) {
    // 获取区域id
    var regionId = $stateParams.regionId;
    var gatewayId = $stateParams.gatewayId;
    var regionValue = $stateParams.regionValue;
    var regionName = $stateParams.regionName;
    var regionAddr = $stateParams.regionAddr;

    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    

    // if(navigator.userAgent.match(/OS [8-9]_\d[_\d]* like Mac OS X/)){//判断IOS版本
    //     if(window.webkit.messageHandlers.getHeadTitle){
    //         window.webkit.messageHandlers.getHeadTitle.postMessage({body: "Regional Detail"});
    //     }
    //     if(window.webkit.messageHandlers.settingBtnShowOrNot){
    //         window.webkit.messageHandlers.settingBtnShowOrNot.postMessage({body: "1"});
    //     }
    // }else {
    //     if (window.js.getHeadTitle) {
    //         window.js.getHeadTitle('Regional Detail'); // 调用原生提供的修改标题方法。
    //     }
    //     if (window.js.settingBtnShowOrNot) {
    //         window.js.settingBtnShowOrNot(1);
    //     }
    // }



    $scope.regionName = regionName;

    $scope.my = {}

    // 获取区域下的通道
    $scope.channelList = [];
    Regional.getChannel(regionId, gatewayId).then(function(data) {
        $ionicLoading.hide();
        for(var i=0;i<data.length;i++){
            $scope.channelList[i] = {};
            $scope.channelList[i].channel_name = data[i].channel_name;
            $scope.channelList[i].channel_number = data[i].channel_number;
            $scope.channelList[i].channel_value = Math.round(data[i].channel_value*100/255);
        }
    })


    //下拉刷新
    $scope.doRefresh = function() {
        $timeout(function() {
            // 获取区域下的通道
            $scope.channelList = [];
            Regional.getChannel(regionId, gatewayId, "null").then(function(data) {
                $ionicLoading.hide();
                for(var i=0;i<data.length;i++){
                    $scope.channelList[i] = {};
                    $scope.channelList[i].channel_name = data[i].channel_name;
                    $scope.channelList[i].channel_number = data[i].channel_number;
                    $scope.channelList[i].channel_value = Math.round(data[i].channel_value*100/255);
                }
            })
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000);
    };
    //一键白开
    $scope.ctrlRegionWhiteOn = function () {
        $scope.whiteOnChannelList = [];
        for(var i = 0;i < $scope.channelList.length; i++){
            $scope.whiteOnChannelList[i] = {};
            if($scope.channelList[i].channel_name == 'White'){
                $scope.whiteOnChannelList[i].channel_number = $scope.channelList[i].channel_number;
                $scope.whiteOnChannelList[i].channel_value = "" + 255;
            }else {
                $scope.whiteOnChannelList[i].channel_number = $scope.channelList[i].channel_number;
                $scope.whiteOnChannelList[i].channel_value = "" + 0;
            }
        }
        console.log($scope.whiteOnChannelList);
    }
    //一键白关
    $scope.ctrlRegionWhiteOff = function () {
        $scope.whiteOffChannelList = [];
        for(var i = 0 ; i < $scope.channelList.length; i ++){
            $scope.whiteOffChannelList[i] = {};
            $scope.whiteOffChannelList[i].channel_number = $scope.channelList[i].channel_number;
            $scope.whiteOffChannelList[i].channel_value = "" + 255;
        }
        console.log($scope.whiteOffChannelList)
    }


    // 控制区域开关
    $scope.ctrlRegionOn = function () {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var controlRegionData = {
            "table_region":[{
                region_addr: regionAddr,
                gateway_id: gatewayId,
                region_guid: regionId,
                region_switch: '01',
                region_delay: "1"
            }]
        };
        Regional.updChannel(controlRegionData).then(function (data) {
            $ionicLoading.hide();
            if (data.code == '0') {
                dialogsManager.showMessage(data.message,"green");
            } else {
                dialogsManager.showMessage(data.message,"red");
            }
        })
    }
    $scope.ctrlRegionOff = function () {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var controlRegionData = {
            "table_region":[{
                region_addr: regionAddr,
                gateway_id: gatewayId,
                region_guid: regionId,
                region_switch: '00',
                region_delay: "1"
            }]
        }
        // console.log('区域关传参',controlRegionData)
        Regional.updChannel(controlRegionData).then(function (data) {
            $ionicLoading.hide();
            if (data.code == '0') {
                dialogsManager.showMessage(data.message,"green");
            } else {
                dialogsManager.showMessage(data.message,"red");
            }
        })
    }

    // 控制区域通道
    $scope.ctrlChannel = function (channel) {
        console.log(channel)
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $scope.regionChannels = [];
        for(var i = 0;i<channel.length;i++){
            $scope.regionChannels[i] = {};
            $scope.regionChannels[i].channel_number = channel[i].channel_number;
            $scope.regionChannels[i].channel_value = ""+Math.round(channel[i].channel_value*255/100);
            // groupChannels.push(groupChannelList);
        }
        var controlRegionData = {
            "table_region":[{
                region_addr: regionAddr,
                gateway_id: gatewayId,
                region_guid: regionId,
                region_value: $scope.regionChannels,
                region_delay: "1"
            }]
        };
        console.log(controlRegionData)
        // 修改通道值，提示用户修改结果
        Regional.updChannel(controlRegionData).then(function (data) {
            $ionicLoading.hide();
            if (data.code == '0') {
                dialogsManager.showMessage(data.message,"green");
            } else {
                dialogsManager.showMessage(data.message,"red");
            }
        })
    }
    // 去设备控制
    $scope.toDeviceCtrl = function() {
        $state.go('regional-device', {
            regionId: regionId,
            gatewayId: gatewayId,
            regionValue: regionValue
        })
    }
    // 去组控制
    $scope.toGroupCtrl = function() {
        $state.go('regional-group', {
            regionId: regionId,
            gatewayId: gatewayId
        })
    }
    // 去场景控制
    $scope.toSceneCtrl = function() {
        $state.go('regional-scene', {
            regionId: regionId,
            gatewayId: gatewayId
        })
    }
}])

/**
 * 区域->设备控制
 */
.controller('RegionalDeviceCtrl', function($scope, $stateParams, $rootScope, Device, dialogsManager,$timeout, $ionicLoading) {
    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    var regionId = $stateParams.regionId;
    var gatewayId = $stateParams.gatewayId;


    if(navigator.userAgent.match(/OS [8-9]_\d[_\d]* like Mac OS X/)){//判断IOS版本
        if(window.webkit.messageHandlers.getHeadTitle){
            window.webkit.messageHandlers.getHeadTitle.postMessage({body: "Device Control"});
        }
        if(window.webkit.messageHandlers.settingBtnShowOrNot){
            window.webkit.messageHandlers.settingBtnShowOrNot.postMessage({body: "1"});
        }
    }else {
        if (window.js.getHeadTitle) {
            window.js.getHeadTitle('Device Control'); // 调用原生提供的修改标题方法。
        }
        if (window.js.settingBtnShowOrNot) {
            window.js.settingBtnShowOrNot(1);
        }
    }
    
    $scope.my = {}
    $scope.my.switch = true;
    
    // 获取区域下所有设备
    Device.all(regionId, gatewayId).then(function(data) {
        $ionicLoading.hide();
        if(data.code == '0'){
            $scope.devices = data.content;
            Device.set(data);
            $scope.my.device = data.content[0];
        }else {
            dialogsManager.showMessage(data.message,"red");
        }
        $scope.my.channel = [];
        for(var i=0;i<data.content[0].channel.length;i++){
            $scope.my.channel[i] = {};
            $scope.my.channel[i].channel_number = data.content[0].channel[i].channel_number;
            $scope.my.channel[i].channel_name = data.content[0].channel[i].channel_name;
            $scope.my.channel[i].channel_value = Math.round(data.content[0].channel[i].channel_value*100/255);
            // console.log('$scope.my.channel',$scope.my.channel)
        }
    })

    // 监听设备变化，通道也跟着变化。
    $scope.deviceChange = function() {
        if ($scope.my.device && $scope.my.device.channel) {
            $scope.my.channel = [];
            for(var i=0;i<$scope.my.device.channel.length;i++){
                $scope.my.channel[i] = {};
                $scope.my.channel[i].channel_number = $scope.my.device.channel[i].channel_number;
                $scope.my.channel[i].channel_name = $scope.my.device.channel[i].channel_name;
                $scope.my.channel[i].channel_value = Math.round($scope.my.device.channel[i].channel_value*100/255);
            }
        } else {
            $scope.my.channel = [];
        }
    }

    // 控制设备开关
    $scope.ctrlDeviceOn = function () {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var device = $scope.my.device;
        var ctrlDeviceOnData = {
            table_device: [{
                device_guid: device.table_device_guid,
                device_addr: device.device_addr,
                gateway_id: device.gateway_id,
                device_switch: "01",
                device_type : 'bulb',//TODO 静态值，后期要改
                device_delay: '1'
            }]
        };
        Device.updSwitch(ctrlDeviceOnData).then(function (data) {
            $ionicLoading.hide();
            if (data.code == '0') {
                dialogsManager.showMessage(data.message,"green");
            } else {
                dialogsManager.showMessage(data.message,"red");
            }
        });
    };
    $scope.ctrlDeviceOff = function () {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var device = $scope.my.device;
        var ctrlDeviceOffData = {
            table_device: [{
                device_guid: device.table_device_guid,
                device_addr: device.device_addr,
                gateway_id: device.gateway_id,
                device_switch: "00",
                device_type : 'bulb',//TODO 静态值，后期要改
                device_delay: '1'
            }]
        };
        // console.log('关闭区域设备传参',ctrlDeviceOffData)
        Device.updSwitch(ctrlDeviceOffData).then(function (data) {
            $ionicLoading.hide();
            if (data.code == '0') {
                dialogsManager.showMessage(data.message,"green");
            } else {
                dialogsManager.showMessage(data.message,"red");
            }
        });
    };
    // 控制设备通道
    $scope.ctrlChannel = function (channel) {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var device = $scope.my.device;
        // 修改通道值，提示用户修改结果
        var channelValue =  {
            channel_number: channel.channel_number,
            value: ""+Math.round(channel.channel_value*255/100)
        };
        Device.updChannel(device.table_device_guid, device.device_addr, channelValue, device.gateway_id).then(function (data) {
            $ionicLoading.hide();
            if (data.code == '0') {
                dialogsManager.showMessage(data.message,"green");
            } else {
                dialogsManager.showMessage(data.message,"red");
            }
        })
    }
})

/**
 * 区域->组控制
 */
.controller('RegionalGroupCtrl', function($scope, $state, $stateParams, $rootScope, RegionGroups, HttpService, dialogsManager,$timeout, $ionicLoading) {

    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    var regionId = $stateParams.regionId;
    var gatewayId = $stateParams.gatewayId;

    if(navigator.userAgent.match(/OS [8-9]_\d[_\d]* like Mac OS X/)){//判断IOS版本
        if(window.webkit.messageHandlers.getHeadTitle){
            window.webkit.messageHandlers.getHeadTitle.postMessage({body: "Regional Group"});
        }
        if(window.webkit.messageHandlers.settingBtnShowOrNot){
            window.webkit.messageHandlers.settingBtnShowOrNot.postMessage({body: "1"});
        }
    }else {
        if (window.js.getHeadTitle) {
            window.js.getHeadTitle('Regional Group'); // 调用原生提供的修改标题方法。
        }
        if (window.js.settingBtnShowOrNot) {
            window.js.settingBtnShowOrNot(1);
        }
    }


    
    // 获取组列表
    RegionGroups.getList(regionId,gatewayId).then(function(data) {
        $ionicLoading.hide();
        if(!data || data.length == 0){
            dialogsManager.showMessage("No Regional Group","red");
        }else {
            $scope.groupList = data;
        }
    });
    
    // 去组详情
    $scope.toGroupDetail = function(group) {
        $rootScope.group = group;
        $state.go('regional-group-detail', {
            groupId: group.table_group_guid, 
            gatewayId: gatewayId, 
            regionId: regionId, 
            groupAddr: group.group_addr
        })
    }
})

/**
 * 区域-组-详情
 */
.controller('RegionalGroupDetailCtrl', function($scope, $rootScope, $stateParams, DeviceGroups, RegionGroups, HttpService, dialogsManager,$timeout, $ionicLoading) {
    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    var groupId = $stateParams.groupId;
    var regionId = $stateParams.regionId;
    var gatewayId = $stateParams.gatewayId;
    var groupAddr = $stateParams.groupAddr;


    if(navigator.userAgent.match(/OS [8-9]_\d[_\d]* like Mac OS X/)){//判断IOS版本
        if(window.webkit.messageHandlers.getHeadTitle){
            window.webkit.messageHandlers.getHeadTitle.postMessage({body: "Group Control"});
        }
        if(window.webkit.messageHandlers.settingBtnShowOrNot){
            window.webkit.messageHandlers.settingBtnShowOrNot.postMessage({body: "1"});
        }
    }else {
        if (window.js.getHeadTitle) {
            window.js.getHeadTitle('Group Control'); // 调用原生提供的修改标题方法。
        }
        if (window.js.settingBtnShowOrNot) {
            window.js.settingBtnShowOrNot(1);
        }
    }


    $scope.my = {}
    // 获取组下的通道
    $scope.channelList = [];
    RegionGroups.getChannel(groupId, gatewayId).then(function(data) {
        $ionicLoading.hide();
        // console.log('区域组通道信息',data)
        for(var i = 0;i<data.length;i++){
            $scope.channelList[i] = {};
            $scope.channelList[i].channel_name = data[i].channel_name;
            $scope.channelList[i].channel_number = data[i].channel_number;
            $scope.channelList[i].channel_value = Math.round(data[i].channel_value*100/255);
            // console.log('$scope.channelList',$scope.channelList)
        }
    });

    $scope.ctrlGroupOn = function () {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var ctrlGroupOnData = {
            table_group: [{
                group_guid: groupId,
                group_addr: groupAddr,
                group_switch: '01',
                gateway_id: gatewayId,
                group_delay: '1'
            }]
        }
        DeviceGroups.updSwitch(ctrlGroupOnData).then(function (data) {
            $ionicLoading.hide();
            if (data.code == '0') {
                dialogsManager.showMessage(data.message,"green");
            } else {
                dialogsManager.showMessage(data.message,"red");
            }
        })
    };

    $scope.ctrlGroupOff = function () {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var ctrlGroupOffData = {
            table_group: [{
                group_guid: groupId,
                group_addr: groupAddr,
                group_switch: '00',
                gateway_id: gatewayId,
                group_delay: '1'
            }]
        }
        DeviceGroups.updSwitch(ctrlGroupOffData).then(function (data) {
            $ionicLoading.hide();
            if (data.code == '0') {
                dialogsManager.showMessage(data.message,"green");
            } else {
                dialogsManager.showMessage(data.message,"red");
            }
        })
    };
    // 组-控制设备通道
    $scope.ctrlChannel = function (channelList) {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $scope.groupChannels = [];
        // var groupChannelList = {};
        for(var i = 0;i<channelList.length;i++){
            $scope.groupChannels[i] = {};
            $scope.groupChannels[i].channel_number = channelList[i].channel_number;
            $scope.groupChannels[i].channel_value = ""+Math.round(channelList[i].channel_value*255/100);
            // groupChannels.push(groupChannelList);
        }
        DeviceGroups.updChannel(groupId, groupAddr, $scope.groupChannels,gatewayId).then(function (data) {
            $ionicLoading.hide();
            if (data.code == '0') {
                dialogsManager.showMessage(data.message,"green");
            } else {
                dialogsManager.showMessage(data.message,"red");
            }
        })
    }
})

/**
 * 区域-场景
 */
.controller('RegionalSceneCtrl', function($scope, $state, $stateParams, Scene,dialogsManager,$timeout, $ionicLoading) {
    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    var regionId = $stateParams.regionId;
    var gatewayId = $stateParams.gatewayId;

    // if (window.js) {
    //     if (window.js.getHeadTitle) {
    //         window.js.getHeadTitle('Regional Scene'); // 调用原生提供的修改标题方法。
    //     }
    //     if (window.js.settingBtnShowOrNot) {
    //         window.js.settingBtnShowOrNot(0);
    //     }
    // }

    if(navigator.userAgent.match(/OS [8-9]_\d[_\d]* like Mac OS X/)){//判断IOS版本
        if(window.webkit.messageHandlers.getHeadTitle){
            window.webkit.messageHandlers.getHeadTitle.postMessage({body: "Regional Scene"});
        }
        if(window.webkit.messageHandlers.settingBtnShowOrNot){
            window.webkit.messageHandlers.settingBtnShowOrNot.postMessage({body: "1"});
        }
    }else {
        if (window.js.getHeadTitle) {
            window.js.getHeadTitle('Regional Scene'); // 调用原生提供的修改标题方法。
        }
        if (window.js.settingBtnShowOrNot) {
            window.js.settingBtnShowOrNot(1);
        }
    }

    
    // 获取场景下场景列表
    Scene.getList(regionId, gatewayId).then(function(data) {
        $ionicLoading.hide();
        if(!data || data.length == 0){
            dialogsManager.showMessage("No Regional Scene","red");
        }else {
            $scope.sceneList = data;
        }
    });
    
    // 去场景详情
    $scope.toSceneDetail = function(scene) {
        $state.go('regional-scene-detail', {
            sceneId: scene.table_scene_guid, 
            gatewayId: gatewayId,
            regionId: regionId,
            sceneAddr: scene.scene_addr,
        });
    }
})

/**
 * 区域-场景-详情
 */
.controller('RegionalSceneDetailCtrl', function($scope, $rootScope, $stateParams, Scene, dialogsManager,$timeout, $ionicLoading) {
    var sceneId = $stateParams.sceneId;
    var regionId = $stateParams.regionId;
    var sceneAddr = $stateParams.sceneAddr;
    var gatewayId = $stateParams.gatewayId;
    $scope.my = {};
    $scope.my.switch = true; // todo 目前默认为true，需要改成从接口中获取

    // if (window.js) {
    //     if (window.js.getHeadTitle) {
    //         window.js.getHeadTitle('Scene Control'); // 调用原生提供的修改标题方法。
    //     }
    //     if (window.js.settingBtnShowOrNot) {
    //         window.js.settingBtnShowOrNot(0);
    //     }
    // }
    if(navigator.userAgent.match(/OS [8-9]_\d[_\d]* like Mac OS X/)){//判断IOS版本
        if(window.webkit.messageHandlers.getHeadTitle){
            window.webkit.messageHandlers.getHeadTitle.postMessage({body: "Scene Control"});
        }
        if(window.webkit.messageHandlers.settingBtnShowOrNot){
            window.webkit.messageHandlers.settingBtnShowOrNot.postMessage({body: "1"});
        }
    }else {
        if (window.js.getHeadTitle) {
            window.js.getHeadTitle('Scene Control'); // 调用原生提供的修改标题方法。
        }
        if (window.js.settingBtnShowOrNot) {
            window.js.settingBtnShowOrNot(1);
        }
    }


    
    // 场景控制
    $scope.sceneSwitch = function() {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        Scene.updSwitch(gatewayId, sceneAddr,sceneId).then(function(data) {
            $ionicLoading.hide();
            if (data.code == '0') {
                dialogsManager.showMessage(data.message,"green");
            } else {
                dialogsManager.showMessage(data.message,"red");
            }
        })
    }
    
    // // 场景详情
    // Scene.getDetail(sceneId, gatewayId).then(function(data) {
    //     $scope.deviceList = data;
    // });
})