angular.module('sntApp').controller('termNewActionCtrl', function($scope, $state,AuthService,$rootScope) {

    var user_id = $rootScope.user_id;

    //承接已经创建的action,用户页面显示
    $scope.Actions = [];
    //创建一个下拉框选项,用户在新建时可以选择
    $scope.selectModels = [
        {
            "id":"1",
            "name":"group"
        },
        {
            "id":"2",
            "name":"scene"
        },
        {
            "id":"3",
            "name":"device"
        },
        {
            "id":"4",
            "name":"region"
        }
    ]
    //选择不同模式后下拉框的显示
    $scope.isDeviceShow = true;
    $scope.isSceneShow = false;
    $scope.isGroupShow = false;
    $scope.isRegionActionShow = false;
    $scope.isSceneActionShow = false;
    $scope.isDeviceActionShow = false;
    $scope.isGroupActionShow = false;
    $scope.selectModel = function (item) {
        log(item)
        if(item.id == "3"){
            $scope.isRegionActionShow = false;
            $scope.isSceneActionShow = false;
            $scope.isDeviceActionShow = true;
            $scope.isGroupActionShow = false;
            //获取区域的设备
            var findDevice = {};
            findDevice.user_id = user_id;
            findDevice.region_guid = $rootScope.ToRegionSetRegionGuid;
            findDevice.gateway_id = $rootScope.ToRegionSetGatewayId;
            var device = AuthService.myHttp(findDevice,'GET','region/device');
            device.then(function (data) {
                log(data);
                $scope.isDeviceShow = true;
                $scope.isSceneShow = false;
                $scope.isGroupShow = false;
                $scope.isRegionShow = false;
                $scope.deviceInfo = data.content;//已经包含了通道值
            })
            //选择的设备信息
            $scope.selectDeviceData = function (item) {
                log(item)
                $scope.deviceName = item.device_name;
                $scope.device_guid = item.device_guid;
                $scope.deviceChannelData = item.channel;
            }
            //设备模式下添加条件控制动作
            $scope.addNewAction = function (item) {
                log(item);
                    $scope.channelBitNum = item.channel_bit_num;
                    $scope.deviceChannelValue = item.deviceChannelValue;
                    $scope.deviceGatewayId = item.gateway_id;
                    var controlActionData = {
                        "user_id":user_id,
                        "table_control":[{
                            "ctrl_sqn_guid":$scope.ctrl_sqn_guid,
                            "main_table_name":"table_device",
                            "dcgs_guid":item.table_device_guid,
                            "gateway_id":$scope.deviceGatewayId,
                            "m_address":item.device_addr,
                            "channel_bit_num":$scope.channelBitNum,
                            "m_value":$scope.deviceChannelValue,
                            "m_delay":"1"
                        }]
                    }
                    log(controlActionData)
                 if(controlActionData.table_control[0].ctrl_sqn_guid == undefined){
                     alert("please set the sequence first")
                 }else {
                     var controlActionProm = AuthService.myHttp(controlActionData,'POST','device/term/controls');
                     controlActionProm.then(function (data) {
                         log(data)
                         if(data.code == "0"){
                             $scope.newActions = {
                                 "device_name":$scope.deviceName,
                                 "channel_bit_num":$scope.channelBitNum,
                                 "channel_value":$scope.deviceChannelValue
                             }
                             $scope.Actions.push($scope.newActions)
                         }
                     })
                 }
            }
        }else if (item.id == "2") {
            //获取区域场景
            var findSceneOfRegionData = {};
            findSceneOfRegionData.user_id = user_id;
            findSceneOfRegionData.region_guid = $rootScope.ToRegionSetRegionGuid;
            findSceneOfRegionData.gateway_id = $rootScope.ToRegionSetGatewayId;
            log(findSceneOfRegionData)
            var scene = AuthService.myHttp(findSceneOfRegionData,'GET','region/scene');
            scene.then(function (data) {
                log(data);
                $scope.isDeviceShow = false;
                $scope.isSceneShow = true;
                $scope.isGroupShow = false;
                $scope.isRegionShow = false;
                $scope.isRegionActionShow = false;
                $scope.isSceneActionShow = true;
                $scope.isDeviceActionShow = false;
                $scope.isGroupActionShow = false;
                $scope.sceneInfo = data.content;
            })
            //场景模式下添加条件控制动作
            //选择的场景信息
            $scope.selectSceneData = function (item) {
                log(item);
                $scope.actionSceneGuid = item.table_scene_guid;
                $scope.actionSceneGate = item.gateway_id;
                $scope.actionSceneAddr = item.scene_addr;
                $scope.actionSceneName = item.scene_name;
            }
            $scope.actionSceneControl = function (item) {
                log(item)
                if($scope.sceneEnabled = true){
                    var controlSceneOnData = {
                        "user_id":user_id,
                        "table_control":[{
                            "ctrl_sqn_guid":$scope.ctrl_sqn_guid,
                            "main_table_name":"table_scene",
                            "dcgs_guid":$scope.actionSceneGuid,
                            "gateway_id":$scope.actionSceneGate,
                            "m_address":$scope.actionSceneAddr,
                            "scene_switch":"01",
                            "m_delay":"1"
                        }]
                    }
                    log(controlSceneOnData)
                    var controlActionProm = AuthService.myHttp(controlSceneOnData,'POST','device/term/controls');
                    controlActionProm.then(function (data) {
                        log(data)
                    })
                }else {
                    var controlSceneOffData = {
                        "user_id":user_id,
                        "table_control":[{
                            "ctrl_sqn_guid":$scope.ctrl_sqn_guid,
                            "main_table_name":"table_scene",
                            "dcgs_guid":$scope.actionSceneGuid,
                            "gateway_id":$scope.actionSceneGate,
                            "m_address":$scope.actionSceneAddr,
                            "scene_switch":"01",
                            "m_delay":"1"
                        }]
                    }
                    log(controlSceneOffData)
                    var controlSceneOffProm = AuthService.myHttp(controlSceneOffData,'POST','device/term/controls');
                    controlSceneOffProm.then(function (data) {
                        log(data)
                    })
                }
            }
        }else if(item.id == "1"){
            //获取区域下的组
            var data = {
                "user_id":user_id,
                "region_guid":$rootScope.ToRegionSetRegionGuid
            };
            log(data)
            var groupProm = AuthService.myHttp(data, 'GET', 'region/group');
            groupProm.then(function(data){
                log(data)
                $scope.isRegionActionShow = false;
                $scope.isSceneActionShow = false;
                $scope.isDeviceActionShow = false;
                $scope.isGroupActionShow = true;
                $scope.isDeviceShow = false;
                $scope.isSceneShow = false;
                $scope.isGroupShow = true;
                $scope.isRegionShow = false;
                $scope.groupInfo = data.content;
            })
            $scope.selectGroupData = function (item) {
                log(item)
                $scope.actionGroupGuid = item.table_group_guid;
                $scope.actionGroupGate = item.gateway_id;
                $scope.groupName = item.group_name;
                $scope.actionGroupAddr = item.group_addr;

                var findRegionGroupInfoData = {};
                findRegionGroupInfoData.user_id = user_id;
                findRegionGroupInfoData.gateway_id = $scope.actionGroupGate;
                findRegionGroupInfoData.table_group_guid = $scope.actionGroupGuid;
                log(findRegionGroupInfoData);
                var regionGroupChannelInfo = AuthService.myHttp(findRegionGroupInfoData,'Get','device/group/group_channel');
                regionGroupChannelInfo.then(function (data) {
                    log(data);
                    $scope.RegionGroupChannel = data.content;
                })
            }
            //组模式下添加条件控制动作
            //设置通道
            $scope.addNewGroupAction = function (item) {
                log(item);
                var controlActionData = {
                    "user_id":user_id,
                    "table_control":[{
                        "ctrl_sqn_guid":$scope.ctrl_sqn_guid,
                        "main_table_name":"table_group",
                        "dcgs_guid":$scope.actionGroupGuid,
                        "gateway_id":$scope.actionGroupGate,
                        "channel_bit_num":item.channel_number,
                        "m_value":item.groupChannelValue,
                        "m_delay":"1"
                    }]
                }
                log(controlActionData)
                var controlActionProm = AuthService.myHttp(controlActionData,'POST','device/term/controls');
                controlActionProm.then(function (data) {
                    log(data)
                    // if(data.code == "0"){
                    //     $scope.newActions = {
                    //         "device_name":$scope.deviceName,
                    //         "channel_bit_num":$scope.channelBitNum,
                    //         "channel_value":$scope.deviceChannelValue
                    //     }
                    //     $scope.Actions.push($scope.newActions)
                    // }
                })
            }
            //开关
            $scope.actionGroupControl = function () {
                if($scope.groupEnabled = true){
                    var controlGroupOnData = {
                        "user_id":user_id,
                        "table_control":[{
                            "ctrl_sqn_guid":$scope.ctrl_sqn_guid,
                            "main_table_name":"table_group",
                            "dcgs_guid":$scope.actionGroupGuid,
                            "gateway_id":$scope.actionGroupGate,
                            "m_address":$scope.actionGroupAddr,
                            "scene_switch":"01",
                            "m_delay":"1"
                        }]
                    }
                    log(controlGroupOnData)
                    var controlActionOnProm = AuthService.myHttp(controlGroupOnData,'POST','device/term/controls');
                    controlActionOnProm.then(function (data) {
                        log(data)
                    })
                }else {
                    var controlGroupOffData = {
                        "user_id":user_id,
                        "table_control":[{
                            "ctrl_sqn_guid":$scope.ctrl_sqn_guid,
                            "main_table_name":"table_group",
                            "dcgs_guid":$scope.actionGroupGuid,
                            "gateway_id":$scope.actionGroupGate,
                            "m_address":$scope.actionGroupAddr,
                            "scene_switch":"00",
                            "m_delay":"1"
                        }]
                    }
                    log(controlGroupOffData)
                    var controlActionOffProm = AuthService.myHttp(controlGroupOffData,'POST','device/term/controls');
                    controlActionOffProm.then(function (data) {
                        log(data)
                    })
                }
            }
        }else {
            $scope.isRegionActionShow = true;
            $scope.isSceneActionShow = false;
            $scope.isDeviceActionShow = false;
            $scope.isGroupActionShow = false;
            //区域模式下添加控制动作
            var regionEnabledSwitch = $rootScope.RegionDetailGRegionSwitch;
            $scope.isDeviceShow = false;
            $scope.isSceneShow = false;
            $scope.isGroupShow = false;
            $scope.isRegionShow = true;
            $scope.actionRegionName = $rootScope.ToRegionSetRegionName;

            //获取当前区域的通道
            var findRegionInfo = {};
            findRegionInfo.user_id = $rootScope.user_id;
            findRegionInfo.region_guid = $rootScope.ToRegionSetRegionGuid;
            findRegionInfo.gateway_id = $rootScope.ToRegionSetGatewayId;
            findRegionInfo.region_value = "null";
            log(findRegionInfo)
            var regionChannelProm = AuthService.myHttp(findRegionInfo,'GET','region/region_channel');
            regionChannelProm.then(function (data) {
                log(data);
                $scope.RegionChannelValue = data.content;
            })

            if(regionEnabledSwitch == 01){
                $scope.regionEnabled = true;
            }else {
                $scope.regionEnabled = false;
            }
            //设置区域通道值
            $scope.actionControlRegion = function (item) {
                log(item)
                var actionRegionChannelData ={
                    "user_id":user_id,
                    "table_control":[{
                        "ctrl_sqn_guid":$scope.ctrl_sqn_guid,
                        "main_table_name":"table_region",
                        "dcgs_guid":$rootScope.ToRegionSetRegionGuid,
                        "gateway_id":$rootScope.ToRegionSetGatewayId,
                        "m_address":$rootScope.ToRegionSetRegionAddr,
                        "region_value":{
                            "channel_value":item.actionRegionChannelValue,
                            "channel_number":item.channel_number
                        },
                        "m_delay":"1"
                    }]
                }
                var actionRegionChannelProm = AuthService.myHttp(actionRegionChannelData,'PUT','region/controll');
                actionRegionChannelProm.then(function (data) {
                    log(data)
                })
            }
            //区域开关
            $scope.actionRegionControl = function () {
                if($scope.regionEnabled){
                    var actionRegionOnData = {
                        "user_id":user_id,
                        "table_control":[{
                            "ctrl_sqn_guid":$scope.ctrl_sqn_guid,
                            "main_table_name":"table_region",
                            "dcgs_guid":$rootScope.ToRegionSetRegionGuid,
                            "gateway_id":$rootScope.ToRegionSetGatewayId,
                            "m_address":$rootScope.ToRegionSetRegionAddr,
                            "scene_switch":"01",
                            "m_delay":"1"
                        }]
                    }
                    var actionRegionOnProm = AuthService.myHttp(actionRegionOnData,'PUT','region/controll');
                    actionRegionOnProm.then(function (data) {
                        log(data)
                    })
                }else {
                    var actionRegionOffData = {
                        "user_id":user_id,
                        "table_control":[{
                            "ctrl_sqn_guid":$scope.ctrl_sqn_guid,
                            "main_table_name":"table_region",
                            "dcgs_guid":$rootScope.ToRegionSetRegionGuid,
                            "gateway_id":$rootScope.ToRegionSetGatewayId,
                            "m_address":$rootScope.ToRegionSetRegionAddr,
                            "scene_switch":"00",
                            "m_delay":"1"
                        }]
                    }
                    var actionRegionOffProm = AuthService.myHttp(actionRegionOffData,'PUT','region/controll');
                    actionRegionOffProm.then(function (data) {
                        log(data)
                    })
                }
            }
        }
    }

    //这里是获取当前已经存在的序列,为用户新建时设置默认值
    var actionTermDetailData = $rootScope.termDetailData;
    log(actionTermDetailData);
    $scope.sequenceGatewayId = actionTermDetailData.gateway_id;
    $scope.sequenceCdtsListGuid = actionTermDetailData.cdts_list_guid;
    var actionTermSeq = actionTermDetailData.ctrl_sequence;
    var i = actionTermSeq.length;
    $scope.defaultSeq = i+1;
    log($scope.defaultSeq)

    //获取控制时长
    $scope.control_time = "";
    //设置控制序列
    $scope.setSequence = function () {
        var sequenceData = {
            "user_id":user_id,
            "table_ctrl_sequence":[{
                "cdts_list_guid":$scope.sequenceCdtsListGuid,
                "gateway_id":$scope.sequenceGatewayId,
                "control_number":""+$scope.defaultSeq+"",
                "control_time":$scope.control_time
            }]
        }
        log(sequenceData)
        var sequenceProm = AuthService.myHttp(sequenceData,'POST','/device/term/sequence');
        sequenceProm.then(function (data) {
            log(data)
            var content = data.content;
            $scope.ctrl_sqn_guid = content[0].ctrl_sqn_guid;
            log($scope.ctrl_sqn_guid)
        })
    }
})
