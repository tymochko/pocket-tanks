export const finishGameModal = (socket, $uibModal, $translate) => {
    socket.on('finish-game', (data) => {
        if (data.win === localStorage.getItem('playerId')) {
            const win = true;
            $uibModal.open({
                templateUrl: 'game/gameFinishedWindow.html',
                controller: 'gameFinishedCtrl',
                resolve: {
                    win: () => {
                        return win;
                    }
                }
            });
        } else if (data.looser === localStorage.getItem('playerId')) {
            const win = false;
            $uibModal.open({
                templateUrl: 'game/gameFinishedWindow.html',
                controller: 'gameFinishedCtrl',
                resolve: {
                    win: () => {
                        return win;
                    }
                }
            });
        }
    });
}
