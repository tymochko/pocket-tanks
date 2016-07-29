export class Game {
    constructor (idGame, Player1, Player2, originalPoints) {
        this.idGame = idGame;
        this.Player1 = Player1;
        this.Player2 = Player2;
        this.originalPoints = originalPoints;
        this.gameComplete = false;
    }
    
}