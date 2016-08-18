export function gameFinishedCtrl($scope, $uibModalInstance, win) {
    $scope.win = win ? 'WON' : 'LOST';
    $scope.ok = function() {
        $uibModalInstance.close();
        window.location = "/dashboard";
    };
    $scope.cancel = function() {
        $uibModalInstance.close();
        window.location = "/";
    };
}
