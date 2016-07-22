module.exports.gameService = () => {
    let gameData = {};

    return {
        getGameData: (msg) => {
            gameData = msg;
            console.log(gameData, 'gameData');
        },

        putGameData: (paramX) => {
            return initGame(paramX);
        }
}};
