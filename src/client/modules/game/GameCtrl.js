import { initGame } from '../../models/tankShot';
import { initCanvas } from '../../models/initCanvas';
import { canvasModel } from '../../models/canvasModel';
import { game } from '../../models/gameModel';
import { gameService } from '../game/DataTravel';

export function transportData(socket) {

    const users = gameService.users;
    console.log(users, 'users');

    game(123123, 456456);

    initCanvas();
    initGame(canvasModel.getGround().canvas, canvasModel.getGround().ctx, socket);
}
