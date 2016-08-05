import {Game} from '../../models/gameModel';
import {Tank} from  '../../models/tankModel';
import {Player} from  '../../models/playerModel';

export const gameCreate = (gameData) => {
    let player1 = new Player(gameData.player1);
    let player2 = new Player(gameData.player2, false);
    let game = new Game(player1, player2, gameData.originalPoints);
    return game;
    
};
