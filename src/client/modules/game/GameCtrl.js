import { initGame } from '../../models/tankShot';
import { initCanvas } from '../../models/initCanvas';
import { canvasModel } from '../../models/canvasModel';

export function transportData(gameService, socket) {
    initCanvas();
    
    gameService(initGame(canvasModel.getGround().canvas, canvasModel.getGround().ctx, socket));
}