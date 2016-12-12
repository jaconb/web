angular.module('sntApp').controller('RecipeConfigCtrl', function($scope, $state, AuthService, $rootScope, $uibModal, $stateParams, $log,$cookieStore){

        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = '';
        $scope.backdrop = false;
        $scope.promise = null;
        $scope.templateUrl = './pages/custom-loading-template.html';

        var token = $cookieStore.get('token');
        /**
         * 查询用户私有配方
         */
        $scope.privateRecipeProm = AuthService.myHttp(token,{},'GET','recipe/userRecipe').then(function (result) {
            if(result.code == '0' && result.content){
                $scope.privateRecipeList = result.content;
            }else {
                $scope.privateRecipeList = [];
            }
        });

        //下载成功后查询私有配方
        $rootScope.$on('CopyRecipeSuccess',function () {
            var privateRecipeProm = AuthService.myHttp(token,{},'GET','recipe/userRecipe').then(function (result) {
                if(result.code == '0' && result.content){
                    $scope.privateRecipeList = result.content;
                }else {
                    $scope.privateRecipeList = [];
                }
            });
        });

        //创建成功之后查询私有配方
        $rootScope.$on('AddRecipeSuccess',function () {
            var privateRecipeProm = AuthService.myHttp(token,{},'GET','recipe/userRecipe').then(function (result) {
                if(result.code == '0' && result.content){
                    $scope.privateRecipeList = result.content;
                }else {
                    $scope.privateRecipeList = [];
                }
            });
        });

        //删除成功后查询私有配方
        $rootScope.$on('deletePrivateRecipeSuccess',function () {
            var privateRecipeProm = AuthService.myHttp(token,{},'GET','recipe/userRecipe').then(function (result) {
                if(result.code == '0' && result.content){
                    $scope.privateRecipeList = result.content;
                }else {
                    $scope.privateRecipeList = [];
                }
            });
        });

        //重命名后查找私有配方
        $rootScope.$on('RenameRecipeSuccess',function () {
            var privateRecipeProm = AuthService.myHttp(token,{},'GET','recipe/userRecipe').then(function (result) {
                if(result.code == '0' && result.content){
                    $scope.privateRecipeList = result.content;
                }else {
                    $scope.privateRecipeList = [];
                }
            });
        });

        //删除配方数据后查找私有配方
        $rootScope.$on('DeleteRecipeDataSuccess',function () {
            var privateRecipeProm = AuthService.myHttp(token,{},'GET','recipe/userRecipe').then(function (result) {
                if(result.code == '0' && result.content){
                    $scope.privateRecipeList = result.content;
                }else {
                    $scope.privateRecipeList = [];
                }
            });
        });

        //添加配方数据后查找私有配方
        $rootScope.$on('AddRecipeDataSuccess',function () {
            var privateRecipeProm = AuthService.myHttp(token,{},'GET','recipe/userRecipe').then(function (result) {
                if(result.code == '0' && result.content){
                    $scope.privateRecipeList = result.content;
                }else {
                    $scope.privateRecipeList = [];
                }
            });
        });

        //修改配方数据后查找私有配方
        $rootScope.$on('EditRecipeDataSuccess',function () {
            var privateRecipeProm = AuthService.myHttp(token,{},'GET','recipe/userRecipe').then(function (result) {
                if(result.code == '0' && result.content){
                    $scope.privateRecipeList = result.content;
                }else {
                    $scope.privateRecipeList = [];
                }
            });
        });

        $scope.animationsEnabled = true;
        //添加配方弹窗:从云端下载配方到本地
        $scope.copyRecipeFromCloud = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'copyRecipe.html',
                controller: 'CopyRecipeModalCtrl'
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
            });
        };

        //添加配方弹窗:创建私有配方
        $scope.addRecipe = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'addRecipe.html',
                controller: 'AddRecipeModalCtrl'
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
            });
        };

        //配方详情弹窗
        $scope.recipeDetail = function (size,privateRecipes) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'recipeDetail.html',
                controller: 'RecipeDetailModalCtrl',
                size: size,
                resolve: {
                    privateRecipes: function () {
                        return privateRecipes;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
            });
        };
        //删除配方天数弹窗
        $scope.deleteDaysFromRecipe = function (size,privateRecipes) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'deleteDaysFromRecipe.html',
                controller: 'DeleteDaysFromRecipeModalCtrl',
                size: size,
                resolve: {
                    privateRecipes: function () {
                        return privateRecipes;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
            });
        };
        //增加配方天数配方天数弹窗
        $scope.addDaystoRecipe = function (size,privateRecipes) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'addDaysToRecipe.html',
                controller: 'AddDaysTORecipeModalCtrl',
                size: size,
                resolve: {
                    privateRecipes: function () {
                        return privateRecipes;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
            });
        };
        //修改配方数据弹窗
        $scope.editRecipeData = function (size,privateRecipes) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'editRecipeData.html',
                controller: 'EditRecipeDataModalCtrl',
                size: size,
                resolve: {
                    privateRecipes: function () {
                        return privateRecipes;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
            });
        };
        //删除私有配方
        $scope.deletePrivateRecipe = function (privateRecipes) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'deletePrivateRecipe.html',
                controller: 'DeleteRecipeModalCtrl',
                resolve: {
                    privateRecipes: function () {
                        return privateRecipes;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
            });
        }
        //修改配方名称
        $scope.renameRecipe = function (size,privateRecipes) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'renameRecipe.html',
                controller: 'RenameRecipeModalCtrl',
                size: size,
                resolve: {
                    privateRecipes: function () {
                        return privateRecipes;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
            });
        };
        //光配比
        $scope.LightRate = function (size,privateRecipes) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'lightRate.html',
                controller: 'LightRateModalCtrl',
                size: size,
                resolve: {
                    privateRecipes: function () {
                        return privateRecipes;
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
    })
    //添加配方弹窗控制器
    .controller('CopyRecipeModalCtrl', function ($scope, $uibModalInstance,AuthService,$rootScope, toaster, POPTIMEOUT,$cookieStore) {
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = '';
        $scope.backdrop = false;
        $scope.promise = null;
        $scope.templateUrl = './pages/custom-loading-template.html';
        var token = $cookieStore.get('token');
        //查询公有配方
        $scope.publicRecipeProm = AuthService.myHttp(token,{},'GET','recipe/publicRecipe').then(function (result) {
            if(result.code == '0' && result.content){
                $scope.publicRecipeList = result.content;
            }else {
                $scope.publicRecipeList = [];
            }
        });

        //下载公有配方
        $scope.copyPublicRecipe = function (item) {
            var copyData = {
                'public_recipe_id' : item.public_recipe_id
            }
            $scope.publicRecipeProm = AuthService.myHttp(token,copyData,'POST','recipe/addPrivateRecipe').then(function (result) {
                if(result.code == '0'){
                    toaster.pop({type: 'success', title: 'Success', body: result.message, timeout: POPTIMEOUT});
                    $rootScope.$broadcast('CopyRecipeSuccess')
                }else {
                    toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
                }
            })
        };
        $scope.ok = function () {
            $uibModalInstance.close();
        };
    })

    //创建私有配方配方弹窗控制器
    .controller('AddRecipeModalCtrl', function ($scope, $uibModalInstance,AuthService,$rootScope, toaster, POPTIMEOUT,$cookieStore) {
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = '';
        $scope.backdrop = false;
        $scope.promise = null;
        $scope.templateUrl = './pages/custom-loading-template.html';

        var token = $cookieStore.get('token');

        $scope.newRecipeName = '';

        $scope.ok = function () {
            var newRecipeData = {
                crop_name: $scope.newRecipeName
            }
            $scope.newRecipeProm = AuthService.myHttp(token,newRecipeData,'POST','recipe/addUserPecipeName').then(function (result) {
                if(result.code == '0'){
                    toaster.pop({type: 'success', title: 'Success', body: result.message, timeout: POPTIMEOUT});
                    $rootScope.$broadcast('AddRecipeSuccess');
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

    //配方详情弹窗控制器
    .controller('RecipeDetailModalCtrl', function ($scope, $uibModalInstance,AuthService,$rootScope, toaster, POPTIMEOUT,privateRecipes,$cookieStore) {

        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = '';
        $scope.backdrop = false;
        $scope.promise = null;
        $scope.templateUrl = './pages/custom-loading-template.html';

        var token = $cookieStore.get('token');

        $scope.recipeDetailName = privateRecipes.crop_name;

        // 查询配方详情
        var data = {
            'private_recipe_id' : privateRecipes.private_recipe_id
        }
        $scope.recipeInfoList = [];
        $scope.recipeDetailProm  = AuthService.myHttp(token,data,'GET','recipe/userRecipeDetil').then(function (result) {
            if(result.code == '0' && result.content){
                $scope.recipeInfoList = result.content;
            }else {
                $scope.recipeInfoList = [];
            }
        })

        $scope.ok = function () {
            $uibModalInstance.close();
        };
    })

    //删除配方天数弹窗控制器
    .controller('DeleteDaysFromRecipeModalCtrl', function ($scope, $uibModalInstance,AuthService,$rootScope, toaster, POPTIMEOUT,privateRecipes,$cookieStore) {

        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = '';
        $scope.backdrop = false;
        $scope.promise = null;
        $scope.templateUrl = './pages/custom-loading-template.html';

        var token = $cookieStore.get('token');

        $scope.recipeDetailName = privateRecipes.crop_name;

        $scope.my = {};
        $scope.fromRecipeDays = [];
        $scope.toRecipeDays = [];
        for(var i = 0; i< privateRecipes.days ; i++){
            $scope.fromRecipeDays[i] = {};
            $scope.toRecipeDays[i] = {};

            $scope.fromRecipeDays[i].day = i+1;
            $scope.toRecipeDays[i].day = i+1;
        }
        $scope.my.fromDay = $scope.fromRecipeDays[0];
        $scope.my.toDay = $scope.toRecipeDays[0];

        $scope.ok = function () {
            if($scope.my.fromDay.day > $scope.my.toDay.day){
                toaster.pop({type: 'error', title: 'Error', body: 'Error of select day', timeout: POPTIMEOUT});
            }else {
                var deleteRecipeDayData = {
                    'private_recipe_id': privateRecipes.private_recipe_id,
                    'start_day': ""+$scope.my.fromDay.day,
                    'end_day': ""+$scope.my.toDay.day
                }
                $scope.deleteRecipeDayProm = AuthService.myHttp(token,deleteRecipeDayData,'DELETE','recipe/dropUserBatchPrcipe').then(function (result) {
                    if(result.code == '0'){
                        toaster.pop({type: 'success', title: 'Success', body: result.message, timeout: POPTIMEOUT});
                        $rootScope.$broadcast('DeleteRecipeDataSuccess');
                        $uibModalInstance.close();
                    }else {
                        toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
                    }
                })
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    })

    //增加配方天数弹窗控制器
    .controller('AddDaysTORecipeModalCtrl', function ($scope, $uibModalInstance,AuthService,$rootScope, toaster, POPTIMEOUT,privateRecipes,$cookieStore) {
        // console.log('增加配方天数收到的配方信息',privateRecipes)
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = '';
        $scope.backdrop = false;
        $scope.promise = null;
        $scope.templateUrl = './pages/custom-loading-template.html';

        var token = $cookieStore.get('token');

        $scope.recipeDetailName = privateRecipes.crop_name;

        $scope.inputAddDaysData = false;
        $scope.addDaysFromDay = true;
        $scope.my = {};
        $scope.fromRecipeDays = [];
        if(!privateRecipes.days || privateRecipes.days.length == 0){
            $scope.fromRecipeDays = [
                {
                    day : '1'
                }
            ]
            $scope.my.fromDay = $scope.fromRecipeDays[0];
        }else {
            for(var i = 0; i< privateRecipes.days ; i++){
                $scope.fromRecipeDays[i] = {};
                $scope.fromRecipeDays[i].day = i+1;
            }
            $scope.my.fromDay = $scope.fromRecipeDays[0];
        }

        //提供用户选择时间段
        $scope.startTime = [
            {time : '0'},{time : '1'},{time : '2'},{time : '3'},{time : '4'},{time : '5'},{time : '6'},{time : '7'},{time : '8'},{time : '9'},{time : '10'},{time : '11'},{time : '12'},{time : '13'},{time : '14'},{time : '15'},{time : '16'},{time : '17'}
            ,{time : '18'},{time : '19'},{time : '20'},{time : '21'},{time : '22'},{time : '23'},{time : '24'}
        ]
        $scope.my.start_time = $scope.startTime[0];
        $scope.endTime = [
            {time : '0'},{time : '1'},{time : '2'},{time : '3'},{time : '4'},{time : '5'},{time : '6'},{time : '7'},{time : '8'},{time : '9'},{time : '10'},{time : '11'},{time : '12'},{time : '13'},{time : '14'},{time : '15'},{time : '16'},{time : '17'}
            ,{time : '18'},{time : '19'},{time : '20'},{time : '21'},{time : '22'},{time : '23'},{time : '24'}
        ]
        $scope.my.end_time = $scope.endTime[24];

        $scope.inputDays = '';
        $scope.addDays = function () {
            if($scope.inputDays == ''){
                toaster.pop({type: 'error', title: 'Error', body: 'Please input the days that you want to add', timeout: POPTIMEOUT});
            }else {
                $scope.inputAddDaysData = !$scope.inputAddDaysData;
                $scope.addDaysFromDay = !$scope.addDaysFromDay;
            }
        };
        $scope.back = function () {
            $scope.addDaysDataList = [];
            $scope.inputAddDaysData = !$scope.inputAddDaysData;
            $scope.addDaysFromDay = !$scope.addDaysFromDay;
        }

        $scope.substrate_PH_start = '';$scope.substrate_Conductivity_start = '';$scope.substrate_Temperature_start = '';$scope.ppfd_start = '';$scope.liquid_PH_start = '';
        $scope.substrate_Humidity_start = '';$scope.liquid_DOC_start = '';$scope.liquid_Conductivity_start = '';$scope.substrate_DOC_start = '';$scope.lai_start = '';$scope.carbon_Dioxide_start = '';
        $scope.illuminance_start = '';$scope.air_Temperature_start = '';$scope.air_Humidity_start = '';
        $scope.substrate_PH_end = '';$scope.substrate_Conductivity_end = '';$scope.substrate_Temperature_end = '';$scope.ppfd_end = '';$scope.liquid_PH_end = '';
        $scope.substrate_Humidity_end = '';$scope.liquid_DOC_end = '';$scope.liquid_Conductivity_end = '';$scope.substrate_DOC_end = '';$scope.lai_end = '';$scope.carbon_Dioxide_end = '';
        $scope.illuminance_end = '';$scope.air_Temperature_end = '';$scope.air_Humidity_end = '';
        $scope.addDaysDataList = [];
        $scope.addDataOk = function () {
            if(($scope.my.end_time.time - $scope.my.start_time.time) < 0){
                toaster.pop({type: 'error', title: 'Error', body: 'Error of the time select', timeout: POPTIMEOUT});
            }else if($scope.substrate_PH_start == '' || $scope.substrate_Conductivity_start == '' || $scope.substrate_Temperature_start == '' || $scope.ppfd_start == '' || $scope.liquid_PH_start == ''
                || $scope.substrate_Humidity_start == '' || $scope.liquid_DOC_start == '' || $scope.liquid_Conductivity_start == '' || $scope.substrate_DOC_start == '' || $scope.lai_start == ''
                || $scope.carbon_Dioxide_start == '' || $scope.illuminance_start == '' || $scope.air_Temperature_start == '' || $scope.air_Humidity_start == '' || $scope.substrate_PH_end == ''
                || $scope.substrate_Conductivity_end == '' || $scope.substrate_Temperature_end == '' || $scope.ppfd_end == '' || $scope.liquid_PH_end == '' || $scope.substrate_Humidity_end == ''
                || $scope.liquid_DOC_end == '' || $scope.liquid_Conductivity_end == '' || $scope.substrate_DOC_end == '' || $scope.lai_end == '' || $scope.carbon_Dioxide_end == ''
                || $scope.illuminance_end == '' || $scope.air_Temperature_end == '' || $scope.air_Humidity_end == ''){
                toaster.pop({type: 'error', title: 'Error', body: 'The data can not be null', timeout: POPTIMEOUT});
            }else {
                $scope.addDaysData = {};
                $scope.addDaysData.start_time = $scope.my.start_time.time;
                $scope.addDaysData.end_time = $scope.my.end_time.time;
                $scope.addDaysData.substrate_PH_start = $scope.substrate_PH_start;
                $scope.addDaysData.substrate_Conductivity_start  = $scope.substrate_Conductivity_start ;
                $scope.addDaysData.substrate_Temperature_start  = $scope.substrate_Temperature_start ;
                $scope.addDaysData.ppfd_start  = $scope.ppfd_start ;
                $scope.addDaysData.liquid_PH_start  = $scope.liquid_PH_start ;
                $scope.addDaysData.substrate_Humidity_start  = $scope.substrate_Humidity_start ;
                $scope.addDaysData.liquid_DOC_start  = $scope.liquid_DOC_start ;
                $scope.addDaysData.liquid_Conductivity_start  = $scope.liquid_Conductivity_start ;
                $scope.addDaysData.substrate_DOC_start  = $scope.substrate_DOC_start ;
                $scope.addDaysData.lai_start  = $scope.lai_start ;
                $scope.addDaysData.carbon_Dioxide_start  = $scope.carbon_Dioxide_start ;
                $scope.addDaysData.illuminance_start  = $scope.illuminance_start ;
                $scope.addDaysData.air_Temperature_start  = $scope.air_Temperature_start ;
                $scope.addDaysData.air_Humidity_start  = $scope.air_Humidity_start;

                $scope.addDaysData.substrate_PH_end = $scope.substrate_PH_end;
                $scope.addDaysData.substrate_Conductivity_end  = $scope.substrate_Conductivity_end ;
                $scope.addDaysData.substrate_Temperature_end  = $scope.substrate_Temperature_end ;
                $scope.addDaysData.ppfd_end  = $scope.ppfd_end ;
                $scope.addDaysData.liquid_PH_end  = $scope.liquid_PH_end ;
                $scope.addDaysData.substrate_Humidity_end  = $scope.substrate_Humidity_end ;
                $scope.addDaysData.liquid_DOC_end  = $scope.liquid_DOC_end ;
                $scope.addDaysData.liquid_Conductivity_end  = $scope.liquid_Conductivity_end ;
                $scope.addDaysData.substrate_DOC_end  = $scope.substrate_DOC_end ;
                $scope.addDaysData.lai_end  = $scope.lai_end ;
                $scope.addDaysData.carbon_Dioxide_end  = $scope.carbon_Dioxide_end ;
                $scope.addDaysData.illuminance_end  = $scope.illuminance_end ;
                $scope.addDaysData.air_Temperature_end  = $scope.air_Temperature_end ;
                $scope.addDaysData.air_Humidity_end  = $scope.air_Humidity_end;
                $scope.addDaysDataList.push($scope.addDaysData)
            }
        }

        $scope.ok = function () {
            if($scope.inputDays == '' || ""+$scope.my.fromDay.day == '' || $scope.addDaysDataList.length == 0){
                toaster.pop({type: 'error', title: 'Error', body: 'Please set data first', timeout: POPTIMEOUT});
            }else {
                var times = 0;
                for(var i = 0; i < $scope.addDaysDataList.length; i++){
                    var time = $scope.addDaysDataList[i].end_time - $scope.addDaysDataList[i].start_time;
                    times = time + times;
                }
                if(times != 24){
                    toaster.pop({type: 'error', title: 'Error', body: 'Error of 24h', timeout: POPTIMEOUT});
                }else {
                    var addDaysAndData = {
                        'days': $scope.inputDays,
                        'few_days': ""+$scope.my.fromDay.day,
                        'crop_name': $scope.recipeDetailName,
                        'private_recipe_id': privateRecipes.private_recipe_id,
                        'batchPrcipe': $scope.addDaysDataList
                    };
                    $scope.addDaysAndDataProm = AuthService.myHttp(token,addDaysAndData,'POST','recipe/addUserBatchPrcipe').then(function (result) {
                        if(result.code == '0'){
                            toaster.pop({type: 'success', title: 'Success', body: result.message, timeout: POPTIMEOUT});
                            $rootScope.$broadcast('AddRecipeDataSuccess');
                            $uibModalInstance.close();
                        }else {
                            toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
                        }
                    })
                }
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    })

    //修改配方数据弹窗控制器
    .controller('EditRecipeDataModalCtrl', function ($scope, $uibModalInstance,AuthService,$rootScope, toaster, POPTIMEOUT,privateRecipes,$cookieStore) {
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = '';
        $scope.backdrop = false;
        $scope.promise = null;
        $scope.templateUrl = './pages/custom-loading-template.html';

        var token = $cookieStore.get('token');

        $scope.recipeDetailName = privateRecipes.crop_name;

        $scope.my = {};
        //提供用户选择时间段
        $scope.startTime = [
            {time : '0'},{time : '1'},{time : '2'},{time : '3'},{time : '4'},{time : '5'},{time : '6'},{time : '7'},{time : '8'},{time : '9'},{time : '10'},{time : '11'},{time : '12'},{time : '13'},{time : '14'},{time : '15'},{time : '16'},{time : '17'}
            ,{time : '18'},{time : '19'},{time : '20'},{time : '21'},{time : '22'},{time : '23'},{time : '24'}
        ]
        $scope.my.start_time = $scope.startTime[0];
        $scope.endTime = [
            {time : '0'},{time : '1'},{time : '2'},{time : '3'},{time : '4'},{time : '5'},{time : '6'},{time : '7'},{time : '8'},{time : '9'},{time : '10'},{time : '11'},{time : '12'},{time : '13'},{time : '14'},{time : '15'},{time : '16'},{time : '17'}
            ,{time : '18'},{time : '19'},{time : '20'},{time : '21'},{time : '22'},{time : '23'},{time : '24'}
        ]
        $scope.my.end_time = $scope.endTime[24];


        $scope.inputEditRecipeData = false;
        $scope.editRecipeDays = true;
        $scope.fromRecipeDays = [];
        $scope.toRecipeDays = [];
        for(var i = 0; i< privateRecipes.days ; i++){
            $scope.fromRecipeDays[i] = {};
            $scope.toRecipeDays[i] = {};

            $scope.fromRecipeDays[i].day = i+1;
            $scope.toRecipeDays[i].day = i+1;
        }
        $scope.my.fromDay = $scope.fromRecipeDays[0];
        $scope.my.toDay = $scope.toRecipeDays[0];
        $scope.selectDay = function () {
            if(($scope.my.toDay.day - $scope.my.fromDay.day) < 0){
                toaster.pop({type: 'error', title: 'Error', body: 'Error of selecting time', timeout: POPTIMEOUT});
            }else {
                $scope.inputEditRecipeData = !$scope.inputEditRecipeData;
                $scope.editRecipeDays = !$scope.editRecipeDays;
            }
        }
        $scope.back = function () {
            $scope.addDaysDataList = [];
            $scope.inputEditRecipeData = !$scope.inputEditRecipeData;
            $scope.editRecipeDays = !$scope.editRecipeDays;
        }
        $scope.substrate_PH_start = '';$scope.substrate_Conductivity_start = '';$scope.substrate_Temperature_start = '';$scope.ppfd_start = '';$scope.liquid_PH_start = '';
        $scope.substrate_Humidity_start = '';$scope.liquid_DOC_start = '';$scope.liquid_Conductivity_start = '';$scope.substrate_DOC_start = '';$scope.lai_start = '';$scope.carbon_Dioxide_start = '';
        $scope.illuminance_start = '';$scope.air_Temperature_start = '';$scope.air_Humidity_start = '';
        $scope.substrate_PH_end = '';$scope.substrate_Conductivity_end = '';$scope.substrate_Temperature_end = '';$scope.ppfd_end = '';$scope.liquid_PH_end = '';
        $scope.substrate_Humidity_end = '';$scope.liquid_DOC_end = '';$scope.liquid_Conductivity_end = '';$scope.substrate_DOC_end = '';$scope.lai_end = '';$scope.carbon_Dioxide_end = '';
        $scope.illuminance_end = '';$scope.air_Temperature_end = '';$scope.air_Humidity_end = '';
        $scope.addDaysDataList = [];
        $scope.addDataOk = function () {
            if(($scope.my.end_time.time - $scope.my.start_time.time) < 0){
                toaster.pop({type: 'error', title: 'Error', body: 'Error of the time select', timeout: POPTIMEOUT});
            }else if($scope.substrate_PH_start == '' || $scope.substrate_Conductivity_start == '' || $scope.substrate_Temperature_start == '' || $scope.ppfd_start == '' || $scope.liquid_PH_start == ''
                || $scope.substrate_Humidity_start == '' || $scope.liquid_DOC_start == '' || $scope.liquid_Conductivity_start == '' || $scope.substrate_DOC_start == '' || $scope.lai_start == ''
                || $scope.carbon_Dioxide_start == '' || $scope.illuminance_start == '' || $scope.air_Temperature_start == '' || $scope.air_Humidity_start == '' || $scope.substrate_PH_end == ''
                || $scope.substrate_Conductivity_end == '' || $scope.substrate_Temperature_end == '' || $scope.ppfd_end == '' || $scope.liquid_PH_end == '' || $scope.substrate_Humidity_end == ''
                || $scope.liquid_DOC_end == '' || $scope.liquid_Conductivity_end == '' || $scope.substrate_DOC_end == '' || $scope.lai_end == '' || $scope.carbon_Dioxide_end == ''
                || $scope.illuminance_end == '' || $scope.air_Temperature_end == '' || $scope.air_Humidity_end == ''){
                toaster.pop({type: 'error', title: 'Error', body: 'The data can not be null', timeout: POPTIMEOUT});
            }else {
                $scope.addDaysData = {};
                $scope.addDaysData.start_time = $scope.my.start_time.time;
                $scope.addDaysData.end_time = $scope.my.end_time.time;
                $scope.addDaysData.substrate_PH_start = $scope.substrate_PH_start;
                $scope.addDaysData.substrate_Conductivity_start  = $scope.substrate_Conductivity_start ;
                $scope.addDaysData.substrate_Temperature_start  = $scope.substrate_Temperature_start ;
                $scope.addDaysData.ppfd_start  = $scope.ppfd_start ;
                $scope.addDaysData.liquid_PH_start  = $scope.liquid_PH_start ;
                $scope.addDaysData.substrate_Humidity_start  = $scope.substrate_Humidity_start ;
                $scope.addDaysData.liquid_DOC_start  = $scope.liquid_DOC_start ;
                $scope.addDaysData.liquid_Conductivity_start  = $scope.liquid_Conductivity_start ;
                $scope.addDaysData.substrate_DOC_start  = $scope.substrate_DOC_start ;
                $scope.addDaysData.lai_start  = $scope.lai_start ;
                $scope.addDaysData.carbon_Dioxide_start  = $scope.carbon_Dioxide_start ;
                $scope.addDaysData.illuminance_start  = $scope.illuminance_start ;
                $scope.addDaysData.air_Temperature_start  = $scope.air_Temperature_start ;
                $scope.addDaysData.air_Humidity_start  = $scope.air_Humidity_start;

                $scope.addDaysData.substrate_PH_end = $scope.substrate_PH_end;
                $scope.addDaysData.substrate_Conductivity_end  = $scope.substrate_Conductivity_end ;
                $scope.addDaysData.substrate_Temperature_end  = $scope.substrate_Temperature_end ;
                $scope.addDaysData.ppfd_end  = $scope.ppfd_end ;
                $scope.addDaysData.liquid_PH_end  = $scope.liquid_PH_end ;
                $scope.addDaysData.substrate_Humidity_end  = $scope.substrate_Humidity_end ;
                $scope.addDaysData.liquid_DOC_end  = $scope.liquid_DOC_end ;
                $scope.addDaysData.liquid_Conductivity_end  = $scope.liquid_Conductivity_end ;
                $scope.addDaysData.substrate_DOC_end  = $scope.substrate_DOC_end ;
                $scope.addDaysData.lai_end  = $scope.lai_end ;
                $scope.addDaysData.carbon_Dioxide_end  = $scope.carbon_Dioxide_end ;
                $scope.addDaysData.illuminance_end  = $scope.illuminance_end ;
                $scope.addDaysData.air_Temperature_end  = $scope.air_Temperature_end ;
                $scope.addDaysData.air_Humidity_end  = $scope.air_Humidity_end;
                $scope.addDaysDataList.push($scope.addDaysData)
            }
        }
        
        $scope.ok = function () {
            var times = 0;
            for(var i = 0; i < $scope.addDaysDataList.length; i++){
                var time = $scope.addDaysDataList[i].end_time - $scope.addDaysDataList[i].start_time;
                times = time + times;
            }
            if(times < 24){
                toaster.pop({type: 'error', title: 'Error', body: 'Less than 24h', timeout: POPTIMEOUT});
            }else {
                var addDaysAndData = {
                    'end_day': ""+$scope.my.toDay.day,
                    'start_day': ""+$scope.my.fromDay.day,
                    'crop_name': $scope.recipeDetailName,
                    'private_recipe_id': privateRecipes.private_recipe_id,
                    'batchPrcipe': $scope.addDaysDataList
                };
                $scope.addDaysAndDataProm = AuthService.myHttp(token,addDaysAndData,'PUT','recipe/modifyUserBatchPrcipeData').then(function (result) {
                    if(result.code == '0'){
                        toaster.pop({type: 'success', title: 'Success', body: result.message, timeout: POPTIMEOUT});
                        $rootScope.$broadcast('EditRecipeDataSuccess');
                        $uibModalInstance.close();
                    }else {
                        toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
                    }
                })
            }
        }
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    })

    //删除配方弹窗控制
    .controller('DeleteRecipeModalCtrl', function ($scope, $uibModalInstance,AuthService,$rootScope, toaster, POPTIMEOUT,privateRecipes,$cookieStore) {
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = '';
        $scope.backdrop = false;
        $scope.promise = null;
        $scope.templateUrl = './pages/custom-loading-template.html';

        var token = $cookieStore.get('token');

        $scope.recipeDetailName = privateRecipes.crop_name;

        $scope.ok = function () {
            var deleteRecipeData = {
                'private_recipe_id': privateRecipes.private_recipe_id,
                'id': ''
            }
            $scope.deleteRecipeProm = AuthService.myHttp(token,deleteRecipeData,'DELETE','recipe/dropUserRecipe').then(function (result) {
                if(result.code == '0'){
                    toaster.pop({type: 'success', title: 'Success', body: result.message, timeout: POPTIMEOUT});
                    $rootScope.$broadcast('deletePrivateRecipeSuccess');
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

    //配方重命名弹窗控制
    .controller('RenameRecipeModalCtrl', function ($scope, $uibModalInstance,AuthService,$rootScope, toaster, POPTIMEOUT,privateRecipes,$cookieStore) {
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = '';
        $scope.backdrop = false;
        $scope.promise = null;
        $scope.templateUrl = './pages/custom-loading-template.html';

        var token = $cookieStore.get('token');

        $scope.recipeDetailName = privateRecipes.crop_name;

        $scope.ok = function () {
            var renameRecipeData = {
                'private_recipe_id': privateRecipes.private_recipe_id,
                'crop_name': $scope.recipeDetailName
            }
            $scope.renameRecipeProm = AuthService.myHttp(token,renameRecipeData,'PUT','recipe/modifyUserRecipeName').then(function (result) {
                if(result.code == '0'){
                    toaster.pop({type: 'success', title: 'Success', body: result.message, timeout: POPTIMEOUT});
                    $rootScope.$broadcast('RenameRecipeSuccess');
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

    //光配比弹窗控制器
    .controller('LightRateModalCtrl',function ($scope, $uibModalInstance,AuthService,$rootScope, toaster, POPTIMEOUT,privateRecipes,$cookieStore) {
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = '';
        $scope.backdrop = false;
        $scope.promise = null;
        $scope.templateUrl = './pages/custom-loading-template.html';
        var token = $cookieStore.get('token');
        //获取该配方对应的公有配方id,若是自建信息,则提示用户为自定义配方.
        var findPublicRecipeDevice = {
            'private_recipe_id' : privateRecipes.private_recipe_id
        }
        $scope.findPublicRecipeDeviceProm = AuthService.myHttp(token,findPublicRecipeDevice,'GET','recipe/getPublicRecipeDeviceDescription').then(function (result) {
            $scope.publicRecipeDeviceList = result.content;
        })

        $scope.channelFour = false;//选择四个通道的显示页面
        $scope.nextBtnShow = true;
        $scope.my = {};
        $scope.totals = [{'num' : '4'}];
        $scope.channelItems1 = [{'channel' : 'DeepRed'}];
        $scope.channelItems2 = [{'channel' : 'Blue'}];
        $scope.channelItems3 = [{'channel' : 'FarRed'}];
        $scope.channelItems4 = [{'channel' : 'White'}];
        $scope.my.total = $scope.totals[0];
        $scope.my.fourChannel1 = $scope.channelItems1[0];$scope.my.fourChannel2 = $scope.channelItems2[0];$scope.my.fourChannel3 = $scope.channelItems3[0];$scope.my.fourChannel4 = $scope.channelItems4[0];
        $scope.fourChannelRate1 = '';$scope.fourChannelRate2 = '';$scope.fourChannelRate3 = '';$scope.fourChannelRate4 = '';
        $scope.recipeDetailName = privateRecipes.crop_name;
        $scope.channelTotal = '';
        $scope.next = function () {
            $scope.channelTotal = $scope.my.total.num;
            $scope.nextBtnShow = false;
            $scope.channelFour = true;
        };
        $scope.back = function () {
            $scope.channelFour = false;
            $scope.nextBtnShow = true;
            $scope.fourChannelRate1 = '';$scope.fourChannelRate2 = '';$scope.fourChannelRate3 = '';$scope.fourChannelRate4 = '';
        }
        
        $scope.ok = function () {
            if($scope.fourChannelRate1 == '' || $scope.fourChannelRate2 == '' || $scope.fourChannelRate3 == '' || $scope.fourChannelRate4 == ''){
                toaster.pop({type: 'error', title: 'Error', body: 'Please select channel and set the light intensity first . ', timeout: POPTIMEOUT});
            }else if(!/^\d+$/.test($scope.fourChannelRate1) || !/^\d+$/.test($scope.fourChannelRate2) || !/^\d+$/.test($scope.fourChannelRate3) || !/^\d+$/.test($scope.fourChannelRate4)){
                toaster.pop({type: 'error', title: 'Error', body: 'The format of the light intensity must be number .', timeout: POPTIMEOUT});
            }else {
                var modifyRecipeDeviceData = {
                    'private_recipe_id' : privateRecipes.private_recipe_id,
                    'light_intensity' : {
                        'DeepRed' : $scope.fourChannelRate1,
                        'Blue' : $scope.fourChannelRate2,
                        'FarRed' : $scope.fourChannelRate3,
                        'White' : $scope.fourChannelRate4
                    }
                }
                $scope.modifyRecipeDeviceProm = AuthService.myHttp(token,modifyRecipeDeviceData,'PUT','recipe/modifyPrivateRecipeDevice').then(function (result) {
                    if(result.code == '0'){
                        toaster.pop({type: 'success', title: 'Success', body: result.message, timeout: POPTIMEOUT});
                    }else {
                        toaster.pop({type: 'error', title: 'Error', body: result.message, timeout: POPTIMEOUT});
                    }
                })
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    })