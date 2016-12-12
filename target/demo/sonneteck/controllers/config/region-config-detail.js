angular.module('sntApp').controller('RegionConfigDetailCtrl', function($scope, $state, AuthService, $rootScope, $uibModal, $log,$stateParams, toaster, POPTIMEOUT,$cookieStore) {

    var ToRegionSetRegionGuid = $stateParams.ToRegionSetRegionGuid;
    var ToRegionSetGatewayId = $stateParams.ToRegionSetGatewayId;
    var ToRegionSetRegionAddr = $stateParams.ToRegionSetRegionAddr;
    $scope.ToRegionSetRegionName = $stateParams.ToRegionSetRegionName;
    var token = $cookieStore.get('token');
    //加载提示
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = '';
        $scope.backdrop = false;
        $scope.promise = null;
        $scope.templateUrl = './pages/custom-loading-template.html';


    $scope.RegionalDeviceCurrentPage = 5;
    $scope.DeviceCurrentPage = 5;
    $scope.RegionalDeviceMaxSize = 1;
    $scope.DeviceMaxSize = 1;
    $scope.RegionalDeviceTotalItems = 1;

    $scope.animationsEnabled = true;



    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
})

