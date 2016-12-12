angular.module('sntApp').controller('ConfirmCtrl',function ($scope, $uibModalInstance, AuthService,$stateParams, toaster, POPTIMEOUT,$rootScope) {
  
    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})