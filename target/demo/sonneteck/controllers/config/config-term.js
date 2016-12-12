angular.module('sntApp').controller('ConfigTermCtrl', function($scope, $state, AuthService, $rootScope, $uibModal, $stateParams, $log, toaster, POPTIMEOUT) {

    // 获取区域条件控制集合列表加载提示
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = 'Loading...';
    $scope.backdrop = false;
    $scope.promise = null;
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
    $scope.animationsEnabled = true;

    //获取用户的条件控制集合
    var findTermProm = AuthService.myHttp({},'GET','device/term').then(function (data) {
        log('获取用户的条件控制集合', data)
        $scope.termList = data.content;
        // $scope.term = data.content[0];
    })
    $scope.newTermShow = true;
    $scope.newRuleShow = false;
    $scope.newSequenceShow = false;
    //显示条件页面
    $scope.toRules = function (item) {
        log('进入条件页面时收到的信息',item);
        $scope.newTermShow = false;
        $scope.newRuleShow = true;
        $scope.newSequenceShow = false;
        $scope.cdtsListGuid = item.cdts_list_guid;//测试,用于新建条件成功之后重新查找条件
        $scope.termInfo = item;
        $scope.newRuleTermName = item.cdts_name;
        $scope.ruleList = item.conditions;
        log('条件列表',$scope.ruleList)
    }
    //显示序列页面
    $scope.toSequence = function (item) {
        log('进入序列页面时收到的信息',item);
        $scope.newTermShow = false;
        $scope.newRuleShow = false;
        $scope.newSequenceShow = true;
        $scope.newSqnTermName = item.cdts_name;
        $scope.cdtslistGuid = item.cdts_list_guid;
        $scope.seqTermInfo = item;
        $scope.sequenceList = item.ctrl_sequence;
    }
    //新建条件成功
    $rootScope.$on('addConditionSuccess',function () {
        var findTermProm = AuthService.myHttp({},'GET','device/term').then(function (data) {
            $scope.termList = data.content;
            log('获取用户的条件控制集合', $scope.termList)
            log('$scope.cdtsListGuid',$scope.cdtsListGuid)
            for(var i=0;i<$scope.termList.length;i++){
                if($scope.termList[i].cdts_list_guid == $scope.cdtsListGuid){
                    $scope.ruleList = $scope.termList[i].conditions;
                    log('重新查找条件信息',$scope.ruleList)
                }
            }
        })
    })
    //新建动作成功
    $rootScope.$on('addActionSuccess',function () {
        var findTermProm = AuthService.myHttp({},'GET','device/term').then(function (data) {
            $scope.termList = data.content;
            log('获取用户的条件控制集合', $scope.termList)
            log('$scope.cdtsListGuid',$scope.cdtslistGuid)
            for(var i=0;i<$scope.termList.length;i++){
                if($scope.termList[i].cdts_list_guid == $scope.cdtslistGuid){
                    // $scope.ruleList = $scope.termList[i].conditions;
                    $scope.sequenceList = $scope.termList[i].ctrl_sequence;
                    log('重新查找条件信息',$scope.sequenceList)
                }
            }
        })
    })
    $scope.backToTerm = function () {
        $scope.newTermShow = true;
        $scope.newRuleShow = false;
        $scope.newSequenceShow = false;
        $scope.findTermProm = AuthService.myHttp({},'GET','device/term').then(function (data) {
            log('获取用户的条件控制集合', data)
            $scope.termList = data.content;
            // $scope.term = data.content[0];
        })
    }

    //进入条件控制详情页
    $scope.toTermDetail = function(item) {
        $rootScope.termDetailData = item;
        $state.go('index.config.term.detail');
    }

    // 新建条件控制弹窗
    $scope.animationsEnabled = true;
    $scope.newTerm = function (size) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'newTerm.html',
            controller: 'NewTermModalCtrl',
            size: size
        });

        modalInstance.result.then(function (addTermResult) {
            log('add term ok');
            var findTermProm = AuthService.myHttp({},'GET','device/term').then(function (data) {
                log('获取用户的条件控制集合', data)
                $scope.termList = data.content;
                var termIndex = data.content.length - 1
                $scope.term = data.content[termIndex];
            })
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    // 新建条件弹窗
    $scope.newRules = function (regionTerm) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'newRule.html',
            controller: 'NewRuleModalCtrl',
            resolve: {
                regionTerm: function () {
                    return regionTerm;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    //序列详情弹窗
    $scope.openSqnDetail = function (sequence) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'sequenceDetail.html',
            controller: 'SequenceDetailModalCtrl',
            resolve: {
                sequence: function () {
                    return sequence;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    // 新建序列弹窗
    $scope.newSequence = function (termInfo) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'newSequence.html',
            controller: 'NewSequenceModalCtrl',
            resolve: {
                termInfo: function () {
                    return termInfo;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    //新建条件控制
    // $scope.addNewTerm = function () {
    //     $state.go('index.config.term.newTerm');
    // }

    // 删除条件控制弹窗
    $scope.removeTerm = function (size) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: './pages/confirm-template.html',
            controller: 'ConfirmCtrl',
            size: size,
        });

        modalInstance.result.then(function (deleteTermResult) {
            log('delete ok');
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
})

/**
 * 新建条件控制集合  测试OK
 */
angular.module('sntApp').controller('NewTermModalCtrl', function($scope, $state, $rootScope, $uibModalInstance, $stateParams, POPTIMEOUT, toaster, AuthService) {
    $scope.termName;
    $scope.gateway;
    
    var gateway = AuthService.myHttp({},'GET','login/user_info').then(function (data) {
        if (data) {
              $scope.gatewayList = data.content;
              $scope.gateway = data.content[0];
        } else {
              $scope.gatewayList = 'no Data';
        }
    })
    
    $scope.ok = function () {
        data = {
          table_cdts_list: [{
            cdts_name: $scope.termName,
            gateway_id: $scope.gateway.gateway_id
          }]  
        }
        
        log('data 参数', data);
        // 添加条件控制
        AuthService.myHttp(data, 'POST', 'device/term').then(function (data) {
          log('data', data);
            if (data.code == '0') {                      
                toaster.pop({type: 'success', title: 'Add Term', body: 'Add Term Successfully', timeout: POPTIMEOUT});
            } else {                
                toaster.pop({type: 'error', title: 'Add Term', body: 'Add Term Fail', timeout: POPTIMEOUT});
            }
            
            $uibModalInstance.close();
        });
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})


/**
 * 新建条件
 */
angular.module('sntApp').controller('NewRuleModalCtrl', function($scope, $state, $rootScope, $uibModalInstance, $stateParams, POPTIMEOUT, toaster, AuthService,regionTerm) {

    log('新建条件时接收到的term信息',regionTerm);
    $scope.cdts_list_guid = regionTerm.cdts_list_guid;
    $scope.gateway_id = regionTerm.gateway_id;
    var data = {
        region_guid: $stateParams.ToRegionSetRegionGuid,
        gateway_id: $stateParams.ToRegionSetGatewayId,
    }
    log('rule data', data);
    AuthService.myHttp(data, 'GET', 'region/device').then(function (data) {
          log('region/device', data);
          if (data.code == '0' && data.content && data.content.length>0) {
              $scope.deviceList = data.content;
          } else {
              $scope.deviceList = 'no Data'
          }
      })
    //选择设备
    $scope.selectDevice = function (item) {
        log('新建条件时选择的设备信息',item);
        $scope.channelList = item.channel;
    }
    $scope.selectChannel = function (item) {
        log('新建条件时选择的通道信息',item);
        $scope.table_device_guid = item.table_device_guid;
        $scope.channel_class = item.channel_class;
        $scope.channel_type = item.channel_type;
        $scope.channel_bit_num = item.channel_bit_num;
    }
    $scope.newRuleValue = "";
    $scope.newRuleOk = function () {
        var testRuleValue = /^[-+]?\d*$/;
        if(!$scope.table_device_guid || $scope.table_device_guid == '' || !$scope.channel_bit_num || $scope.channel_bit_num == ''){
            toaster.pop({type: 'error', title: 'Error', body:'Please select device', timeout: POPTIMEOUT});
        }else {
            if($scope.newRuleValue == '' || $scope.newRuleValue > 255 || $scope.newRuleValue < 0 || !testRuleValue.test($scope.newRuleValue)){
                toaster.pop({type: 'error', title: 'Error', body:'The value format error', timeout: POPTIMEOUT});
            }else {
                var data = {
                    "table_conditons":[{
                        "cdts_list_guid":$scope.cdts_list_guid,
                        "gateway_id":$scope.gateway_id,
                        "table_device_guid":$scope.table_device_guid,
                        "channel_class":$scope.channel_class,
                        "channel_type":$scope.channel_type,
                        "channel_bit_num":$scope.channel_bit_num,
                        "compare_val":$scope.newRuleValue,
                        "offset_val":"0"
                    }]
                }
                log('新建条件时的传参',data);
                var conditionProm = AuthService.myHttp(data,'POST','device/term/conditions').then(function (data) {
                    log('新建条件返回信息',data);
                    if (data.code != '0') {
                        toaster.pop({type: 'error', title: 'Condition', body: 'Added Failed', timeout: POPTIMEOUT});
                    } else {
                        toaster.pop({type: 'success', title: 'Condition', body: 'Added Successfully', timeout: POPTIMEOUT});
                        $rootScope.$broadcast('addConditionSuccess');
                        $uibModalInstance.close();
                        // $rootScope.$broadcast('addSceneMemSuccess')
                    }
                })
            }
        }
    }
    $scope.newRuleCancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
})


/**
 * 序列详情
 */
angular.module('sntApp').controller('SequenceDetailModalCtrl',function ($scope, $state, $rootScope, $uibModalInstance, $stateParams, POPTIMEOUT, toaster, AuthService,sequence) {
    log('序列详情页接收到的信息',sequence);
    $scope.num = sequence.control_number;
    $scope.sqnDetailInfo = sequence.control;
    $scope.sqnDetailOk = function () {
        $uibModalInstance.dismiss('cancel');
    }
})

/**
 * 新建序列
 */
angular.module('sntApp').controller('NewSequenceModalCtrl', function($scope, $state, $rootScope, $uibModalInstance, $stateParams, POPTIMEOUT, toaster, AuthService,termInfo) {

    $scope.setOk = false;
    $scope.setSqn = true;
    $scope.setSqnOver = false;
    $scope.setAction = false;
    log('新建序列时接收到的term信息',termInfo);
    var ToRegionSetRegionGuid = $stateParams.ToRegionSetRegionGuid;
    var ToRegionSetGatewayId = $stateParams.ToRegionSetGatewayId;
    var ToRegionSetRegionName = $stateParams.ToRegionSetRegionName;
    var ToRegionSetRegionAddr = $stateParams.ToRegionSetRegionAddr;
    if(!termInfo.ctrl_sequence){
        $scope.sequence = "1";
    }else {
        $scope.sequence = termInfo.ctrl_sequence.length + 1;
    }
    //添加序列
    // $scope.sequence = "";
    $scope.time = "";
    $scope.addSequence = function () {
        var testSequence = /^[-+]?\d*$/;
        if($scope.sequence == '' || $scope.time == '' || !testSequence.test($scope.sequence)){
            toaster.pop({type: 'error', title: 'Error', body:'Message can not be null', timeout: POPTIMEOUT});
        }else {
            var tableCtrlSequence = {
               "table_ctrl_sequence" : [{
                    cdts_list_guid: termInfo.cdts_list_guid,
                    gateway_id: termInfo.gateway_id,
                    control_number: ""+$scope.sequence,
                    control_time: $scope.time
                }]
            }
            log('tableCtrlSequence',tableCtrlSequence)
            var sequenceProm = AuthService.myHttp(tableCtrlSequence,'POST','device/term/sequence').then(function (data) {
                log('新建序列返回信息',data);
                if (data.code != '0') {
                    toaster.pop({type: 'error', title: 'Sequence', body: 'Added Failed', timeout: POPTIMEOUT});
                } else {
                    toaster.pop({type: 'success', title: 'Sequence', body: 'Added Successfully', timeout: POPTIMEOUT});
                    $scope.setOk = true;
                    $scope.setSqn = false;
                    $scope.setSqnOver = true;
                    $scope.setAction = true;
                    $scope.sqn_guid = data.content[0].ctrl_sqn_guid;
                    $scope.control_number = data.content[0].control_number;
                    $scope.control_time = data.content[0].control_time;
                    // $rootScope.$broadcast('addSceneMemSuccess')
                }
            })
        }
    }
    $scope.typeList = [
        {
            name: 'Region',
            key: 'region',
            table :'table_region',
            targetList: [
                {
                    name: 'Channel',
                    key: 'channel'
                }
                // ,
                // {
                //     name: 'Switch',
                //     key: 'switch'
                // }
            ]
        },
        {
            name: 'Group',
            key: 'group',
            table :'table_group',
            targetList: [
                {
                    name: 'Channel',
                    key: 'channel'
                }
                // ,
                // {
                //     name: 'Switch',
                //     key: 'switch'
                // }
            ]
        },
        // {
        //     name: 'Scene',
        //     key: 'scene',
        //     table :'table_scene',
        //     targetList: [
        //         {
        //             name: 'Switch',
        //             key: 'switch'
        //         }
        //     ]
        // },
        {
            name: 'Device',
            key: 'device',
            table :'table_device',
            targetList: [
                {
                    name: 'Channel',
                    key: 'channel'
                }
                // ,
                // {
                //     name: 'Switch',
                //     key: 'switch'
                // }
            ]
        }];
    $scope.my = {};

    $scope.my.type = $scope.typeList[0]; // 获取选择的类型
    $scope.my.target = $scope.my.type.targetList[0]; // 获取选择的目标
    $scope.my.dataTime = ''; // 到下个序列的时间
    $scope.my.switchValue = '00'; // 开关动作的值
    $scope.my.channelValue = ''; // 通道值
    $scope.my.sequenceList = [];
    $scope.my.channelList = [] // 选择的通道数组
    $scope.my.channel = {}; // 选择的通道对象
    $scope.my.objList = [{name: ToRegionSetRegionName}]; // 操作对象列表，默认显示区域
    $scope.my.obj = $scope.my.objList[0] // 选择的操作对象，默认为区域id

    //获取区域通道
    var data = {
        region_guid: ToRegionSetRegionGuid,
        gateway_id: ToRegionSetGatewayId
    };
    // 获取区域下通道信息
    $scope.channelProm = AuthService.myHttp(data, 'GET', 'region/region_channel').then(function (data) {
        log('获取区域下通道信息', data);
        if(data.code == "-1"){
            // 获取失败
        }else {
            var regionChannel = data.content;
            $scope.my.channelList = regionChannel;
            $scope.my.channel = regionChannel[0]; // 通道动作
        }
    })

    //改变type
    $scope.typeChange = function () {
        switch ($scope.my.type.key){
            case 'region' :
                $scope.my.objList = [{name: ToRegionSetRegionName}];
                $scope.my.obj = $scope.my.objList[0];
                // 刷新区域下的通道
                var regionData = {
                    region_guid: ToRegionSetRegionGuid,
                    gateway_id: ToRegionSetGatewayId
                };
                $scope.channelProm = AuthService.myHttp(regionData, 'GET', 'region/region_channel').then(function (data) {
                    log('获取区域下通道信息', data);
                    if(data.code == "-1"){
                        // 获取失败
                    }else {
                        var regionChannel = data.content;
                        $scope.my.channelList = regionChannel;
                        $scope.my.channel = regionChannel[0]; // 通道动作
                    }
                })
                break;
            case 'device' :
                //获取区域下的设备
                var regionDeviceData = {
                    region_guid: ToRegionSetRegionGuid,
                    gateway_id: ToRegionSetGatewayId
                }
                // 获取区域设备
                $scope.regionDeviceProm = AuthService.myHttp(regionDeviceData, 'GET', 'region/device').then(function (data) {
                    log('获取区域设备', data);
                    var device = data.content;
                    $scope.my.objList = device; //查询device
                    $scope.my.obj = $scope.my.objList[0];
                    $scope.my.channelList = data[0].channel;
                    $scope.my.channel = data[0].channel[0];
                    $scope.my.channel.channel_number = $scope.my.channel.channel_bit_num;
                })
                break;
            case 'group' :
                //获取区域下的组
                var findRegionGroupData = {
                    region_guid: ToRegionSetRegionGuid,
                    gateway_id: ToRegionSetGatewayId
                }
                var groupProm = AuthService.myHttp(findRegionGroupData, 'GET', 'region/group').then(function(data){
                    log('查询区域组', data);
                    var groupList = data.content;
                    $scope.my.objList = groupList; //查询device
                    $scope.my.obj = $scope.my.objList[0];
                })
                break;
            // case 'scene' :
            //     //获取区域下的场景
            //     var data = {
            //         region_guid: ToRegionSetRegionGuid,
            //         gateway_id: ToRegionSetGatewayId
            //     };
            //     var sceneProm = AuthService.myHttp(data,'GET','region/scene').then(function (data) {
            //         log('获取区域下的场景信息', data);
            //         var scenesList = data.content;
            //         $scope.my.objList = scenesList; //查询device
            //         $scope.my.obj = $scope.my.objList[0];
            //     })
            //     break;
        }
        $scope.my.target = $scope.my.type.targetList[0]; // 控制目标切换为type对应的目标
    }
    //添加动作到待添加表格
    $scope.addAction = function () {
        //利用添加时间作为动作主键,用于移除时用
        var date=new Date();
        var dateNow=date.getMilliseconds()+date.getSeconds()*60+date.getMinutes()*3600+date.getHours()*60*3600+date.getDay()*3600*24+date.getMonth()*3600*24*31+date.getYear()*3600*24*31*12;
        var action = {
            action_id : dateNow,
            type_name: $scope.my.type.name,
            region_name: $scope.my.obj.name,
            device_name: $scope.my.obj.device_name,
            table_name : $scope.my.type.table,
            group_name: $scope.my.obj.group_name,
            // scene_name: $scope.my.obj.scene_name,
            id: $scope.my.obj.table_device_guid || $scope.my.obj.table_group_guid || ToRegionSetRegionGuid,
            address: $scope.my.obj.group_addr || $scope.my.obj.device_addr || $scope.my.obj.scene_addr || ToRegionSetRegionAddr,
            gateway_id: $scope.my.obj.gateway_id || ToRegionSetGatewayId,
            channel_number: $scope.my.channel.channel_number,
            channel_value: $scope.my.channelValue,
            switchValue: $scope.my.switchValue,
            target: $scope.my.target.key
        }
        $scope.my.sequenceList.push(action)
        log('action',action);
        log('$scope.my.sequenceList',$scope.my.sequenceList)
    }
    //移除动作
    $scope.removeAction = function (item) {
        log('需要移除的动作信息',item);
        for(var i=0;i<$scope.my.sequenceList.length;i++){
            if($scope.my.sequenceList[i].action_id == item.action_id){
                log('删除元素的小标',i);
                $scope.my.sequenceList.splice(i,1);
            }
        }
    }
    $scope.newSequenceOk = function () {
        //这边需要在设置序号之后获取序号ID
        var ctrl_sqn_guid = "";
        var sequenceParam = [];
        for (var i = 0; i < $scope.my.sequenceList.length; i++) {
            var sequence = {
                ctrl_sqn_guid: $scope.sqn_guid,
                main_table_name: $scope.my.sequenceList[i].table_name,
                dcgs_guid: $scope.my.sequenceList[i].id,
                gateway_id: $scope.my.sequenceList[i].gateway_id,
                m_address: $scope.my.sequenceList[i].address,
                channel_bit_num: $scope.my.sequenceList[i].channel_number,
                m_value: $scope.my.sequenceList[i].channel_value,
                // m_switch: $scope.my.sequenceList[i].switchValue,
                m_delay: "1"
            }
            sequenceParam.push(sequence);
            log('sequenceParam',sequenceParam)
            var data = {
                "table_control" : sequenceParam
            }
        }
        var SeqProm = AuthService.myHttp(data,'POST','device/term/controls').then(function (data) {
            log('新建动作返回结果',data);
            if (data.code != '0') {
                toaster.pop({type: 'error', title: 'Action', body: 'Added Failed', timeout: POPTIMEOUT});
            } else {
                toaster.pop({type: 'success', title: 'Action', body: 'Added Successfully', timeout: POPTIMEOUT});
                $rootScope.$broadcast('addActionSuccess');
                $uibModalInstance.close();
                // $rootScope.$broadcast('addSceneMemSuccess')
            }
        })
    }
    $scope.newSequenceCancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
})
