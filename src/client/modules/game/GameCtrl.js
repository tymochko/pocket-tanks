import gameService from './DataTravel';
import { initGame } from '../../models/tankShot';
import { initCanvas } from '../../models/initCanvas';
import { canvasModel } from '../../models/canvasModel';

export function transportData(gameService) {
    // gameService.getGameData(initGame());
    // gameService.putGameData(126);
    initCanvas();
    
    gameService(initGame(canvasModel.getGround().canvas, canvasModel.getGround().ctx));
}