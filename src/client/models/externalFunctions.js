import { canvasModel } from './canvasModel';
import { WIDTH, HEIGHT } from './externalVariables';

module.exports.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

export function getId(id) {
    return document.getElementById(id);
}

export const clear = (ctx) => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
};

export function clearAll(sky, ground, lightning, tank, bullet) {
    sky.clearRect(0, 0, WIDTH, HEIGHT);
    ground.clearRect(0, 0, WIDTH, HEIGHT);
    lightning.clearRect(0, 0, WIDTH, HEIGHT);
    tank.clearRect(0, 0, WIDTH, HEIGHT);
    bullet.clearRect(0, 0, WIDTH, HEIGHT);
}

export function fillBackground(ctx, pattern) {
    ctx.rect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = pattern;
    ctx.fill();
}

export const drawTanks = (callback, tank1, tank2, tankImage, weaponImage) => {
    canvasModel.getTank().ctx.clearRect(0, 0, WIDTH, HEIGHT);
    callback(tank1, tankImage, weaponImage);
    callback(tank2, tankImage, weaponImage);
};

export const allowTurn = (gameInst) => {
    let thisWindowPlayerId;
    let thisWindowPlayer;
    let thisWindowPlayerTurn;
    let siblingWindowPlayer;

    if (gameInst.player1.turn === true) {
        thisWindowPlayer = 'player1';
        siblingWindowPlayer= 'player2';
        thisWindowPlayerTurn = gameInst.player1.turn;
        thisWindowPlayerId = gameInst.player1.id;
    } else {
        thisWindowPlayer = 'player2';
        siblingWindowPlayer= 'player1';
        thisWindowPlayerTurn = gameInst.player2.turn;
        thisWindowPlayerId = gameInst.player2.id;
    }

    if (thisWindowPlayerTurn === true) {
        document.getElementById(thisWindowPlayer).style.color = 'red';
        return thisWindowPlayerId;
    }

    document.getElementById(siblingWindowPlayer).style.color = 'red';
    return null;
};

export const changeTurn = (playerTurn) => {
    if (playerTurn) {
        return false;
    }
    return true;
};
