import { initGame } from '../../models/tankShot';
import { initCanvas } from '../../models/initCanvas';
import { canvasModel } from '../../models/canvasModel';
import { gameService } from './gameService';

export function transportData(socket) {
    initCanvas();
    initGame(canvasModel.getGround().canvas, canvasModel.getGround().ctx, socket);
}
