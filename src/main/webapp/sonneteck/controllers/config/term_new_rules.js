angular.module('sntApp').controller('termNewRuleCtrl', function($scope, $state,AuthService,$rootScope) {

    var user_id = $rootScope.user_id;
    // //获取当前控制集合下的条件
    // var findCdtsConditionsData = {
    //     "account_id":"",
    //     "cdts_list_guid":$rootScope.termDetailCdtsGuid,
    //     "gateway_id":$rootScope.termDetailCdtsGatewayId
    // }
    // var cdtsConditionsProm = AuthService.myHttp(findCdtsConditionsData,'GET','term');
    // cdtsConditionsProm.then(function (data) {
    //     log(data)
    //     var content = data.content;
    //     $scope.conditions = content.conditions;
    //     log($scope.conditions)
    // })

    //获取用户的传感器设备
    var findDevice = {};
    findDevice.user_id = user_id;
    findDevice.region_guid = $rootScope.ToRegionSetRegionGuid;
    findDevice.gateway_id = $rootScope.ToRegionSetGatewayId;
    // findDevice.gateway_id = "158d000052c779";
        var device = AuthService.myHttp(findDevice,'GET','region/device');
        device.then(function (data) {
            log(data);
            $scope.deviceInfo = data.content;//已经包含了通道值
        })

    //选择的传感器
    $scope.selectSensorData = function (item) {
        log(item)
        $scope.device_guid = item.device_guid;
        $scope.sensorChannelData = item.channel;
    }

    //选择的通道信息
    $scope.selectSensorChannel = function (item) {
        log(item);
        $scope.sensorChannelGatewayId = item.gateway_id;
        $scope.sensorChannelClass = item.channel_class;
        $scope.sensorChannelType = item.channel_type;
        $scope.sensorChannelBitNumber = item.channel_bit_num;
        $scope.sensorDeviceGuid = item.table_device_guid;
    }

    //添加条件到条件控制集合
    $scope.sensor_channel_value ="";
    $scope.addCondition = function () {
        var termDetailData = $rootScope.termDetailData;
        var conditionsData = {
            "user_id":user_id,
            "table_conditons":
                [{"cdts_list_guid":termDetailData.cdts_list_guid,
                    "gateway_id":$scope.sensorChannelGatewayId,
                    "table_device_guid":$scope.sensorDeviceGuid,
                    "channel_class":$scope.sensorChannelClass,
                    "channel_type":$scope.sensorChannelType,
                    "channel_bit_num":$scope.sensorChannelBitNumber,
                    "compare_val":$scope.sensor_channel_value,
                    "offset_val":"0"}]
        }
        log(conditionsData)
        var addConditionProm = AuthService.myHttp(conditionsData,'POST','device/term/conditions');
        addConditionProm.then(function (data) {
            log(data)
            alert(data.message);
        })
    }
})
