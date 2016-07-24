import { canvasModel } from './canvasModel';
import externalVariables from './externalVariables';
const WIDTH = externalVariables.WIDTH,
    HEIGHT = externalVariables.HEIGHT;

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

export function clear() {
    let ctx = canvasModel.getCtx().ctx;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

export function fillBackground(ctx, pattern) {
    ctx.rect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = pattern;
    ctx.fill();
};
