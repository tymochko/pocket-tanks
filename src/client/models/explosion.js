import { DAMAGERADIUS } from './externalVariables';
import { canvasModel } from './canvasModel';
import { clear } from './externalFunctions';

var xSprite = 0;
var sprite = new Image();
sprite.src = './public/images/explosion_sheet.png';
let explosionX,
    explosionY,
    tankX,
    tankY,
    ctx;

var xExplosion;
var yExplosion;

export function tick(crossPointX, crossPointY, tankCoordsX, tankCoordsY){

    explosionX = crossPointX;
    explosionY = crossPointY;
    tankX = tankCoordsX;
    tankY = tankCoordsY;
    ctx = canvasModel.getBullet().ctx;

    xExplosion = explosionX - DAMAGERADIUS;
    yExplosion = explosionY - DAMAGERADIUS;
    animateExplosion();
}

const animateExplosion = () => {
    ctx.drawImage(sprite, xSprite, 0, 134, 134, xExplosion, yExplosion, 134, 134);

    if (xSprite < 1608) {
        xSprite = xSprite + 134;
        window.setTimeout(animateExplosion, 70);
    } else {
        xSprite = 0;
        clear(ctx);
    }
};
