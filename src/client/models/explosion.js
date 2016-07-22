import { radius } from './externalVariables';

var xSprite = 0;
var sprite = new Image();
sprite.src = './public/images/explosion_sheet.png';
let explosionX,
    explosionY,
    tankX,
    tankY,
    ctx,
    firstTimeRun = true;

export function tick(coords, tankCoordsX, tankCoordsY, ctx2){

    if(firstTimeRun) {
        explosionX = coords.x;
        explosionY = coords.y;
        tankX = tankCoordsX;
        tankY = tankCoordsY;
        ctx = ctx2;
    }

    firstTimeRun = false;

    var xExplosion = explosionX - radius;
    var yExplosion = explosionY - radius;

    clear(); 
    fillBackground(); 
    drawTank(tankX, tankY); 
    ctx.drawImage(sprite, xSprite, 0, 134, 134, xExplosion, yExplosion, 134, 134);

    if (xSprite < 1608) {
        xSprite = xSprite + 134;
        window.setTimeout(tick, 70);
    } else {
        xSprite = 0;
    }
}
