import gameService from './DataTravel';
import { initGame } from '../../models/tankShot';
import { initCanvas } from '../../models/initCanvas';

export function transportData(gameService, socket) {
    // gameService.getGameData(initGame());
    // gameService.putGameData(126);
    let canvasCont = initCanvas();
    console.log(socket);
    gameService(initGame(canvasCont.ctx, canvasCont.backCanvas, canvasCont.backCtx, socket));
}