import { Game } from '../../models/gameModel';
import { Tank } from '../../models/tankModel';
import { Player } from '../../models/playerModel';
import { ground } from  '../../models/groundModel';

const getRandomPos = (a, b) => {
    return Math.floor((Math.random() * a) + b);
};

export const gameCreate = (gameData) => {
    ground.setGround(gameData.originalPoints);
    const player1Id = gameData.player1.id;
    const player2Id = gameData.player2.id;

    const tank1 = new Tank(player1Id, getRandomPos(333, 33));
    const tank2 = new Tank(player2Id, getRandomPos(333, 444));

    const player1 = new Player(player1Id, true, tank1);
    const player2 = new Player(player2Id, false, tank2);

    const gameStatus = true;

    return (new Game(gameData._id, player1, player2, gameData.originalPoints, gameStatus));
};
