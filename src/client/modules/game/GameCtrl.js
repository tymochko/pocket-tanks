import { initGame } from '../../models/tankShot';
import { initCanvas } from '../../models/initCanvas';
import { canvasModel } from '../../models/canvasModel';

export function transportData(socket, $http) {
    console.log('HELLO');
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    
    // getParameterByName(id, );
    
    $http.get('/api/users/game?id');

    initCanvas();
    initGame(canvasModel.getGround().canvas, canvasModel.getGround().ctx, socket);
}
