export const endGameModal = (socket, $uibModal) => {
    socket.on('end-game-modal', (gameInst) => {
        $uibModal.open({
            templateUrl: 'game/endGameRequest.html',
            controller: 'confirmCtrl',
            resolve: {
                gameInst() {
                    return gameInst;
                }
            }
        });
    });
};
