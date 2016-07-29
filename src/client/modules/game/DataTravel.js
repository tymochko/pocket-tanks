export function gameService (socket) {
    
    return {
        
        getGameData: function (usersData) {
            socket.emit('set game data', {
                Player1: usersData.this_user,
                Player2: usersData.other_user
            });
        },

        putGameData: function () {
            socket.on('put game data', (data) => {
                return data;
            });
        }
    }
}