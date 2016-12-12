angular.module('starter.configure', [])
    /**
     * 区域配置
     */
    .controller('ConfigCtrl', function ($scope, $state, $rootScope, Regionals) {
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Region'); // 调用原生提供的修改标题方法。
            }
        }

        // 隐藏loading
        document.getElementById('loadding').style.visibility = "hidden";
        // 获取区域列表
        var regionalsProm = Regionals.all();
        regionalsProm.then(function (data) {
            $scope.regionals = data;

        })
        // 去区域设置
        $scope.toSetRegional = function (regionId, gatewayId, regional) {
            $rootScope.regional = regional
            $state.go('set-regional', {regionId: regionId, gatewayId: gatewayId, regionAddr: regional.region_addr});

            $rootScope.regionId = regionId;
            $rootScope.gatewayId = gatewayId;
            $rootScope.regionAddr = regional.region_addr;

        }
        // 向服务端发送请求，创建区域
        $scope.newRegional = function () {
            $state.go('configure-new-regional')
        }
    })

    /**
     * 创建区域
     */
    .controller('NewRegionalCtrl', function ($scope, $state, $rootScope, Regional, Users, dialogsManager) {
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('New Region'); // 调用原生提供的修改标题方法。
            }
        }

        window.url = "";

        $scope.my = {}; // 用于与页面与服务交互
        $scope.my.regionName = ''; // 区域名
        // 获取网关列表
        Users.getGateway().then(function (data) {
            $scope.gatewayList = data;
            $scope.my.gateway = data[0];
        });
        // 创建区域
        $scope.apply = function () {
            $scope.my.gatewayId = $scope.my.gateway.gateway_id; // 保存用户选择的网关的id
            Regional.newRegional($scope.my).then(function (data) {
                if (data) {
                    // 提示创建成功，返回首页
                    //$rootScope.promptBox('success', 'new region success', function() {
                    //    return $state.go('configure');
                    //});
                    dialogsManager.showMessage("new region success", "green");
                    $state.go('configure');
                } else {
                    // 提示创建失败
                    //$rootScope.promptBox('Fail', 'new region Fail', function() {
                    //    return $state.go('configure');
                    //});
                    dialogsManager.showMessage("new region Fail", "red");
                }
            })
        }
    })

    /**
     * 区域设置
     */
    .controller('RegionalSettingCtrl', function ($scope, $state, $rootScope, $stateParams, $ionicPopup, Device, dialogsManager) {
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Regional Setting'); // 调用原生提供的修改标题方法。
            }
        }

        window.url = "";

        var regionId = $stateParams.regionId; // 获取设备id
        var regionAddr = $stateParams.regionAddr; // 获取区域地址
        var gatewayId = $stateParams.gatewayId; // 获取网关id
        // 获取设备列表
        Device.all(regionId, gatewayId).then(function (data) {
            $scope.lights = data;
            console.log('Device.all', data);
        });

        // 删除设备提示
        // $scope.lights.isAdd = true;

        // 删除设备
        $scope.remove = function (light) { // todo 需要测试
            $rootScope.showConfirm('Remove equipment', 'Whether you want to delete this device?', function () {
                console.log('yes, removeLight', light);
                Device.removeLight(light, regionId, gatewayId).then(function (data) {
                    // 删除本地设备列表中的设备
                    if (data) {
                        if (typeof($scope.lights) == 'object') {
                            // 删除成功后删除scope下的该设备信息
                            delete($scope.lights[light]); // todo 需要结合到Device服务中操作
                            $scope.lights.splice($scope.lights.indexOf(light), 1);
                            console.log('删除成功后的设备列表', $sdcope.lights);
                            //$rootScope.promptBox('Success', 'Delete Device Success');
                            dialogsManager.showMessage("Delete Device Success", "green");
                        }
                    } else {
                        // 删除失败
                        //$rootScope.promptBox('Fail', 'Delete Device Fail');
                        dialogsManager.showMessage("Delete Device Fail", "red");
                    }
                })
            });
        }


        // 去创建设备
        $scope.toAddDevice = function () {
            $state.go('add-device', {type: 'region', id: regionId, gateway: gatewayId});
        }

        // 去组设置
        $scope.toSetGroup = function () {
            $state.go('set-group', {regionId: regionId, gatewayId: gatewayId});
        }
        // 去场景设置
        $scope.toSetScene = function () {
            $state.go('set-scene', {regionId: regionId, gatewayId: gatewayId});
        }
        // 去条件控制设置
        $scope.toSetTerm = function () {
            $state.go('set-term', {regionId: regionId, gatewayId: gatewayId, regionAddr: regionAddr});
        }
        // 去配方设置
        $scope.toSetRecipe = function () {
            $state.go('set-recipe', {regionId: regionId, gatewayId: gatewayId});
        }
    })

    /**
     * 组设置
     */
    .controller('GroupSettingCtrl', function ($scope, $state, $stateParams, $rootScope, RegionGroups) {
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Regional Group'); // 调用原生提供的修改标题方法。
            }
        }

        window.url = "/regional?regionId=" + $rootScope.regionId + "&gatewayId=" + $rootScope.gatewayId + "&regionAddr=" + $rootScope.regionAddr;

        var regionId = $stateParams.regionId; // 获取区域Id
        // 获取指定区域下的组列表
        RegionGroups.getList(regionId).then(function (data) {
            $scope.groupList = data;
        });
        // 去 组详情设置页面
        $scope.toGroupSetDetail = function (group) {
            $rootScope.group = group;

            $state.go('group-set-detail', {
                // region_guid:      group.region_guid,
                // table_group_guid: group.table_group_guid,
                // gateway_id:       group.gateway_id,
                // group_name:       group.group_name
            });
        }
        // 去 新建组页面
        $scope.toAddGroup = function () {
            $state.go('new-group', {regionId: regionId});
        }
    })

    /**
     * 新建组
     */
    .controller('NewGroupCtrl', function ($scope, $state, $rootScope, $stateParams, DeviceGroups, RegionGroups, Users, dialogsManager) {
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('New Regional Group'); // 调用原生提供的修改标题方法。
            }
        }

        var regionId = $stateParams.regionId; // 获取区域Id
        // my 用于页面与服务间的值传递
        $scope.my = {
            groupName: ""
        }
        // 获取网关列表
        Users.getGateway().then(function (data) {
            $scope.gateways = data;
            $scope.my.gateway = data[0]
        })
        // 新建组
        $scope.newGroup = function () {
            // 在设备下添加该组信息
            DeviceGroups.add($scope.my).then(function (data) {
                data[0].regionId = regionId;
                // 将添加后的组添加到区域中
                RegionGroups.add(data[0]).then(function (data) {
                    if (data) {
                        //$rootScope.promptBox('success', 'Add Group Success', function() {
                        //    $state.go('set-group', {regionId: regionId});
                        //})
                        dialogsManager.showMessage("Add Group Success", "green");
                        $state.go('set-group', {regionId: regionId});
                    } else {
                        dialogsManager.showMessage("Add Group Fail", "red");
                    }
                });
            })
        }
        window.url = "/group?regionId=" + regionId;
    })

    /**
     * 设置组详情
     */
    .controller('groupSetDetailCtrl', function ($scope, $state, $rootScope, $stateParams, Device, RegionGroups, dialogsManager) {
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Regional Group Setting'); // 调用原生提供的修改标题方法。
            }
        }

        // console.log('$rootScope.group', $rootScope.group);
        var region_guid = $rootScope.group.region_guid; // 获取区域Id
        var table_group_guid = $rootScope.group.table_group_guid; // 获取组Id
        var gateway_id = $rootScope.group.gateway_id; // 获取网关Id

        window.url = "/group?regionId=" + region_guid;

        $scope.group_name = $rootScope.group.group_name; // 获取组名

        //删除区域组
        $scope.deleteRegionGroup = function () {
            $rootScope.showConfirm('Confirm Delete', 'Whether you want to delete this group?', function () {
                var param = [{
                    region_guid: region_guid,
                    table_group_guid: table_group_guid,
                    gateway_id: gateway_id
                }];
                // todo console.log(param);

                //删除区域下的组
                RegionGroups.delete(param).then(function (data) {
                    if (data) {
                        //$rootScope.promptBox('Success', 'Delete Group Success', function() {
                        //    $state.go('set-group', {regionId: region_guid});
                        //})
                        dialogsManager.showMessage("Delete Group Success", "green");
                        $state.go('set-group', {regionId: region_guid});
                    } else {
                        //$rootScope.promptBox('Fail', 'Delete Group Fail', function(){})
                        dialogsManager.showMessage("Delete Group Fail", "red");
                    }
                })
            });
        }

        //查找组成员
        RegionGroups.getDevice(table_group_guid,gateway_id).then(function (data) {
            $scope.deviceList = data
        })

        $scope.toAddDevice = function () {
            $state.go('add-group-device', {
                regionId: region_guid,
                gateway: gateway_id
            });
        }


        // 删除设备
        $scope.remove = function (light) { // todo 需要测试
            $rootScope.showConfirm('Remove', 'Whether you want to delete this device?', function () {
                // console.log('yes, removeLight', light);
                RegionGroups.delDevice(light.table_group_guid, light.device_guid).then(function (data) {
                    // 删除本地设备列表中的设备
                    if (data) {
                        if (typeof($scope.deviceList) == 'object') {
                            // 删除成功后删除scope下的该设备信息
                            delete($scope.deviceList[light]); // todo 需要结合到Device服务中操作
                            $scope.deviceList.splice($scope.deviceList.indexOf(light), 1);
                            console.log('删除成功后的设备列表', $scope.deviceList);
                            //$rootScope.promptBox('Success', 'Delete Device Success');
                            dialogsManager.showMessage("Delete Device Success", "green");
                        }
                    } else {
                        // 删除失败
                        //$rootScope.promptBox('Fail', 'Delete Device Fail');
                        dialogsManager.showMessage("Delete Device Fail", "red");
                    }
                })
            });
        }
    })

    /**
     * 场景设置
     */
    .controller('SceneSettingCtrl', function ($scope, $state, $stateParams, $rootScope, Scene) {
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Regional Scene'); // 调用原生提供的修改标题方法。
            }
        }

        var regionId = $stateParams.regionId; // 获取区域Id
        var gatewayId = $stateParams.gatewayId || $rootScope.gatewayId; // 获取区域Id
        $rootScope.gatewayId = gatewayId;

        window.url = "/regional?regionId=" + $rootScope.regionId + "&gatewayId=" + $rootScope.gatewayId + "&regionAddr=" + $rootScope.regionAddr;

        // 获取指定区域下的组列表
        Scene.getList(regionId, gatewayId).then(function (data) {
            $scope.sceneList = data;
        });
        // 去 组详情设置页面
        $scope.toSceneSetDetail = function (scene) {
            $rootScope.scene = scene;

            $state.go('scene-set-detail', {});
        }
        // 去 新建组页面
        $scope.toAddScene = function () {
            $state.go('new-scene', {regionId: regionId});
        }
    })
    /**
     * 创建场景
     */
    .controller('NewSceneCtrl', function ($scope, $state, $rootScope, $stateParams, DeviceScenes, Scene, Users, dialogsManager) {
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('New Regional Scene'); // 调用原生提供的修改标题方法。
            }
        }

        var regionId = $stateParams.regionId; // 获取区域Id
        // my 用于页面与服务间的值传递
        $scope.my = {
            sceneName: "",
        }
        // 获取网关列表
        Users.getGateway().then(function (data) {
            $scope.gateways = data;
            $scope.my.gateway = data[0]
        })
        // 新建组
        $scope.newScene = function () {
            // 在设备下添加该组信息
            DeviceScenes.add($scope.my).then(function (data) {
                data[0].regionId = regionId;
                // 将添加后的组添加到区域中
                Scene.add(data[0]).then(function (data) {
                    if (data) {
                        //$rootScope.promptBox('success', 'Add Scene Success', function() {
                        //    $state.go('set-scene', {regionId: regionId});
                        //})
                        dialogsManager.showMessage("Add Scene Success", "green");
                        $state.go('set-scene', {regionId: regionId});
                    } else {
                        dialogsManager.showMessage("Add Scene Fail", "red");
                    }
                });
            })
        }
        window.url = "/scene?regionId=" + regionId;
    })
    /**
     * 场景设置详情
     */
    .controller('SceneSettingDetailCtrl', function ($scope, $state, $rootScope, $stateParams, Scene, dialogsManager) {
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Regional Scene Setting'); // 调用原生提供的修改标题方法。
            }
        }

        var region_guid = $rootScope.scene.region_guid; // 获取区域Id
        var table_scene_guid = $rootScope.scene.table_scene_guid; // 获取组Id
        var gateway_id = $rootScope.scene.gateway_id; // 获取网关Id
        $scope.scene_name = $rootScope.scene.scene_name; // 获取组名

        window.url = "/scene?regionId=" + region_guid + "&gatewayId=" + gateway_id;

        //删除区域组
        $scope.deleteRegionScene = function () {
            $rootScope.showConfirm('Confirm Delete', 'Whether you want to delete this scene?', function () {
                var param = [{
                    region_guid: region_guid,
                    table_scene_guid: table_scene_guid,
                    gateway_id: gateway_id
                }];

                //删除区域下的组
                Scene.delete(param).then(function (data) {
                    if (data) {
                        //$rootScope.promptBox('Success', 'Delete Scene Success', function() {
                        //    $state.go('set-scene', {
                        //        regionId: region_guid,
                        //        gatewayId: gateway_id
                        //    });
                        //})
                        dialogsManager.showMessage("Delete Scene Success", "green");
                        $state.go('set-scene', {
                            regionId: region_guid,
                            gatewayId: gateway_id
                        });
                    } else {
                        //$rootScope.promptBox('Fail', 'Delete Scene Fail', function(){})
                        dialogsManager.showMessage("Delete Scene Fail", "red");
                    }
                })
            });
        }

        //查找组成员
        Scene.getDevice(table_scene_guid, gateway_id).then(function (data) {
            $scope.deviceList = data
        })
        // 去添加设备
        $scope.toAddDevice = function () {
            $state.go('add-scene-device', {
                regionId: region_guid,
                gateway: gateway_id
            });
        }


        // 删除设备
        $scope.remove = function (light) { // todo 需要测试
            $rootScope.showConfirm('Remove', 'Whether you want to delete this device?', function () {
                // console.log('yes, removeLight', light);
                Scene.delDevice(light.table_scene_guid, light.device_guid).then(function (data) {
                    // 删除本地设备列表中的设备
                    if (data) {
                        if (typeof($scope.deviceList) == 'object') {
                            // 删除成功后删除scope下的该设备信息
                            delete($scope.deviceList[light]); // todo 需要结合到Device服务中操作
                            $scope.deviceList.splice($scope.deviceList.indexOf(light), 1);
                            console.log('删除成功后的设备列表', $scope.deviceList);
                            //$rootScope.promptBox('Success', 'Delete Device Success');
                            dialogsManager.showMessage("Delete Device Success", "green");
                        }
                    } else {
                        // 删除失败
                        //$rootScope.promptBox('Fail', 'Delete Device Fail');
                        dialogsManager.showMessage("Delete Device Fail", "red");
                    }
                })
            });
        }
    })

    /**
     * 条件控制
     */
    .controller('TermSettingCtrl', function ($scope, $state, $stateParams, $rootScope, Term) {
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Regional Term'); // 调用原生提供的修改标题方法。
            }
        }

        var regionId = $stateParams.regionId; // 获取区域Id
        var regionAddr = $stateParams.regionAddr; // 获取区域地址
        var gatewayId = $stateParams.gatewayId || $rootScope.gatewayId; // 获取区域Id

        window.url = "/regional?regionId=" + regionId + "&gatewayId=" + gatewayId + "&regionAddr=" + gatewayId;

        // 查询配方信息
        Term.getList().then(function (data) {
            $scope.termList = data;
        })
        // 去条件控制详情
        $scope.toSetTermDetail = function (term) {
            $rootScope.term = term;
            $state.go('set-term-detail', {regionId: regionId, gatewayId: gatewayId, regionAddr: regionAddr})
        }
        $scope.toAddTerm = function () {
            $state.go('new-term', {regionId: regionId, gatewayId: gatewayId});
        }
    })
    /**
     * 创建条件控制
     */
    .controller('NewTermCtrl', function ($scope, $state, $rootScope, $stateParams, Term, Users, dialogsManager) {
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('New Regional Term'); // 调用原生提供的修改标题方法。
            }
        }

        var regionId = $stateParams.regionId; // 获取区域Id
        var gatewayId = $stateParams.gatewayId || $rootScope.gatewayId; // 获取区域Id
        // my 用于页面与服务间的值传递
        $scope.my = {
            termName: ""
        }
        // 获取网关列表
        Users.getGateway().then(function (data) {
            $scope.gateways = data;
            $scope.my.gateway = data[0]
        })
        // 新建组
        $scope.newTerm = function () {
            // 添加条件控制
            Term.add($scope.my.gateway.gateway_id, $scope.my.termName).then(function (data) {
                if (data) {
                    //$rootScope.promptBox('success', 'Add Term Success', function() {
                    //    $state.go('set-term', {regionId: regionId, gatewayId: gatewayId});
                    //})
                    dialogsManager.showMessage("Add Term Success", "green");
                    $state.go('set-term', {regionId: regionId, gatewayId: gatewayId});
                } else {
                    //$rootScope.promptBox('Fail', 'Add Term Fail', function() {
                    //    $state.go('set-term', {regionId: regionId, gatewayId: gatewayId});
                    //})
                    dialogsManager.showMessage("Add Term Fail", "red");
                }
            });
        }
        window.url = "/term?regionId=" + $rootScope.regionId + "&gatewayId=" + $rootScope.gatewayId + "&regionAddr=" + $rootScope.regionAddr;

    })

    /**
     * 条件控制详情
     */
    .controller('TermSettingDetailCtrl', function ($scope, $state, $rootScope, $stateParams, Term) {
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Regional Term Setting'); // 调用原生提供的修改标题方法。
            }
        }

        var regionId = $stateParams.regionId; // 获取区域Id
        var regionAddr = $stateParams.regionAddr; // 获取区域地址
        var gatewayId = $stateParams.gatewayId || $rootScope.gatewayId; // 获取区域Id
        var term = $rootScope.term;

        window.url = "/term?regionId=" + regionId + "&gatewayId=" + gatewayId + "&regionAddr=" + regionAddr;

        if (term) {
            $scope.ruleList = term.conditions || [];
            $scope.actionList = term.ctrl_sequence || [];
        }
        // 去添加条件
        $scope.toAddRule = function () {
            $state.go('add-term-rule', {regionId: regionId, gatewayId: gatewayId});
        }
        // 去添加序列
        $scope.toAddAction = function () {
            $state.go('add-term-action', {regionId: regionId, gatewayId: gatewayId, regionAddr: regionAddr});
        }
        // 去序列详情
        $scope.toActionDetail = function (action) {
            $rootScope.actionDetail = action;
            console.log('action', action);
            $state.go('add-term-sequence-detail', {regionId: regionId, gatewayId: gatewayId});
        }
    })

    /**
     * 条件控制动作详情
     */
    .controller('AddTermSequenceDetailCtrl', function ($scope, $state, $rootScope, Term) {
        $scope.actionDetail = $rootScope.actionDetail;
    })

    /**
     * 条件控制 - 添加条件
     */
    .controller('AddTermRuleCtrl', function ($scope, $state, $stateParams, $rootScope, Device, Term, dialogsManager) {
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Add New Term Rule'); // 调用原生提供的修改标题方法。
            }
        }
        var regionId = $stateParams.regionId; // 获取区域Id
        var gatewayId = $stateParams.gatewayId || $rootScope.gatewayId; // 获取区域Id

        window.url = "/term/detail?regionId=" + regionId + "&gatewayId=" + gatewayId + "&regionAddr=" + $rootScope.regionAddr;

        $scope.my = {}
        Device.all(regionId, gatewayId).then(function (data) {
            console.log(data);
            $scope.deviceList = data;
            $scope.my.device = data[0];
            $scope.channelList = data[0].channel;
            // console.log( $scope.channelList);
            $scope.my.channel = $scope.channelList[0];

            // 监听设备变化，通道也跟着变化。
            $scope.deviceChange = function () {
                if ($scope.my.device && $scope.my.device.channel) {
                    $scope.channelList = $scope.my.device.channel;
                } else {
                    $scope.my.channelList = [];
                }
            }
        })

        $scope.addRule = function () {
            var term = $rootScope.term;

            var param = {
                table_conditons: [{
                    cdts_list_guid: term.cdts_list_guid,
                    gateway_id: $scope.my.channel.gateway_id,
                    table_device_guid: $scope.my.channel.table_device_guid,
                    channel_class: $scope.my.channel.channel_class,
                    channel_type: $scope.my.channel.channel_type,
                    channel_bit_num: $scope.my.channel.channel_bit_num,
                    compare_val: $scope.my.putVaule,
                    offset_val: '0'
                }]
            }
            Term.addRule(param).then(function (data) {
                if (data) {
                    //$rootScope.promptBox('success', 'Add Rule Success', function() {
                    //    $state.go('set-term-detail', {regionId: regionId, gatewayId: gatewayId});
                    //})
                    dialogsManager.showMessage("Add Rule Success", "green");
                    $state.go('set-term-detail', {regionId: regionId, gatewayId: gatewayId});
                } else {
                    //$rootScope.promptBox('success', 'Add Rule Success', function() {
                    //    $state.go('set-term-detail', {regionId: regionId, gatewayId: gatewayId});
                    //})
                    dialogsManager.showMessage("Add Rule Fail", "red");
                }
            });
        }
    })
    /**
     * 条件控制 - 添加动作
     */
    .controller('AddTermActionCtrl', function ($scope, $state, $rootScope, $stateParams, Device, Term, RegionGroups, Regional, Scene) {
        var regionId = $stateParams.regionId; // 获取区域Id
        var regionAddr = $stateParams.regionAddr; // 获取区域地址
        var gatewayId = $stateParams.gatewayId || $rootScope.gatewayId; // 获取区域Id

        window.url = "/term/detail?regionId=" + regionId + "&gatewayId=" + gatewayId + "&regionAddr=" + regionAddr;

        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Add New Term Action'); // 调用原生提供的修改标题方法。
            }
        }

        $scope.typeList = [
            {
                name: 'Region',
                key: 'region',
                targetList: [
                    {
                        name: 'Channel',
                        key: 'channel'
                    },
                    {
                        name: 'Switch',
                        key: 'switch'
                    }
                ]
            },
            {
                name: 'Group',
                key: 'group',
                targetList: [
                    {
                        name: 'Channel',
                        key: 'channel'
                    },
                    {
                        name: 'Switch',
                        key: 'switch'
                    }
                ]
            },
            {
                name: 'Scene',
                key: 'scene',
                targetList: [
                    {
                        name: 'Switch',
                        key: 'switch'
                    }
                ]
            },
            {
                name: 'Device',
                key: 'device',
                targetList: [
                    {
                        name: 'Channel',
                        key: 'channel'
                    },
                    {
                        name: 'Switch',
                        key: 'switch'
                    }
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
        $scope.my.objList = [{name: regionId}]; // 操作对象列表，默认显示区域
        $scope.my.obj = $scope.my.objList[0]; // 选择的操作对象，默认为区域id

        Regional.getChannel(regionId, gatewayId).then(function (data) {
            $scope.my.channelList = data;
            $scope.my.channel = data[0]; // 通道动作
        });

        // 改变类型是改变对象值与通道值
        $scope.typeChange = function () {
            switch ($scope.my.type.key) {
                case 'region' :
                    $scope.my.objList = [{name: regionId}];
                    $scope.my.obj = $scope.my.objList[0];
                    // 刷新区域下的通道
                    Regional.getChannel(regionId, gatewayId).then(function (data) {
                        $scope.my.channelList = data;
                        $scope.my.channel = data[0];
                    });
                    break;

                case 'device' :
                    Device.all(regionId, gatewayId).then(function (data) {
                        $scope.my.objList = data; //查询device
                        $scope.my.obj = $scope.my.objList[0];
                        $scope.my.channelList = data[0].channel;
                        $scope.my.channel = data[0].channel[0];
                        $scope.my.channel.channel_number = $scope.my.channel.channel_bit_num; // 目前没有 channel_number，用channel.channel_bit_num代替，为了统一字段，这里重新赋值
                    });
                    break;

                case 'group' :
                    RegionGroups.getList(regionId).then(function (data) {
                        $scope.my.objList = data; //查询device
                        $scope.my.obj = $scope.my.objList[0];
                    })
                    break;

                case 'scene' :
                    Scene.getList(regionId, gatewayId).then(function (data) {
                        $scope.my.objList = data; //查询device
                        $scope.my.obj = $scope.my.objList[0];
                    })
                    break;
            }

            $scope.my.target = $scope.my.type.targetList[0]; // 控制目标切换为type对应的目标
        }
        // 添加动作
        $scope.addAction = function () {
            var action = {
                type_name: $scope.my.type.name,
                region_name: $scope.my.obj.name,
                device_name: $scope.my.obj.device_name,
                group_name: $scope.my.obj.group_name,
                scene_name: $scope.my.obj.scene_name,
                group_id: $scope.my.obj.table_device_guid || $scope.my.obj.table_group_guid || $scope.my.obj.region_scene_guid || regionId,
                address: $scope.my.obj.group_addr || $scope.my.obj.device_addr || $scope.my.obj.scene_addr || regionAddr,
                gateway_id: $scope.my.obj.gateway_id || gatewayId,
                channel_number: $scope.my.channel.channel_number,
                channel_value: $scope.my.channelValue,
                switchValue: $scope.my.switchValue,
                target: $scope.my.target.key
            }
            $scope.my.sequenceList.push(action)
            console.log(action);
        }
        // 添加序列
        $scope.addSequence = function () {
            var term = $rootScope.term;
            var ctrl_sqn_guid = '先创建序列，得到序列id后添加动作'; // /device/term/sequence
            // var ctrl_sqn_guid = term.ctrl_sequence && ctrl_sequence.length > 1? ctrl_sequence.length + 1 : 1;
            // var sequence = {};
            var sequenceParam = [];
            for (var i = 0; i < $scope.my.sequenceList.length; i++) {
                var sequence = {
                    ctrl_sqn_guid: ctrl_sqn_guid,
                    main_table_name: "table_device", // 根据区域，组，场景切换
                    dcgs_guid: $scope.my.sequenceList[i].group_id,
                    gateway_id: $scope.my.sequenceList[i].gateway_id,
                    m_address: $scope.my.sequenceList[i].address,
                    channel_bit_num: $scope.my.sequenceList[i].channel_number,
                    m_value: $scope.my.sequenceList[i].channelValue,
                    m_switch: $scope.my.sequenceList[i].switchValue,
                    m_delay: "1"
                }
                sequenceParam.push(sequence);
            }


            console.log(sequenceParam);
        }
    })
    // /**
    //  * 配方 - 添加条件控制
    //  */
    // .controller('AddTermRuleCtrl', function($scope, $state) {

    // })
    // /**
    //  * 配方 - 添加动作
    //  */
    // .controller('AddTermActionCtrl', function($scope, $state) {

    // })

    /**
     * 配方
     */
    .controller('RecipeSettingCtrl', function ($scope, $state) {
        $scope.toAddTerm = function () {
            $state.go('add-recipe-term');
        }
        $scope.toAddAction = function () {
            $state.go('add-recipe-action');
        }
    })
    /**
     * 配方 - 添加条件控制
     */
    .controller('AddRecipeTermCtrl', function ($scope, $state) {

    })
    /**
     * 配方 - 添加动作
     */
    .controller('AddRecipeActionCtrl', function ($scope, $state) {

    })



    /**
     * 对区域添加设备
     */
    .controller('AddDeviceCtrl', function ($scope, $state, $stateParams, $rootScope, Device, dialogsManager) {
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Add Regional Device'); // 调用原生提供的修改标题方法。
            }
        }

        var gateway = $stateParams.gateway;

        // 获取设备列表信息
        Device.getHttpNewLights().then(function (data) {
            // 获取服务中的设备信息
            $scope.lights = data;
            console.log(data);
        });

        // 添加或删除按钮点击切换动作
        $scope.AddOrDel = function (lightId) {
            if (!lightId) {
                console.log('设备Id为空');
                return;
            }
            var regional = $rootScope.regional;

            Device.setLightAdd(lightId, regional)
        }

        // 对区域添加设备
        $scope.apply = function () {
            Device.addLightByRegional(gateway).then(function (data) {
                if (data) {
                    // 提示添加成功
                    //$rootScope.promptBox('Success', 'Add Device Success', function() {
                    //    return $state.go('configure');
                    //});
                    dialogsManager.showMessage("Add Device Success", "green");
                    $state.go('set-regional', {regionId: $rootScope.regionId, gatewayId: $rootScope.gatewayId, regionAddr: $rootScope.regionAddr});
                } else {
                    //$rootScope.promptBox('Fail', 'Add Device Fail',function() {
                    //    return $state.go('configure');
                    //});
                    dialogsManager.showMessage("Add Device Fail", "red");
                }
            })
            Device.clear();
        }

        window.url = "/regional?regionId=" + $rootScope.regionId + "&gatewayId=" + $rootScope.gatewayId + "&regionAddr=" + $rootScope.regionAddr;
    })

    /**
     * 对组添加设备
     */

    .controller('AddGroupDeviceCtrl', function ($scope, $state, $stateParams, $rootScope, Device, dialogsManager) {
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Add New Group Member'); // 调用原生提供的修改标题方法。
            }
        }


        var regionId = $stateParams.regionId;
        var gateway = $stateParams.gateway;

        // 获取设备列表信息
        Device.getHttpNewLights().then(function (data) {
            // 获取服务中的设备信息
            $scope.lights = data;
            console.log(data);
        });

        // 添加或删除按钮点击切换动作
        $scope.AddOrDel = function (lightId) {
            if (!lightId) {
                console.log('设备Id为空');
                return;
            }
            var group = $rootScope.group;

            Device.setAddGroupDevice(lightId, group)
        }

        // 对区域添加设备
        $scope.apply = function () {
            Device.addLightByGroup(gateway).then(function (data) {
                if (data) {
                    // 提示添加成功
                    //$rootScope.promptBox('Success', 'Add Device Success', function() {
                    //    return $state.go('group-set-detail', {regionId: regionId});
                    //});
                    dialogsManager.showMessage("Add Device Success", "green");
                    $state.go('group-set-detail', {regionId: regionId});
                } else {
                    //$rootScope.promptBox('Fail', 'Add Device Fail',function() {
                    //    return $state.go('group-set-detail', {regionId: regionId});
                    //});
                    dialogsManager.showMessage("Add Device Fail", "red");
                }
            })
            Device.clear();
        }

        window.url = "/setgroup/detail?regionId=" + regionId + "&gatewayId=" + gateway;
    })

    /**
     * 对场景添加设备
     */
    .controller('AddSceneDeviceCtrl', function ($scope, $state, $stateParams, $rootScope, Device, dialogsManager) {
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Add New Scene Member'); // 调用原生提供的修改标题方法。
            }
        }

        var regionId = $stateParams.regionId;
        var gateway = $stateParams.gateway;
        $scope.my = {};

        // 获取设备列表信息
        Device.getHttpNewLights().then(function (data) {
            // 获取服务中的设备信息
            $scope.lights = data;
            console.log(data);
        });

        $scope.$watch('lights', function () {
            console.log('23ddsadsadasd');
        })

        // 添加或删除按钮点击切换动作
        $scope.AddOrDel = function (lightId, lightIndex) {
            console.log('lightIndex', $scope.lights[lightIndex]);
            if (!lightId) {
                console.log('设备Id为空');
                return;
            }
            // 判断默认值是否合法
            if (!$scope.lights[lightIndex].deviceValue || $scope.lights[lightIndex].deviceValue == '' || isNaN(parseInt($scope.lights[lightIndex].deviceValue)) ||
                parseInt($scope.lights[lightIndex].deviceValue) < 0 || parseInt($scope.lights[lightIndex].deviceValue) > 255) {

                $scope.lights[lightIndex].deviceMessage = true;
                // todo 需要加入当值变化时，判断是否符合标准，来修改添加状态
                return;
            } else {
                $scope.lights[lightIndex].deviceMessage = false;
            }

            var scene = $rootScope.scene;
            // 添加设备
            Device.setAddSceneDevice(lightId, scene, $scope.lights[lightIndex].deviceValue).then(function (data) {
                console.log('添加设备todo', data);
            })
        }

        // 对区域添加设备
        $scope.apply = function () {
            Device.addLightByScene(gateway).then(function (data) {
                if (data) {
                    // 提示添加成功
                    //$rootScope.promptBox('Success', 'Add Device Success', function() {
                    //    return $state.go('scene-set-detail', {regionId: regionId});
                    //});
                    dialogsManager.showMessage("Add Device Success", "green");
                    $state.go('scene-set-detail', {regionId: regionId});
                } else {
                    //$rootScope.promptBox('Fail', 'Add Device Fail',function() {
                    //    return $state.go('scene-set-detail', {regionId: regionId});
                    //});
                    dialogsManager.showMessage("Add Device Fail", "red");}
            })
            Device.clear();
        }

        window.url = "/scene/detail?regionId=" + regionId;

    })