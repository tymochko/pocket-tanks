import { Tank } from './tankModel';

class Player {
    constructor(id, turn, tank = new Tank(), life, win = 0, lose = 0) {
        this.id = id;
        this.tank = tank;
        this.life = life;
        this.lose = lose;
        this.win = win;
        this.turn = turn;
    }
}

module.exports.Player = Player;
