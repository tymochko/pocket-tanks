class Game {
    constructor(id, player1, player2, originalPoints, gameStatus) {
        this.id = id;
        this.player1 = player1;
        this.player2 = player2;
        this.points = originalPoints;
        this.gameStatus = gameStatus;
    }
}

module.exports.Game = Game;