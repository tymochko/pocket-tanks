import gameService from './DataTravel';
import { initGame } from '../../models/tankShot';
import { initCanvas } from '../../models/initCanvas';
import { canvasModel } from '../../models/canvasModel';
import externalVariables from '../../models/externalVariables';

export function transportData(gameService) {
    initCanvas();
    
    gameService(initGame(canvasModel.getGround().canvas, canvasModel.getGround().ctx));
}