import { canvasModel } from './canvasModel';
import { WIDTH, HEIGHT } from './externalVariables';

module.exports.requestAnimFrame = (function(){
    return window.requestAnimationFrame   ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(callback){
        window.setTimeout(callback, 1000 / 60);
    };
})();

export function getId(id) {
    return document.getElementById(id);
}

export function clear(ctx) {
    // let ctx = canvasModel.getCtx().ctx;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

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

export const initTanks = (callback, tank1, tank2, tankImage, weaponImage, weaponAngle) => {
    canvasModel.getTank().ctx.clearRect(0, 0, WIDTH, HEIGHT);
    callback(tank1.id, tank1, tankImage, weaponImage, weaponAngle);
    callback(tank2.id, tank2, tankImage, weaponImage, weaponAngle);
};
