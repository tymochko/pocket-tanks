import { Tank } from './tankModel';

class Player {
    constructor(id, turn, tank = new Tank(), life = 2) {
        this.id = id;
        this.tank = tank;
        this.life = life;
        this.turn = turn;
    }
}

module.exports.Player = Player;
