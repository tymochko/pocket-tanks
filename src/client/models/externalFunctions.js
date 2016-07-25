import { canvasModel } from './canvasModel';
import { WIDTH } from './externalVariables';
import { HEIGHT } from './externalVariables';

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

export function getId (id) {
    return document.getElementById(id);
}

export function clear(ctx) {
    // let ctx = canvasModel.getCtx().ctx;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

export function clearAll(sky, ground, lightning, tank, bullet) {
    sky.clearRect(0, 0, WIDTH, HEIGHT);
    ground.ctx.clearRect(0, 0, WIDTH, HEIGHT);
    lightning.clearRect(0, 0, WIDTH, HEIGHT);
    tank.clearRect(0, 0, WIDTH, HEIGHT);
    bullet.clearRect(0, 0, WIDTH, HEIGHT);
}

export function fillBackground(ctx, pattern) {
    ctx.rect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = pattern;
    ctx.fill();
}
