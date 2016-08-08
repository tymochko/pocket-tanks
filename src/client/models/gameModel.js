class Game {
    constructor(id, player1, player2, originalPoints) {
        this.id = id;
        this.player1 = player1;
        this.player2 = player2;
        this.points = originalPoints;
    }
}

module.exports.Game = Game;




// gameObj;
// let player1 = new Player(gameObj.player1);
// let player2 = gameObj.player2;
//
// let game = new Game(player1, player2, oP);
