angular.module('sntApp').controller('SceneDeviceCtrl', function ($scope, $state, $stateParams, $rootScope, AuthService, $uibModal, $log, toaster, POPTIMEOUT,$cookieStore) {
    //查询区域场景
    var data = {
        region_guid: $stateParams.regionId,
        gateway_id: $stateParams.gatewayId
    };
    // 获取区域下的场景信息
    var token = $cookieStore.get('token');
    var sceneProm = AuthService.myHttp(token,data,'GET','region/scene').then(function (data) {
        if(data.code == '0' && data.content){
            $scope.scenesList = data.content;
        }else {
            $scope.scenesList = [];
        }
    });

    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '';
    $scope.backdrop = false;
    $scope.promise = null;
    $scope.templateUrl = './pages/custom-loading-template.html';

    $scope.controlScene = function (scene) {
        var controlSceneOnData = {
            "table_scene":[{
                "scene_guid": scene.table_scene_guid,
                "scene_addr": scene.scene_addr,
                "gateway_id" : scene.gateway_id,
                "scene_switch": "01"
            }]
        };
        $scope.controlSceneOnProm = AuthService.myHttp(token,controlSceneOnData,'PUT','device/scene/control').then(function (data) {
            if (data.code != '0') {
                toaster.pop({type: 'error', title: 'Scene', body: data.message, timeout: POPTIMEOUT});
            } else {
                toaster.pop({type: 'success', title: 'Scene', body: data.message, timeout: POPTIMEOUT});
            }
        })
    };
    
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
});