export function gameFinishedCtrl($scope, $uibModalInstance, win, $translate) {
    // if (win.win === localStorage.getItem('playerId')) {
    //     $scope.win = 'WON';
    // } else if (win.looser === localStorage.getItem('playerId')) {
    //     $scope.win = 'LOST';
    // }
    $scope.win = win ? 'WON' : 'LOST';
    $scope.ok = function() {
        $uibModalInstance.close();
        window.location.href = "/dashboard";
    };
    $scope.cancel = function() {
        $uibModalInstance.close();
        window.location = "/";
    };
}
