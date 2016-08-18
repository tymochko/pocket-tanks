export const confirmCtrl = ($scope, $uibModalInstance, gameInst, socket, $translate) => {
    $scope.ok = function() {
        $uibModalInstance.close();
        socket.emit('end-game-ok', gameInst);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
};
