import gameService from './DataTravel';
import { initGame } from '../../models/tankShot';
import { initCanvas } from '../../models/initCanvas';

export function transportData(gameService) {
    // gameService.getGameData(initGame());
    // gameService.putGameData(126);
    let canvasCont = initCanvas();
    gameService(initGame(canvasCont.ctx, canvasCont.backCanvas, canvasCont.backCtx));
}