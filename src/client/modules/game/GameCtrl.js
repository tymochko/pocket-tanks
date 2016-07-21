export class GameCtrl {
    constructor (notify) {
        const dataCoords = initGame();
        notify(dataCoords);
    }
}