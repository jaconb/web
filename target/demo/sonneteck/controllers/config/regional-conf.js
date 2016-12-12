angular.module('sntApp').controller('regionalConfCtrl', function($scope, $state, AuthService, $rootScope, $uibModal, $log,toaster,POPTIMEOUT,$cookieStore) {
    
    // 获取区域列表
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';
    var token = $cookieStore.get('token');

    $scope.currentRegion = '';
    //获取用户下的区域
    $scope.regionProm = AuthService.myHttp(token,{},'GET','region').then(function (data) {
        if(data.code == '0' && data.content){
            $scope.RegionData = data.content;
            $scope.RegionName = $scope.RegionData[0].region_name;
            $scope.currentRegion = $scope.RegionData[0];
            // 查找区域下的设备:默认查找第一个区域的设备数据
            var token = $cookieStore.get('token');
            var findRegionDevice = {
                region_guid : $scope.RegionData[0].region_guid,
                gateway_id : $scope.RegionData[0].gateway_id
            };
            $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice,'GET','region/device').then(function (data) {
                if(data.code == '0' && data.content){
                    $scope.regionDeviceInfo = data.content;
                }else {
                    $scope.regionDeviceInfo = [];
                }
            })
            // 查询区域组
            $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice, 'GET', 'region/group').then(function(data){
                if(data.code == '0' && data.content){
                    $scope.regionGroupInfo = data.content;
                }else {
                    $scope.regionGroupInfo = [];
                }
            });
            //查询区域场景
            $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice, 'GET', 'region/scene').then(function (data) {
                if(data.code == '0' && data.content){
                    $scope.regionSceneInfo = data.content;
                }else {
                    $scope.regionSceneInfo = [];
                }
            });
            //查询区域配方
            var queryRegionRecipe = {
                'region_guid' : $scope.RegionData[0].region_guid
            }
            $scope.RegionDeviceProm = AuthService.myHttp(token,queryRegionRecipe,'GET','recipe/regionRecipe').then(function (result) {
                if(result.content){
                    $scope.RegionRecipeList = [];
                    for(var i = 0 ; i < result.content.length; i++){
                        $scope.RegionRecipeList[i] = {};
                        $scope.RegionRecipeList[i].period = ""+(result.content[i].days).length;
                        $scope.RegionRecipeList[i].name = result.content[i].name;
                        $scope.RegionRecipeList[i].private_recipe_id = result.content[i].private_recipe_id;
                        $scope.RegionRecipeList[i].seq = result.content[i].seq;
                        $scope.RegionRecipeList[i].start_time = result.content[i].start_time;
                        $scope.RegionRecipeList[i].status = result.content[i].status;
                    }
                }else {
                    $scope.RegionRecipeList = [];
                }
            });
        }else {
            toaster.pop({type: 'error', title: 'Error', body: data.message, timeout: POPTIMEOUT});
        }
    })
    
    //选择设置的区域
    $scope.setRegion = function (region) {
        $scope.RegionName = region.region_name;
        $scope.currentRegion = region;
        // 查找区域下的设备
        var token = $cookieStore.get('token');
        var findRegionDevice = {
            region_guid : region.region_guid,
            gateway_id : region.gateway_id
        };
        $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice,'GET','region/device').then(function (data) {
            if(data.code == '0' && data.content){
                $scope.regionDeviceInfo = data.content;
            }else {
                $scope.regionDeviceInfo = [];
            }
        })
        // 查询区域组
        $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice, 'GET', 'region/group').then(function(data){
            if(data.code == '0' && data.content){
                $scope.regionGroupInfo = data.content;
            }else {
                $scope.regionGroupInfo = [];
            }
        });
        //查询区域场景
        $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice, 'GET', 'region/scene').then(function (data) {
            if(data.code == '0' && data.content){
                $scope.regionSceneInfo = data.content;
            }else {
                $scope.regionSceneInfo = [];
            }
        });
        //查询区域配方
        var queryRegionRecipe = {
            'region_guid' : region.region_guid
        }
        $scope.RegionDeviceProm = AuthService.myHttp(token,queryRegionRecipe,'GET','recipe/regionRecipe').then(function (result) {
            if(result.content){
                $scope.RegionRecipeList = [];
                for(var i = 0 ; i < result.content.length; i++){
                    $scope.RegionRecipeList[i] = {};
                    $scope.RegionRecipeList[i].period = ""+(result.content[i].days).length;
                    $scope.RegionRecipeList[i].name = result.content[i].name;
                    $scope.RegionRecipeList[i].private_recipe_id = result.content[i].private_recipe_id;
                    $scope.RegionRecipeList[i].seq = result.content[i].seq;
                    $scope.RegionRecipeList[i].start_time = result.content[i].start_time;
                    $scope.RegionRecipeList[i].status = result.content[i].status;
                }
            }else {
                $scope.RegionRecipeList = [];
            }
        });
    }

    $scope.animationsEnabled = true;

    /**
     * 弹窗
     */
    //新建区域弹窗
    $scope.newRegion = function (size) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'newRegion.html',
            controller: 'NewRegionModalCtrl',
            size: size
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    }
    //删除区域弹窗
    $scope.removeRegion = function (region) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'deleteRegionModal.html',
            controller: 'DeleteRegionModalCtrl',
            backdrop: 'static',//空白处点击失效
            keyboard: false,//ESC键失效
            resolve: {
                region: function () {
                    return region;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    }
    //修改区域名称弹窗
    $scope.renameRegion = function (region) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'renameRegion.html',
                controller: 'RenameRegionModalCtrl',
                resolve: {
                    Region: function () {
                        return region;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
            });
        };
    //删除区域组弹窗
    $scope.deleteRegionGroup = function (regionGroup) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'deleteGroupConfirm.html',
                controller: 'DeleteGroupModalCtrl',
                backdrop: 'static',//空白处点击失效
                keyboard: false,//ESC键失效
                resolve: {
                    regionGroup: function () {
                        return regionGroup;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
            });
        };
    //区域组重命名弹窗
    $scope.renameGroup = function (regionGroup) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'renameGroup.html',
            controller: 'RenameGroupModalCtrl',
            resolve: {
                regionGroup: function () {
                    return regionGroup;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    }
    //区域组详情弹窗
    $scope.groupDetail = function (size, regionGroup) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'regionalConfigGroup.html',
            controller: 'GroupConfigDetailModalCtrl',
            size: size,
            resolve: {
                regionGroup: function () {
                    return regionGroup;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };
    //删除区域场景弹窗
    $scope.deleteRegionScene = function (RegionScene) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'deleteSceneConfirm.html',
                controller: 'DeleteSceneModalCtrl',
                backdrop: 'static',//空白处点击失效
                keyboard: false,//ESC键失效
                resolve: {
                    RegionScene: function () {
                        return RegionScene;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
            });
        };
    //区域场景重命名弹窗
    $scope.renameScene = function (RegionScene) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'renameScene.html',
            controller: 'RenameSceneModalCtrl',
            resolve: {
                RegionScene: function () {
                    return RegionScene;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };
    //区域场景详情弹窗
    $scope.openSceneDetail = function (size,RegionScene) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'regionalConfigScene.html',
            controller: 'SceneConfigDetailModalCtrl',
            size: size,
            resolve: {
                RegionScene: function () {
                    return RegionScene;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };
    //添加区域设备弹窗
    $scope.addDevice = function (size) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'addRegionDevice.html',
            controller: 'AddRegionDeviceCtrl',
            size: size,
            resolve: {
                Region: function () {
                    return $scope.currentRegion;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };
    //删除区域设备弹窗
    $scope.deleteRegionDevice = function (regionDevice) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'deleteRegionDeviceModal.html',
            controller: 'DeleteRegionDeviceModalCtrl',
            resolve: {
                regionDevice: function () {
                    return regionDevice;
                },
                Region: function () {
                    return $scope.currentRegion;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
            }, function () {
        });
    };
    //新建区域组弹窗
    $scope.newGroup = function (size) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'newGroup.html',
            controller: 'NewGroupModalCtrl',
            size: size,
            resolve: {
                Region: function () {
                    return $scope.currentRegion;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };
    //添加组成员弹窗
    $scope.groupAddDevice = function (size,regionGroup) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'addGroupDevice.html',
            controller: 'AddGroupDeviceCtrl',
            size: size,
            resolve: {
                regionGroup: function () {
                    return regionGroup;
                },
                Region: function () {
                    return $scope.currentRegion;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    }
    //新建区域场景弹窗
    $scope.newScene = function (size) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'newScene.html',
            controller: 'NewSceneModalCtrl',
            size: size,
            resolve: {
                Region: function () {
                    return $scope.currentRegion;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    }
    //添加场景成员弹窗
    $scope.sceneAddDevice = function (size,RegionScene) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'addSceneDevice.html',
            controller: 'AddSceneDeviceCtrl',
            size: size,
            resolve: {
                RegionScene: function () {
                    return RegionScene;
                },
                Region: function () {
                    return $scope.currentRegion;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    }
    //添加配方到区域弹窗
    $scope.addRegionRecipe = function () {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'addRecipeToRegion.html',
            controller: 'AddRecipeToRegionModalCtrl',
            resolve: {
                Region: function () {
                    return $scope.currentRegion;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    }
    //开始配方弹窗
    $scope.startRegionRecipe = function (regionRecipe) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'playRegionRecipe.html',
            controller: 'PlayRegionRecipeModalCtrl',
            resolve: {
                regionRecipe: function () {
                    return regionRecipe;
                },
                Region: function () {
                    return $scope.currentRegion;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    }
    //结束配方弹窗
    $scope.stopRegionRecipe = function (regionRecipe) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'stopRegionRecipe.html',
            controller: 'StopRegionRecipeModalCtrl',
            resolve: {
                regionRecipe: function () {
                    return regionRecipe;
                },
                Region: function () {
                    return $scope.currentRegion;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    }
    //删除区域配方弹窗
    $scope.deleteRegionRecipe = function (regionRecipe) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'deleteRegionRecipe.html',
            controller: 'DeleteRegionRecipeModalCtrl',
            resolve: {
                regionRecipe: function () {
                    return regionRecipe;
                },
                Region: function () {
                    return $scope.currentRegion;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    }
    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
    /**
     * 动作成功之后的加载
     */
    //新建区域成功
    $rootScope.$on('loadConfigRegion', function() {
        var regionProm = AuthService.myHttp(token,{},'GET','region').then(function (data) {
            if(data.code == '0'){
                $scope.RegionData = data.content;
                $scope.RegionName = $scope.RegionData[0].region_name;
                $scope.currentRegion = $scope.RegionData[0];
                // 查找区域下的设备:默认查找第一个区域的设备数据
                var token = $cookieStore.get('token');
                var findRegionDevice = {
                    region_guid : $scope.RegionData[0].region_guid,
                    gateway_id : $scope.RegionData[0].gateway_id
                };
                $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice,'GET','region/device').then(function (data) {
                    if(data.code == '0' && data.content){
                        $scope.regionDeviceInfo = data.content;
                    }else {
                        $scope.regionDeviceInfo = [];
                    }
                })
                // 查询区域组
                $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice, 'GET', 'region/group').then(function(data){
                    if(data.code == '0' && data.content){
                        $scope.regionGroupInfo = data.content;
                    }else {
                        $scope.regionGroupInfo = [];
                    }
                });
                //查询区域场景
                $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice, 'GET', 'region/scene').then(function (data) {
                    if(data.code == '0' && data.content){
                        $scope.regionSceneInfo = data.content;
                    }else {
                        $scope.regionSceneInfo = [];
                    }
                });
                //查询区域配方
                var queryRegionRecipe = {
                    'region_guid' : $scope.RegionData[0].region_guid
                }
                $scope.RegionDeviceProm = AuthService.myHttp(token,queryRegionRecipe,'GET','recipe/regionRecipe').then(function (result) {
                    if(result.content){
                        $scope.RegionRecipeList = [];
                        for(var i = 0 ; i < result.content.length; i++){
                            $scope.RegionRecipeList[i] = {};
                            $scope.RegionRecipeList[i].period = ""+(result.content[i].days).length;
                            $scope.RegionRecipeList[i].name = result.content[i].name;
                            $scope.RegionRecipeList[i].private_recipe_id = result.content[i].private_recipe_id;
                            $scope.RegionRecipeList[i].seq = result.content[i].seq;
                            $scope.RegionRecipeList[i].start_time = result.content[i].start_time;
                            $scope.RegionRecipeList[i].status = result.content[i].status;
                        }
                    }
                });
            }else {
                toaster.pop({type: 'error', title: 'Error', body: data.message, timeout: POPTIMEOUT});
            }
        })
    });
    //删除区域成功或者删除失败之后取消删除
    $rootScope.$on('deleteRegionSuccess',function () {
        var regionProm = AuthService.myHttp(token,{},'GET','region').then(function (data) {
            if(data.code == '0' && data.content){
                $scope.RegionData = data.content;
                $scope.RegionName = $scope.RegionData[0].region_name;
                $scope.currentRegion = $scope.RegionData[0];
                // 查找区域下的设备:默认查找第一个区域的设备数据
                var token = $cookieStore.get('token');
                var findRegionDevice = {
                    region_guid : $scope.RegionData[0].region_guid,
                    gateway_id : $scope.RegionData[0].gateway_id
                };
                $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice,'GET','region/device').then(function (data) {
                    if(data.code == '0' && data.content){
                        $scope.regionDeviceInfo = data.content;
                    }else {
                        $scope.regionDeviceInfo = [];
                    }
                })
                // 查询区域组
                $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice, 'GET', 'region/group').then(function(data){
                    if(data.code == '0' && data.content){
                        $scope.regionGroupInfo = data.content;
                    }else {
                        $scope.regionGroupInfo = [];
                    }
                });
                //查询区域场景
                $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice, 'GET', 'region/scene').then(function (data) {
                    if(data.code == '0' && data.content){
                        $scope.regionSceneInfo = data.content;
                    }else {
                        $scope.regionSceneInfo = [];
                    }
                });
                //查询区域配方
                var queryRegionRecipe = {
                    'region_guid' : $scope.RegionData[0].region_guid
                }
                $scope.RegionDeviceProm = AuthService.myHttp(token,queryRegionRecipe,'GET','recipe/regionRecipe').then(function (result) {
                    if(result.content){
                        $scope.RegionRecipeList = [];
                        for(var i = 0 ; i < result.content.length; i++){
                            $scope.RegionRecipeList[i] = {};
                            $scope.RegionRecipeList[i].period = ""+(result.content[i].days).length;
                            $scope.RegionRecipeList[i].name = result.content[i].name;
                            $scope.RegionRecipeList[i].private_recipe_id = result.content[i].private_recipe_id;
                            $scope.RegionRecipeList[i].seq = result.content[i].seq;
                            $scope.RegionRecipeList[i].start_time = result.content[i].start_time;
                            $scope.RegionRecipeList[i].status = result.content[i].status;
                        }
                    }else {
                        $scope.RegionRecipeList = [];
                    }
                });
            }else {
                $scope.regionDeviceInfo = [];
                $scope.regionGroupInfo = [];
                $scope.regionSceneInfo = [];
                $scope.RegionRecipeList = [];
                // toaster.pop({type: 'error', title: 'Error', body: data.message, timeout: POPTIMEOUT});
            }
        })
    });
    //重命名区域成功
    $rootScope.$on('renameRegionSuccess',function () {
        var regionProm = AuthService.myHttp(token,{},'GET','region').then(function (data) {
            if(data.code == '0'){
                $scope.RegionData = data.content;
                $scope.RegionName = $scope.RegionData[0].region_name;
                $scope.currentRegion = $scope.RegionData[0];
                // 查找区域下的设备:默认查找第一个区域的设备数据
                var token = $cookieStore.get('token');
                var findRegionDevice = {
                    region_guid : $scope.RegionData[0].region_guid,
                    gateway_id : $scope.RegionData[0].gateway_id
                };
                $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice,'GET','region/device').then(function (data) {
                    if(data.code == '0' && data.content){
                        $scope.regionDeviceInfo = data.content;
                    }else {
                        $scope.regionDeviceInfo = [];
                    }
                })
                // 查询区域组
                $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice, 'GET', 'region/group').then(function(data){
                    if(data.code == '0' && data.content){
                        $scope.regionGroupInfo = data.content;
                    }else {
                        $scope.regionGroupInfo = [];
                    }
                });
                //查询区域场景
                $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice, 'GET', 'region/scene').then(function (data) {
                    if(data.code == '0' && data.content){
                        $scope.regionSceneInfo = data.content;
                    }else {
                        $scope.regionSceneInfo = [];
                    }
                });
                //查询区域配方
                var queryRegionRecipe = {
                    'region_guid' : $scope.RegionData[0].region_guid
                }
                $scope.RegionDeviceProm = AuthService.myHttp(token,queryRegionRecipe,'GET','recipe/regionRecipe').then(function (result) {
                    if(result.content){
                        $scope.RegionRecipeList = [];
                        for(var i = 0 ; i < result.content.length; i++){
                            $scope.RegionRecipeList[i] = {};
                            $scope.RegionRecipeList[i].period = ""+(result.content[i].days).length;
                            $scope.RegionRecipeList[i].name = result.content[i].name;
                            $scope.RegionRecipeList[i].private_recipe_id = result.content[i].private_recipe_id;
                            $scope.RegionRecipeList[i].seq = result.content[i].seq;
                            $scope.RegionRecipeList[i].start_time = result.content[i].start_time;
                            $scope.RegionRecipeList[i].status = result.content[i].status;
                        }
                    }
                });
            }else {
                toaster.pop({type: 'error', title: 'Error', body: data.message, timeout: POPTIMEOUT});
            }
        })
    });
    //添加区域设备成功
    $rootScope.$on('loadRegionDevice',function () {
        var findRegionDevice = {
            region_guid : $scope.currentRegion.region_guid,
            gateway_id : $scope.currentRegion.gateway_id
        };
        $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice,'GET','region/device').then(function (data) {
            if(data.code == '0' && data.content){
                $scope.regionDeviceInfo = data.content;
            }else {
                $scope.regionDeviceInfo = [];
            }
        })
    });
    //删除区域设备成功
    $rootScope.$on('deleteRegionDeviceSuccess',function () {
        var findRegionDevice = {
            region_guid : $scope.currentRegion.region_guid,
            gateway_id : $scope.currentRegion.gateway_id
        };
        $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice,'GET','region/device').then(function (data) {
            if(data.code == '0' && data.content){
                $scope.regionDeviceInfo = data.content;
            }else {
                $scope.regionDeviceInfo = [];
            }
        })
    });
    //新建区域组成功
    $rootScope.$on('addNewGroupSuccess',function () {
        var findRegionDevice = {
            region_guid : $scope.currentRegion.region_guid,
            gateway_id : $scope.currentRegion.gateway_id
        };
        $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice, 'GET', 'region/group').then(function(data){
            if(data.code == '0' && data.content){
                $scope.regionGroupInfo = data.content;
            }else {
                $scope.regionGroupInfo = [];
            }
        });
    });
    //删除区域组成功或者删除失败之后取消删除
    $rootScope.$on('deleteGroupSuccess',function () {
        var findRegionDevice = {
            region_guid : $scope.currentRegion.region_guid,
            gateway_id : $scope.currentRegion.gateway_id
        };
        $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice, 'GET', 'region/group').then(function(data){
            if(data.code == '0' && data.content){
                $scope.regionGroupInfo = data.content;
            }else {
                $scope.regionGroupInfo = [];
            }
        });
    });
    //重命名区域组成功
    $rootScope.$on('RenameGroupSuccess',function () {
        var findRegionDevice = {
            region_guid : $scope.currentRegion.region_guid,
            gateway_id : $scope.currentRegion.gateway_id
        };
        $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice, 'GET', 'region/group').then(function(data){
            if(data.code == '0' && data.content){
                $scope.regionGroupInfo = data.content;
            }else {
                $scope.regionGroupInfo = [];
            }
        });
    });
    //新建区域场景成功
    $rootScope.$on('addNewSceneSuccess',function () {
        var findRegionDevice = {
            region_guid : $scope.currentRegion.region_guid,
            gateway_id : $scope.currentRegion.gateway_id
        };
        $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice, 'GET', 'region/scene').then(function (data) {
            if(data.code == '0' && data.content){
                $scope.regionSceneInfo = data.content;
            }else {
                $scope.regionSceneInfo = [];
            }
        });
    });
    //删除区域场景成功或者删除失败之后取消删除
    $rootScope.$on('deleteRegionSceneSuccess',function () {
        var findRegionDevice = {
            region_guid : $scope.currentRegion.region_guid,
            gateway_id : $scope.currentRegion.gateway_id
        };
        $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice, 'GET', 'region/scene').then(function (data) {
            if(data.code == '0' && data.content){
                $scope.regionSceneInfo = data.content;
            }else {
                $scope.regionSceneInfo = [];
            }
        });
    });
    //重命名区域场景成功
    $rootScope.$on('RenameSceneSuccess',function () {
        var findRegionDevice = {
            region_guid : $scope.currentRegion.region_guid,
            gateway_id : $scope.currentRegion.gateway_id
        };
        $scope.RegionDeviceProm = AuthService.myHttp(token,findRegionDevice, 'GET', 'region/scene').then(function (data) {
            if(data.code == '0' && data.content){
                $scope.regionSceneInfo = data.content;
            }else {
                $scope.regionSceneInfo = [];
            }
        });
    });
    //添加区域配方成功
    $rootScope.$on('addRegionRecipeSuucess',function () {
        var queryRegionRecipe = {
            'region_guid' : $scope.currentRegion.region_guid
        }
        $scope.RegionDeviceProm = AuthService.myHttp(token,queryRegionRecipe,'GET','recipe/regionRecipe').then(function (result) {
            if(result.content){
                $scope.RegionRecipeList = [];
                for(var i = 0 ; i < result.content.length; i++){
                    $scope.RegionRecipeList[i] = {};
                    $scope.RegionRecipeList[i].period = ""+(result.content[i].days).length;
                    $scope.RegionRecipeList[i].name = result.content[i].name;
                    $scope.RegionRecipeList[i].private_recipe_id = result.content[i].private_recipe_id;
                    $scope.RegionRecipeList[i].seq = result.content[i].seq;
                    $scope.RegionRecipeList[i].start_time = result.content[i].start_time;
                    $scope.RegionRecipeList[i].status = result.content[i].status;
                }
            }else {
                $scope.RegionRecipeList = [];
            }
        })
    });
    //执行配方成功
    $rootScope.$on('startRegionRecipeSuucess',function () {
        var queryRegionRecipe = {
            'region_guid' : $scope.currentRegion.region_guid
        }
        $scope.RegionDeviceProm = AuthService.myHttp(token,queryRegionRecipe,'GET','recipe/regionRecipe').then(function (result) {
            if(result.content){
                $scope.RegionRecipeList = [];
                for(var i = 0 ; i < result.content.length; i++){
                    $scope.RegionRecipeList[i] = {};
                    $scope.RegionRecipeList[i].period = ""+(result.content[i].days).length;
                    $scope.RegionRecipeList[i].name = result.content[i].name;
                    $scope.RegionRecipeList[i].private_recipe_id = result.content[i].private_recipe_id;
                    $scope.RegionRecipeList[i].seq = result.content[i].seq;
                    $scope.RegionRecipeList[i].start_time = result.content[i].start_time;
                    $scope.RegionRecipeList[i].status = result.content[i].status;
                }
            }else {
                $scope.RegionRecipeList = [];
            }
        })
    });
    //停止配方成功
    $rootScope.$on('stopRegionRecipeSuucess',function () {
        var queryRegionRecipe = {
            'region_guid' : $scope.currentRegion.region_guid
        }
        $scope.RegionDeviceProm = AuthService.myHttp(token,queryRegionRecipe,'GET','recipe/regionRecipe').then(function (result) {
            if(result.content){
                $scope.RegionRecipeList = [];
                for(var i = 0 ; i < result.content.length; i++){
                    $scope.RegionRecipeList[i] = {};
                    $scope.RegionRecipeList[i].period = ""+(result.content[i].days).length;
                    $scope.RegionRecipeList[i].name = result.content[i].name;
                    $scope.RegionRecipeList[i].private_recipe_id = result.content[i].private_recipe_id;
                    $scope.RegionRecipeList[i].seq = result.content[i].seq;
                    $scope.RegionRecipeList[i].start_time = result.content[i].start_time;
                    $scope.RegionRecipeList[i].status = result.content[i].status;
                }
            }else {
                $scope.RegionRecipeList = [];
            }
        })
    });
    //删除区域配方成功
    $rootScope.$on('deleteRegionRecipeSuccess',function () {
        var queryRegionRecipe = {
            'region_guid' : $scope.currentRegion.region_guid
        }
        $scope.RegionDeviceProm = AuthService.myHttp(token,queryRegionRecipe,'GET','recipe/regionRecipe').then(function (result) {
            if(result.content){
                $scope.RegionRecipeList = [];
                for(var i = 0 ; i < result.content.length; i++){
                    $scope.RegionRecipeList[i] = {};
                    $scope.RegionRecipeList[i].period = ""+(result.content[i].days).length;
                    $scope.RegionRecipeList[i].name = result.content[i].name;
                    $scope.RegionRecipeList[i].private_recipe_id = result.content[i].private_recipe_id;
                    $scope.RegionRecipeList[i].seq = result.content[i].seq;
                    $scope.RegionRecipeList[i].start_time = result.content[i].start_time;
                    $scope.RegionRecipeList[i].status = result.content[i].status;
                }
            }else {
                $scope.RegionRecipeList = [];
            }
        })
    });
})

