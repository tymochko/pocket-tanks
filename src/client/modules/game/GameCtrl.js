import { initGame } from '../../models/tankShot';
import { initCanvas } from '../../models/initCanvas';
import { gameCreate } from './gameFunc';
import { gameService } from './gameService';

export function transportData(socket, $q) {
    const localUrl = window.location.href;

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    const gameId = getParameterByName('id', localUrl);
    gameService().getInitGameData(socket, $q, gameId)
        .then((gameData) => {
            console.log(gameData, 'gameData inside GameCtrl');
            const gameInst = gameCreate(gameData);

            console.log('gameInst: ', gameInst);
            initCanvas();
            initGame(gameInst, socket);
        }, () => {
            alert('Server error. No game data received.');
        });
}
