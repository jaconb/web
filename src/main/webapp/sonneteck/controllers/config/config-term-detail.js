angular.module('sntApp').controller('ConfigTermDetail', function($scope, $state,AuthService,$rootScope) {
    $scope.toNewRules = function() {
        $state.go('index.config.term.newRules');
    }
    $scope.toNewActions = function() {
        $state.go('index.config.term.newActions');
    }
    //详情页获取条件控制集合信息
    $scope.TermDetailData = $rootScope.termDetailData;
    log($scope.TermDetailData);

    // //从条件控制集合中取出条件信息
    // $scope.termDetailConditionsData = $scope.TermDetailData.conditions;
    // log($scope.termDetailConditionsData);
    //
    // //从条件控制集合中取出控制序列信息
    // $scope.termDetailSequenceData = $scope.TermDetailData.ctrl_sequence;
    // log($scope.termDetailSequenceData);
    //
    // //从控制序列信息中取出控制信息
    // $scope.termDetailCtrlData = $scope.termDetailSequenceData.control;
    // log($scope.termDetailCtrlData)


    // //删除配方
    // var deleteTermData = {};
    // deleteTermData.user_id = $rootScope.user_id;
    // deleteTermData.term_id = $rootScope.termDetailCdtsGuid;
    // log(deleteTermData);
    // var deleteTermProm = AuthService.myHttp(deleteTermData,'DELETE','term');
    // deleteTermProm.then(function (data) {
    //     log(data)
    // })
})