/**
 * 新建区域控制器
 */
.controller('NewRegionModalCtrl',function ($scope, $uibModalInstance,AuthService,$rootScope,toaster,POPTIMEOUT,$cookieStore) {
    //加载提示
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';
    var token = $cookieStore.get('token');
    //查询用户的网关
    var findGateway = {};
    var gateway = AuthService.myHttp(token,findGateway,'GET','login/user_info').then(function (data) {
        $scope.GatewayInfo = data.content;
        $scope.my.gateway = data.content[0];
    })
    $scope.my = {
        newRegionName : ""
    }
    $scope.ok = function () {
        if($scope.my.newRegionName == ''){
            toaster.pop({type: 'error', title: 'RegionName', body: 'can not be null', timeout: POPTIMEOUT});
        }else {
            $scope.regional = {
                "table_region":[{
                    "region_name":$scope.my.newRegionName,
                    "region_switch":"01",
                    "region_value":"NULL",
                    "region_delay":"1",
                    "gateway_id":$scope.my.gateway.gateway_id
                }]
            };
            $scope.newRegionProm = AuthService.myHttp(token,$scope.regional, 'POST', 'region').then(function(data) {
                if (data.code != '0') {
                    toaster.pop({type: 'error', title: 'Region', body: data.message, timeout: POPTIMEOUT});
                } else {
                    toaster.pop({type: 'success', title: 'Region', body: data.message, timeout: POPTIMEOUT});
                    $rootScope.$broadcast('loadConfigRegion');
                    $uibModalInstance.close();
                }
            })
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})
/**
 * 删除区域控制器
 */
.controller('DeleteRegionModalCtrl',function ($scope, $uibModalInstance, AuthService,$stateParams, toaster, POPTIMEOUT,$rootScope,$state,$timeout,$cookieStore,region) {
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/delete-loading-template.html';

    var token = $cookieStore.get('token');
    $scope.deleteRegionModalBody = false;//开始时隐藏进度条
    $scope.deleteRegionModalFoot = true;//开始时显示modal脚部
    $scope.retryDeleteRegionModalFoot = false;
    $scope.title = 'Are you sure to delete this region ?';
    $scope.ok = function () {
        var deleteRegionData = {
            "gateway_id" : region.gateway_id,
            "region":{
                "region_guid":region.region_guid,
                "regionDevice":[{
                    "region_guid":"",
                    "region_device_guid":""
                }],
                "scene":[{
                    "scene_guid":"",
                    "members":[{
                        "device_addr":"",
                        "scene_members_guid":""
                    }]
                }],
                "group":[{
                    "group_guid":"",
                    "members":[{
                        "device_addr":"",
                        "group_members_guid":""
                    }]
                }]
            }
        }
        var deleteRegionProm = AuthService.myHttp(token,deleteRegionData,'POST','deleteOptions').then(function (data) {
            window.data = data;
            if(data.code != '0'){
                toaster.pop({type: 'error', title: 'Error', body: data.message, timeout: POPTIMEOUT});
            }else {
                $scope.deleteRegionModalBody = true;//删除时显示进度条
                $scope.deleteRegionModalFoot = false;//删除时隐藏modal脚部
                $scope.title = 'Deleting...';
                $scope.vm = {};
                $scope.vm.showLabel = true;
                $scope.vm.total = data.content.length;
                $scope.message = data.content[0].message;
                var i = 0;
                deleteRegion(i);
                function deleteRegion(i) {
                    $scope.deleteRegionProm = AuthService.myHttp(token,data.content[i].data,data.content[i].method,data.content[i].url).then(function (result) {
                        if(result.code == '0'){
                            $scope.vm.style = 'progress-bar-success';
                            $scope.vm.value = Math.round((i+1)/$scope.vm.total * 100);
                            if((i+1) != data.content.length){
                                $scope.message = data.content[i+1].message;
                                return $timeout(function () {
                                    deleteRegion(i+1);
                                },1500);
                            }else {
                                toaster.pop({type: 'success', title: 'Success', body: 'region delete success', timeout: POPTIMEOUT});
                                window.data = null;
                                $rootScope.$broadcast('deleteRegionSuccess');
                                $uibModalInstance.dismiss('cancel');
                            }
                        }else {
                            toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
                            $scope.vm.style = 'progress-bar-danger';
                            $scope.title = 'Failed';
                            $scope.retryDeleteRegionModalFoot = true;
                            $scope.retryOk = function () {
                                $scope.title = 'Deleting...';
                                $scope.vm.style = 'progress-bar-success';
                                $scope.retryDeleteRegionModalFoot = false;
                                deleteRegion(i);
                            }
                            $scope.retryCancel = function () {
                                $rootScope.$broadcast('deleteRegionSuccess');
                                $uibModalInstance.dismiss('cancel');
                                window.data = null;
                            }
                        }
                    })
                };
            }
        })
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})
/**
 * 添加区域设备控制器
 */
.controller('AddRegionDeviceCtrl',function ($scope, $uibModalInstance, AuthService,$stateParams, toaster, POPTIMEOUT,$rootScope,$cookieStore,Region) {
    var token = $cookieStore.get('token');
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';

    //获取用户的设备,排除掉已经添加过的设备
    var findDevice = {
        "region_guid" : Region.region_guid,
        "gateway_id" : Region.gateway_id
    };
    $scope.deviceInfo = [];
    $scope.deviceProm = AuthService.myHttp(token,findDevice,'GET','table_device').then(function (data) {
        for(var i = 0; i<data.content.length; i++){
            $scope.deviceInfo[i] = {};
            if(data.content[i].device_type != 'NULL'){
                $scope.deviceInfo[i] = data.content[i];
            }
        }
    });
    //添加区域设备
    $scope.addRegionDevice  = function (item) {
        var addDeviceToRegionData = {};
        var tableRegionDevice = [{
            "region_guid":Region.region_guid,
            "region_addr":Region.region_addr,
            "region_name":Region.region_name,
            "table_device_guid":item.device_guid,
            "gateway_id":item.gateway_id,
            "device_addr":item.device_addr,
            "device_name":item.device_name
        }]
        addDeviceToRegionData.table_region_device = tableRegionDevice;
        $scope.addRegionDeviceProm = AuthService.myHttp(token,addDeviceToRegionData,'POST','region/device').then(function (data) {
            if (data.code != '0') {
                toaster.pop({type: 'error', title: 'Error', body: data.message, timeout: POPTIMEOUT});
            } else {
                toaster.pop({type: 'success', title: 'Success', body: data.message, timeout: POPTIMEOUT});
                var deviceProm = AuthService.myHttp(token,findDevice,'GET','table_device').then(function (data) {
                    for(var i = 0; i<data.content.length; i++){
                        $scope.deviceInfo[i] = {};
                        if(data.content[i].device_type != 'NULL'){
                            $scope.deviceInfo[i] = data.content[i];
                        }
                    }
                });
                $rootScope.$broadcast('loadRegionDevice');
            }
        })
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.RegionalDeviceCurrentPage = 5;
    $scope.DeviceCurrentPage = 5;
    $scope.RegionalDeviceMaxSize = 1;
    $scope.DeviceMaxSize = 1;
    $scope.DeviceTotalItems = 1;
})
/**
 * 删除区域设备控制器
 */
.controller('DeleteRegionDeviceModalCtrl',function ($scope, $uibModalInstance, AuthService,$stateParams, toaster, POPTIMEOUT,$rootScope,$state,regionDevice,$cookieStore,Region) {
    var token = $cookieStore.get('token');
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';

    $scope.ok = function () {
        var deleteRegionDevice = {};
        var tableRegionDevice = [{
            "region_guid" : Region.region_guid,
            "region_addr" : Region.region_addr,
            "device_addr" : regionDevice.device_addr,
            "gateway_id" : Region.gateway_id,
            "table_device_guid": regionDevice.table_device_guid
        }]
        deleteRegionDevice.table_region_device = tableRegionDevice;
        $scope.deleteRegionDeviceProm = AuthService.myHttp(token,deleteRegionDevice,'DELETE','region/device').then(function (data) {
            if (data.code != '0') {
                toaster.pop({type: 'error', title: 'Device', body: data.message, timeout: POPTIMEOUT});
            } else {
                toaster.pop({type: 'success', title: 'Device', body: data.message, timeout: POPTIMEOUT});
                $rootScope.$broadcast('deleteRegionDeviceSuccess');
                $uibModalInstance.close();
            }
        })
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})
/**
 * 修改区域名称控制器
 */
.controller('RenameRegionModalCtrl',function ($state,$scope, $uibModalInstance, AuthService,$stateParams, toaster, POPTIMEOUT,$rootScope,$cookieStore,Region) {
    var token = $cookieStore.get('token');

    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';

    $scope.RegionName = Region.region_name;
    $scope.ok = function () {
        var renameRegionData = {
            "table_region":[{
                "gateway_id": Region.gateway_id,
                "region_name": $scope.RegionName,
                "region_guid": Region.region_guid
            }]
        }
        $scope.renameRegionProm = AuthService.myHttp(token,renameRegionData,'PUT','regionName').then(function (result) {
            if(result.code == '0'){
                toaster.pop({type: 'success', title: 'Success', body: result.message, timeout: POPTIMEOUT});
                $rootScope.$broadcast('renameRegionSuccess');
                $uibModalInstance.close();
            }else {
                toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
            }
        })
    };
    $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
    };
})
/**
 * 新建组控制器
 */
.controller('NewGroupModalCtrl',function ($scope, $uibModalInstance,AuthService,$stateParams, toaster, POPTIMEOUT,$rootScope,$cookieStore,Region) {
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';
    var token = $cookieStore.get('token');
    //查找用户网关
    var findGateway = {};
    var gateway = AuthService.myHttp(token,findGateway,'GET','login/user_info').then(function (data) {
        $scope.GatewayInfo = data.content;
        $scope.my.gateway = $scope.GatewayInfo[0];
    })
    $scope.my = {
        newGroupName : ""
    }
    $scope.newGroupOk = function () {
        if($scope.newGroupName == ''){
            toaster.pop({type: 'error', title: 'GroupName', body: 'can not be null', timeout: POPTIMEOUT});
        }else {
            $scope.group= {
                "table_group":[{
                    "gateway_id":$scope.my.gateway.gateway_id,
                    "group_name":$scope.my.newGroupName
                }]
            }
            $scope.newGroupProm = AuthService.myHttp(token,$scope.group,'POST','device/group').then(function(data) {
                if (data.code == "-1") {
                    toaster.pop({type: 'error', title: 'Group', body: data.message, timeout: POPTIMEOUT});
                } else {
                    var groupInfo = data.content;
                    var AddGroupToRegion = {}
                    var table_region_group = [{
                        "region_guid": Region.region_guid,
                        "gateway_id": groupInfo[0].gateway_id,
                        "group_name": groupInfo[0].group_name,
                        "group_addr": groupInfo[0].group_addr,
                        "table_group_guid": groupInfo[0].group_guid
                    }];
                    AddGroupToRegion.table_region_group = table_region_group;
                    var addGroupInfo = AuthService.myHttp(token,AddGroupToRegion, 'POST', "region/group").then(function (backData) {
                        if (backData.code != '0') {
                            toaster.pop({type: 'error', title: 'Group', body: backData.message, timeout: POPTIMEOUT});
                        } else {
                            toaster.pop({type: 'success', title: 'Group', body: backData.message, timeout: POPTIMEOUT});
                            $rootScope.$broadcast('addNewGroupSuccess');
                            $uibModalInstance.close();
                        }
                    })
                }
            })
        }
    }
    $scope.newGroupCancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})
/**
 * 删除区域组控制器
 */
.controller('DeleteGroupModalCtrl',function ($scope, $uibModalInstance, regionGroup, AuthService,$rootScope, toaster, POPTIMEOUT,$stateParams,$timeout,$cookieStore) {

    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/delete-loading-template.html';

    $scope.title = 'Are you sure to delete this group ?'
    $scope.deleteGroupModalBody = false;//开始时隐藏进度条
    $scope.deleteGroupModalFoot = true;//开始时显示modal脚部
    $scope.retryDeleteGroupModalFoot = false;
    $scope.ok = function () {
        var deleteGroupData = {
            "gateway_id" : regionGroup.gateway_id,
            "region":{
                "region_guid":"",
                "regionDevice":[{
                    "region_guid":"",
                    "region_device_guid":""
                }],
                "scene":[{
                    "scene_guid":"",
                    "members":[{
                        "device_addr":"",
                        "scene_members_guid":""
                    }]
                }],
                "group":[{
                    "group_guid":regionGroup.table_group_guid,
                    "members":[{
                        "device_addr":"",
                        "group_members_guid":""
                    }]
                }]
            }
        }
        var token = $cookieStore.get('token');
        var deleteGroupProm = AuthService.myHttp(token,deleteGroupData,'POST','deleteOptions').then(function (data) {
            window.data = data;
            if(data.code != '0'){
                toaster.pop({type: 'error', title: 'Error', body: data.message, timeout: POPTIMEOUT});
            }else {
                $scope.deleteGroupModalBody = true;//删除时显示进度条
                $scope.deleteGroupModalFoot = false;//删除时隐藏modal脚部
                $scope.title = 'Deleting...';
                $scope.vm = {};
                $scope.vm.showLabel = true;
                $scope.vm.total = data.content.length;
                $scope.message = data.content[0].message;
                var i = 0;
                deleteGroup(i);
                function deleteGroup(i) {
                    $scope.deleteGroupProm = AuthService.myHttp(token,data.content[i].data,data.content[i].method,data.content[i].url).then(function (result) {
                        if(result.code == '0'){
                            $scope.vm.style = 'progress-bar-success';
                            $scope.vm.value = Math.round((i+1)/$scope.vm.total * 100);
                            if((i+1) != data.content.length){
                                $scope.message = data.content[i+1].message;
                                return $timeout(function () {
                                    deleteGroup(i+1);
                                },1500);
                            }else {
                                toaster.pop({type: 'success', title: 'Success', body: 'group delete success', timeout: POPTIMEOUT});
                                window.data = null;
                                $rootScope.$broadcast('deleteGroupSuccess');
                                $uibModalInstance.dismiss('cancel');
                            }
                        }else {
                            toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
                            $scope.vm.style = 'progress-bar-danger';
                            $scope.title = 'Failed';
                            $scope.retryDeleteGroupModalFoot = true;
                            $scope.retryOk = function () {
                                $scope.title = 'Deleting...';
                                $scope.vm.style = 'progress-bar-success';
                                $scope.retryDeleteGroupModalFoot = false;
                                deleteGroup(i);
                            };
                            $scope.retryCancel = function () {
                                $rootScope.$broadcast('deleteGroupSuccess');
                                $uibModalInstance.dismiss('cancel');
                                window.data = null;
                            };
                        }
                    })
                }
            }
        })
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})
/**
 * 重命名区域组
 */
.controller('RenameGroupModalCtrl',function ($scope, $uibModalInstance,AuthService,$stateParams, toaster, POPTIMEOUT,regionGroup,$rootScope,$cookieStore) {
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';
    var token = $cookieStore.get('token');
    $scope.groupName = regionGroup.group_name;
    $scope.ok = function () {
        var renameGroupData = {
            "table_region_group":[{
                "gateway_id": regionGroup.gateway_id,
                "table_group_guid": regionGroup.table_group_guid,
                "group_name": $scope.groupName
            }]
        }
        $scope.renameGroupProm = AuthService.myHttp(token,renameGroupData,'PUT','region/group').then(function (result) {
            if(result.code == '0'){
                toaster.pop({type: 'success', title: 'Success', body: result.message, timeout: POPTIMEOUT});
                $rootScope.$broadcast('RenameGroupSuccess')
                $uibModalInstance.close();
            }else {
                toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
            }
        })
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})
/**
 * 添加组成员控制器
 */
.controller('AddGroupDeviceCtrl',function ($scope, $uibModalInstance,AuthService,$stateParams, toaster, POPTIMEOUT,regionGroup,$rootScope,$cookieStore,Region) {
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';
    var token = $cookieStore.get('token');
    //查找区域下的设备,以组的主键过滤到当前已经添加到组里的设备
    var findRegionDevice = {
        region_guid : Region.region_guid,
        gateway_id : Region.gateway_id,
        table_group_guid : regionGroup.table_group_guid
    };
    $scope.addGroupMemProm = AuthService.myHttp(token,findRegionDevice,'GET','table_device').then(function (data) {
        if(data.code == '0' && data.content){
            $scope.deviceInfo = data.content;
        }else {
            $scope.deviceInfo = []
        }
    });
    //添加组成员
    $scope.addDeviceToGroup = function (item) {
        var addGroupMemberData = {
            table_group_members : [{
                "table_group_guid": regionGroup.table_group_guid,
                "group_addr": regionGroup.group_addr,
                "device_addr": item.device_addr,
                "device_guid": item.device_guid,
                "gateway_id": item.gateway_id,
                "device_name": item.device_name
            }]
        }
        if(item.device_type == 'sensor'){
            toaster.pop({type: 'error', title: 'Sensor', body: 'can not be added to group', timeout: POPTIMEOUT});
        }else {
            $scope.addGroupMemProm = AuthService.myHttp(token,addGroupMemberData,'POST','device/group/group_member').then(function (data) {
                if (data.code != '0') {
                    toaster.pop({type: 'error', title: item.device_name, body: data.message, timeout: POPTIMEOUT});
                } else {
                    toaster.pop({type: 'success', title: item.device_name, body: data.message, timeout: POPTIMEOUT});
                    var deviceProm = AuthService.myHttp(token,findRegionDevice,'GET','table_device').then(function (data) {
                        if(data.code == '0' && data.content){
                            $scope.deviceInfo = data.content;
                        }else {
                            $scope.deviceInfo = []
                        }
                    });
                }
            })
        }
    }
    $scope.ok = function () {
        $uibModalInstance.close();
    };
})
/**
 * 查看组详情控制器
 */
.controller('GroupConfigDetailModalCtrl', function ($scope, $uibModalInstance, regionGroup, AuthService,$rootScope, toaster, POPTIMEOUT,$cookieStore) {
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';

    $scope.GroupDeviceCurrentPage = 5;
    $scope.DeviceCurrentPage = 1;
    $scope.RegionDeviceMaxSize = 1;
    $scope.DeviceMaxSize = 1;
    $scope.GroupDeviceTotalItems = 100;
    $scope.DeviceTotalItems = 100;

    $scope.ok = function () {
        $uibModalInstance.close();
    };
    //查找组成员
    var findGroupMembeData = {
        table_group_guid : regionGroup.table_group_guid,
        gateway_id : regionGroup.gateway_id
    }
    var token = $cookieStore.get('token');
    $scope.groupMemProm = AuthService.myHttp(token,findGroupMembeData,'GET','device/group/group_member').then(function (data) {
        if(data.code == '0' && data.content){
            $scope.groupMemberInfo = data.content;
        }else {
            $scope.groupMemberInfo = [];
        }
    })
    // 删除组成员
    $scope.deleteGroupMember = function (item) {
        var deleteGroupMember = {
            table_group_members : [{
                "table_group_guid":regionGroup.table_group_guid ,
                "group_addr" : item.group_addr,
                "device_addr" : item.device_addr,
                "gateway_id" : item.gateway_id
            }]
        }
        $scope.deleteGroupMemProm = AuthService.myHttp(token,deleteGroupMember,'DELETE','device/group/group_member').then(function (data) {
            if (data.code != '0') {
                toaster.pop({type: 'error', title: item.device_name, body: data.message, timeout: POPTIMEOUT});
            } else {
                toaster.pop({type: 'success', title: item.device_name, body: data.message, timeout: POPTIMEOUT});
                var groupMemProm = AuthService.myHttp(token,findGroupMembeData,'GET','device/group/group_member').then(function (data) {
                    if(data.code == '0' && data.content){
                        $scope.groupMemberInfo = data.content;
                    }else {
                        $scope.groupMemberInfo = [];
                    }
                })
            }
        })
    }
    // 分页
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

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
})
/**
 * 新建场景控制器
 */
.controller('NewSceneModalCtrl',function ($scope, $uibModalInstance,AuthService, toaster, POPTIMEOUT,$stateParams,$rootScope,$cookieStore,Region) {
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';
    var token = $cookieStore.get('token');
    //查找用户网关
    var findGateway = {};
    var gateway = AuthService.myHttp(token,findGateway,'GET','login/user_info').then(function (data) {
        $scope.GatewayInfo = data.content;
        $scope.my.gateway = data.content[0];
    })
    $scope.my = {
        newSceneName : ""
    }
    $scope.newSceneOk = function () {
        if($scope.my.newSceneName == ''){
            toaster.pop({type: 'error', title: 'SceneName', body: 'cant not be null', timeout: POPTIMEOUT});
        }else {
            $scope.scene= {
                "table_scene":[{
                    "gateway_id":$scope.my.gateway.gateway_id,
                    "scene_name":$scope.my.newSceneName
                }]
            }
            $scope.newSceneProm = AuthService.myHttp(token,$scope.scene,'POST','device/scene').then(function(data) {
                if(data.code != '0'){
                    toaster.pop({type: 'error', title: 'Scene', body: data.message, timeout: POPTIMEOUT});
                }else {
                    var sceneInfo = data.content;
                    var AddSceneToRegion = {
                        table_region_scene : [{
                            "region_guid": Region.region_guid,
                            "table_scene_guid":sceneInfo[0].scene_guid,
                            "gateway_id":sceneInfo[0].gateway_id,
                            "scene_addr":sceneInfo[0].scene_addr,
                            "scene_name":sceneInfo[0].scene_name
                        }]
                    }
                    var addSceneProm = AuthService.myHttp(token,AddSceneToRegion, 'POST', "region/scene").then(function (result) {
                        if (result.code != '0') {
                            toaster.pop({type: 'error', title: 'Scene', body: result.message, timeout: POPTIMEOUT});
                        } else {
                            toaster.pop({type: 'success', title: 'Scene', body: result.message, timeout: POPTIMEOUT});
                            $rootScope.$broadcast('addNewSceneSuccess');
                            $uibModalInstance.close();
                        }
                    })
                }
            })
        }
    }
    $scope.newSceneCancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})
/**
 * 删除场景提示框控制器
 */
.controller('DeleteSceneModalCtrl',function ($scope, $uibModalInstance,RegionScene,AuthService, toaster, POPTIMEOUT,$rootScope,$stateParams,$timeout,$cookieStore) {
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.Message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/delete-loading-template.html';
    var token = $cookieStore.get('token');
    $scope.deleteSceneModalBody = false;//开始时隐藏进度条
    $scope.deleteSceneModalFoot = true;//开始时显示modal脚部
    $scope.retryDeleteSceneModalFoot = false;
    $scope.title = 'Are you sure to delete this scene ?'
    $scope.ok = function () {
        var deleteSceneData = {
            "gateway_id" : RegionScene.gateway_id,
            "region":{
                "region_guid":"",
                "regionDevice":[{
                    "region_guid":"",
                    "region_device_guid":""
                }],
                "scene":[{
                    "scene_guid":RegionScene.table_scene_guid,
                    "members":[{
                        "device_addr":"",
                        "scene_members_guid":""
                    }]
                }],
                "group":[{
                    "group_guid":"",
                    "members":[{
                        "device_addr":"",
                        "group_members_guid":""
                    }]
                }]
            }
        }
        var deleteSceneProm = AuthService.myHttp(token,deleteSceneData,'POST','deleteOptions').then(function (data) {
            window.data = data;
            if(data.code != '0'){
                toaster.pop({type: 'error', title: 'Error', body: data.message, timeout: POPTIMEOUT});
            }else {
                $scope.deleteSceneModalBody = true;//删除时显示进度条
                $scope.deleteSceneModalFoot = false;//删除时隐藏modal脚部
                $scope.title = 'Deleting...';
                $scope.vm = {};
                $scope.vm.showLabel = true;
                $scope.vm.total = data.content.length;
                $scope.message = data.content[0].message;
                var i = 0;
                deleteScene(i);
                function deleteScene(i) {
                    $scope.deleteSceneProm = AuthService.myHttp(token,data.content[i].data,data.content[i].method,data.content[i].url).then(function (result) {
                        if(result.code == '0'){
                            $scope.vm.style = 'progress-bar-success';
                            $scope.vm.value = Math.round((i+1)/$scope.vm.total * 100);
                            if((i+1) != data.content.length){
                                $scope.message = data.content[i+1].message;
                                return $timeout(function () {
                                    deleteScene(i+1);
                                },1500);
                            }else {
                                toaster.pop({type: 'success', title: 'Success', body: 'scene delete success', timeout: POPTIMEOUT});
                                window.data = null;
                                $rootScope.$broadcast('deleteRegionSceneSuccess');
                                $uibModalInstance.dismiss('cancel');
                            }
                        }else {
                            toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
                            $scope.vm.style = 'progress-bar-danger';
                            $scope.title = 'Failed';
                            $scope.retryDeleteSceneModalFoot = true;
                            $scope.retryOk = function () {
                                $scope.title = 'Deleting...';
                                $scope.vm.style = 'progress-bar-success';
                                $scope.retryDeleteSceneModalFoot = false;
                                deleteScene(i);
                            };
                            $scope.retryCancel = function () {
                                $rootScope.$broadcast('deleteRegionSceneSuccess');
                                $uibModalInstance.dismiss('cancel');
                                window.data = null;
                            };
                        }
                    })
                }
            }
        })
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})
/**
 * 场景重命名控制器
 */
.controller('RenameSceneModalCtrl',function ($rootScope,$scope, $uibModalInstance,AuthService,$stateParams, toaster, POPTIMEOUT,RegionScene,$cookieStore) {
    var token = $cookieStore.get('token');

    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';

    $scope.sceneName = RegionScene.scene_name;

    $scope.ok = function () {
        var renameSceneData = {
            "table_region_scene":[{
                "gateway_id": RegionScene.gateway_id,
                "table_scene_guid": RegionScene.table_scene_guid,
                "scene_name": $scope.sceneName
            }]
        }
        $scope.renameSceneProm = AuthService.myHttp(token,renameSceneData,'PUT','region/scene').then(function (result) {
            if(result.code == '0'){
                toaster.pop({type: 'success', title: 'Success', body: result.message, timeout: POPTIMEOUT});
                $rootScope.$broadcast('RenameSceneSuccess')
                $uibModalInstance.close();
            }else {
                toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
            }
        })
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})
/**
 * 添加场景成员控制器
 */
.controller('AddSceneDeviceCtrl',function ($scope, $uibModalInstance,AuthService,$stateParams, toaster, POPTIMEOUT,RegionScene,$cookieStore,Region) {
    var token = $cookieStore.get('token');
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';
    
    //查找区域下的设备,以场景主键过滤已添加进场景的区域设备
    var findRegionDevice = {
        region_guid : Region.region_guid,
        gateway_id : Region.gateway_id,
        table_scene_guid : RegionScene.table_scene_guid
    };
    $scope.addSceneMemProm = AuthService.myHttp(token,findRegionDevice,'GET','table_device').then(function (data) {
        $scope.deviceInfo = data.content;
    });
    //选择设备
    $scope.selectDevice = function (item) {
        if(item.channel.length != 0 || item.channel){
            $scope.deviceChannel = [];
            //显示通道
            for(var i=0;i<item.channel.length;i++){
                $scope.deviceChannel[i] = {};
                $scope.deviceChannel[i].channel_number = item.channel[i].channel_number;
                $scope.deviceChannel[i].channel_value = Math.round(item.channel[i].channel_value*100/255);
                $scope.deviceChannel[i].channel_name = item.channel[i].channel_name;
            }
        }
        $scope.Device = item;
    };
    //添加场景成员
    $scope.addSceneMem = function (data) {
        if($scope.Device.device_type == 'sensor'){
            toaster.pop({type: 'error', title: 'Sensor', body: 'can not be added to scene', timeout: POPTIMEOUT});
        }else {
            $scope.channelValue = [];
            for(var i = 0; i<data.length;i ++){
                $scope.channelValue[i] = {};
                $scope.channelValue[i].channel_number = data[i].channel_number;
                $scope.channelValue[i].value = ""+Math.round(data[i].channel_value*255/100);
            }
            var addSceneMemberData = {
                table_scene_members : [{
                    "table_scene_guid":RegionScene.table_scene_guid,
                    "scene_addr":RegionScene.scene_addr,
                    "device_addr":$scope.Device.device_addr,
                    "device_value":$scope.channelValue,
                    "device_delay":"1",
                    "device_guid":$scope.Device.device_guid,
                    "gateway_id":$scope.Device.gateway_id,
                    "device_name":$scope.Device.device_name
                }]
            };
            $scope.addSceneMemProm = AuthService.myHttp(token,addSceneMemberData,'POST','device/scene/scene_members').then(function (data) {
                if (data.code != '0') {
                    toaster.pop({type: 'error', title: 'Device', body: data.message, timeout: POPTIMEOUT});
                } else {
                    toaster.pop({type: 'success', title: 'Device', body: data.message, timeout: POPTIMEOUT});
                    $uibModalInstance.close();
                }
            })
        }
    }
    // 滑块数据
    $scope.slider_callbacks = {
        options: {
            ceil: 100,
            floor: 0,
            step : 1
        }
    };
    $scope.addSceneMemCancel = function () {
        $uibModalInstance.close();
    };
})
/**
 * 场景详情控制器
 */
.controller('SceneConfigDetailModalCtrl', function ($scope, $uibModalInstance,RegionScene,AuthService, toaster, POPTIMEOUT,$rootScope,$cookieStore) {
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';
    // 滑块数据
    $scope.slider_callbacks = {
        options: {
            ceil: 100,
            floor: 0,
            step : 1
        }
    };
    var token = $cookieStore.get('token');
    $scope.SceneDeviceCurrentPage = 5;
    $scope.DeviceCurrentPage = 5;
    $scope.RegionSceneDeviceMaxSize = 1;
    $scope.DeviceMaxSize = 1;
    $scope.SceneDeviceTotalItems = 100;
    $scope.DeviceTotalItems = 100;
    //查询场景成员
    var findSceneMember = {
        table_scene_guid : RegionScene.table_scene_guid,
        gateway_id : RegionScene.gateway_id
    };
    var sceneMem = AuthService.myHttp(token,findSceneMember,'GET','device/scene/scene_members').then(function (data) {
        $scope.sceneMembers = data.content;
    })
    //选择场景成员
    $scope.selectSceneMem = function (item) {
        $scope.sceneMemChannel = [];
        for(var i=0;i<item.channel.length;i++){
            $scope.sceneMemChannel[i] = {};
            $scope.sceneMemChannel[i].channel_name = item.channel[i].channel_name;
            $scope.sceneMemChannel[i].channel_value = Math.round(item.channel[i].channel_value*100/255);
        }
        $scope.selectSceneMember = item;
    }
    //删除场景成员
    $scope.deleteSceneMember = function () {
        var deleteSceneMemData = {
            table_scene_members : [{
                "scene_addr" : RegionScene.scene_addr,
                "device_addr" : $scope.selectSceneMember.device_addr,
                "gateway_id":$scope.selectSceneMember.gateway_id
            }]
        };
        if($scope.selectSceneMember.device_addr == ''){
            toaster.pop({type: 'error', title: 'Error', body: 'Please Select Device', timeout: POPTIMEOUT});
        }else {
            $scope.deleteSceneProm = AuthService.myHttp(token,deleteSceneMemData,'DELETE','device/scene/scene_members').then(function (data) {
                if (data.code != '0') {
                    toaster.pop({type: 'error', title: 'Device', body: data.message, timeout: POPTIMEOUT});
                } else {
                    toaster.pop({type: 'success', title: 'Device', body: data.message, timeout: POPTIMEOUT});
                    $uibModalInstance.close();
                }
            })
        }
    }
    $scope.ok = function () {
        $uibModalInstance.close();
    };
})
/**
 * 添加区域配方控制器
 */
.controller('AddRecipeToRegionModalCtrl', function ($scope, $uibModalInstance,AuthService,$rootScope, toaster, POPTIMEOUT,$stateParams,$cookieStore,Region) {
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';
    var token = $cookieStore.get('token');

    //查询用户私有配方
    $scope.privateRecipeProm = AuthService.myHttp(token,{},'GET','recipe/userRecipe').then(function (result) {
        $scope.privateRecipeList = result.content;
    });
    //添加区域配方
    $scope.addRecipeToRegion = function (item) {
        var addRegionRecipeData = {
            'region_guid' : Region.region_guid,
            'private_recipe_id' : item.private_recipe_id
        }
        $scope.privateRecipeProm = AuthService.myHttp(token,addRegionRecipeData,'POST','recipe/addRegionRecipe').then(function (result) {
            if(result.code == '0'){
                toaster.pop({type: 'success', title: 'Success', body: result.message, timeout: POPTIMEOUT});
                $rootScope.$broadcast('addRegionRecipeSuucess');
            }else {
                toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
            }
        });
    }
    $scope.ok = function () {
        $uibModalInstance.close();
    };
})
/**
 * 执行区域配方控制器
 */
.controller('PlayRegionRecipeModalCtrl', function ($scope, $uibModalInstance,AuthService,$rootScope, toaster, POPTIMEOUT,$stateParams,regionRecipe,$cookieStore,Region) {
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';
    var token = $cookieStore.get('token');
    $scope.ok = function () {
        var startData = {
            'region_guid' : Region.region_guid,
            'gateway_id' : Region.gateway_id,
            'private_recipe_id' : regionRecipe.private_recipe_id
        }
        $scope.startRecipeProm = AuthService.myHttp(token,startData,'POST','recipe/private_start').then(function (result) {
            if(result.code == '0'){
                toaster.pop({type: 'success', title: 'Success', body: result.message, timeout: POPTIMEOUT});
                $rootScope.$broadcast('startRegionRecipeSuucess');
                $uibModalInstance.close();
            }else {
                toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
            }
        })
    };
    $scope.cancel = function () {
        $uibModalInstance.close();
    }
})
/**
* 停止区域配方控制器
*/
.controller('StopRegionRecipeModalCtrl', function ($scope, $uibModalInstance,AuthService,$rootScope, toaster, POPTIMEOUT,$stateParams,regionRecipe,$cookieStore,Region) {
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';
    var token = $cookieStore.get('token');
    $scope.ok = function () {
        var stopData = {
            'region_guid' : Region.region_guid,
            'gateway_id' : Region.gateway_id,
            'private_recipe_id' : regionRecipe.private_recipe_id
        }
        $scope.stopRecipeProm = AuthService.myHttp(token,stopData,'POST','recipe/private_stop').then(function (result) {
            if(result.code == '0'){
                toaster.pop({type: 'success', title: 'Success', body: result.message, timeout: POPTIMEOUT});
                $rootScope.$broadcast('stopRegionRecipeSuucess');
                $uibModalInstance.close();
            }else {
                toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
            }
        })
    };
    $scope.cancel = function () {
        $uibModalInstance.close();
    }
})
/**
 * 删除区域配方控制器
 */
.controller('DeleteRegionRecipeModalCtrl', function ($scope, $uibModalInstance,AuthService,$rootScope, toaster, POPTIMEOUT,$stateParams,regionRecipe,$cookieStore,Region) {
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';
    var token = $cookieStore.get('token');
    $scope.ok = function () {
        if(regionRecipe.status != '0'){
            toaster.pop({type: 'error', title: 'Error', body: 'Recipe is running, you must stop it first !', timeout: POPTIMEOUT});
        }else {
            var deleteRecipeData = {
                'private_recipe_index' : [{
                    'region_guid' : Region.region_guid,
                    'private_recipe_id' : regionRecipe.private_recipe_id
                }]
            }
            $scope.deleteRecipeProm = AuthService.myHttp(token,deleteRecipeData,'DELETE','region/recipe').then(function (result) {
                if(result.code == '0'){
                    toaster.pop({type: 'success', title: 'Success', body: result.message, timeout: POPTIMEOUT});
                    $rootScope.$broadcast('deleteRegionRecipeSuccess');
                    $uibModalInstance.close();
                }else {
                    toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
                }
            })
        }
    };
    $scope.cancel = function () {
        $uibModalInstance.close();
    }
})