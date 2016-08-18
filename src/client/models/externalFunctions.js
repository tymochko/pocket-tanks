import { canvasModel } from './canvasModel';
import { WIDTH, HEIGHT, FULL_LIFE } from './externalVariables';

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

export const getTurnId = (gameInst) => {
    let thisWindowPlayerId;
    let thisWindowPlayer;
    let siblingWindowPlayer;

    if (gameInst.player1.turn) {
        thisWindowPlayer = 'player1';
        siblingWindowPlayer= 'player2';
        thisWindowPlayerId = gameInst.player1.id;
    } else {
        thisWindowPlayer = 'player2';
        siblingWindowPlayer= 'player1';
        thisWindowPlayerId = gameInst.player2.id;
    }
    document.getElementById(thisWindowPlayer).style.color = 'red';
    document.getElementById(siblingWindowPlayer).style.color = 'black';
    return thisWindowPlayerId;
};

export const drawLifeBar = (player, life) => {
    const step = 100 / FULL_LIFE;
    const number = (player === 'player1') ? '1' : '2';
    getId(`lifeBar${number}`).style.width = `${step * life}%`;
};

export const drawLifeBars = (data) => {
    const step = 100 / FULL_LIFE;
    getId('lifeBar1').style.width = `${step * data.player1.life}%`;
    getId('lifeBar2').style.width = `${step * data.player2.life}%`;
};

export const updateLife = (player, data, socket) => {
    data[player].life -= 1;
    drawLifeBar(player, data[player].life);
    if (data[player].life === 0) {
        data.gameStatus = false;
        const enemy = (player === 'player1') ? 'player2' : 'player1';
        socket.emit('finish-game-request', { win: data[player].id, looser: data[enemy].id, gameData: data});
    }
};
