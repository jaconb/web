angular.module('sntApp').controller('RegionalDetailCtrl', function ($scope, $state, $rootScope, $stateParams, AuthService, toaster, POPTIMEOUT,$uibModal,$cookieStore) {
        var regionId = $stateParams.regionId;
        var gatewayId = $stateParams.gatewayId;
        $scope.regionName = $stateParams.regionName;
        var token = $cookieStore.get('token');
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = '';
        $scope.backdrop = false;
        $scope.promise = null;
        $scope.templateUrl = './pages/custom-loading-template.html';

        //实时监控
        $scope.toRVC = function () {
            var version = navigator.userAgent;
            if(version.indexOf('Trident') > -1){
                window.open("https://www.dahuap2p.com");
            }else {
                //如果不是IE浏览器,弹窗提示
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'ToRvc.html',
                    controller: 'ToRvcModalCtrl'
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                });
            }
        };

        /**
         * 区域详情实时数据
         */
        var findRealTimeData = {
            region_guid : regionId,
            gateway_id : gatewayId,
            type : 'nows',
            size : '1'
        };
        $scope.sensorRealDataProm = AuthService.myHttp(token,findRealTimeData,'GET','sensor/nowData').then(function (data) {
            if(data.code == '0' && data.content){
                $scope.sensorRealData = data.content[0];
            }else {
                toaster.pop({type: 'error', title: 'Error', body: data.message, timeout: POPTIMEOUT});
            }
        });
        $scope.refreshData = function () {
            $scope.sensorRealDataProm = AuthService.myHttp(token,findRealTimeData,'GET','sensor/nowData').then(function (data) {
                if(data.code == '0' && data.content){
                    $scope.sensorRealData = data.content[0];
                }else {
                    toaster.pop({type: 'error', title: 'Error', body: data.message, timeout: POPTIMEOUT});
                }
            });
        };
    })
    .controller('ToRvcModalCtrl',function ($scope, $uibModalInstance, AuthService,$stateParams, toaster, POPTIMEOUT,$rootScope,$state) {
        $scope.ok = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
