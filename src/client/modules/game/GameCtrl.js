import gameService from './DataTravel';
import { initGame } from '../../models/tankShot';

export function transportData(gameService) {
    // gameService.getGameData(initGame());
    // gameService.putGameData(126);
    gameService(initGame());
}