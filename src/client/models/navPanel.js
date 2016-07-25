import { getId } from './externalFunctions';
import { tank } from './tankModel';
import { drawTank } from './drawTank';
import { makeShot } from './shotTrajectory';

import { clear } from './externalFunctions';
import { canvasModel } from './canvasModel';
export function navPanel(angle, tankX, tankY, weaponAngle) {
    let tankCtx = canvasModel.getTank().ctx,
        socket,
        tankImage = new Image(),
        weaponImage = new Image();

    tankImage.src = './public/images/tankVehicle.png';
    weaponImage.src = './public/images/tankWeapon_straight.png';

    getId('fire').onclick = () => {
        makeShot(canvasModel.getBullet().ctx, canvasModel.getGround().canvas, canvasModel.getGround().ctx, tank.getCoord().tankX, tank.getCoord().tankY, tank.getWeaponAngle(), socket);
    };

    getId('morePower').onclick = () => {
        power++;
        getId('power').innerHTML = power;
        power = parseInt(getId('power').innerHTML);
    };

    getId('lessPower').onclick = () => {
        power--;
        getId('power').innerHTML = power;
        power = parseInt(getId('power').innerHTML);
    };

    getId('moreAngle').onclick = () => {
        angle = parseInt(getId('angle').innerHTML);
        if(angle >=  80) {return;}
        angle +=5;
        clear(tankCtx);
        weaponAngle = angle*Math.PI/180;
        tankX = tank.getCoord().tankX;
        tankY = tank.getCoord().tankY;
        tank.setWeaponAngle(weaponAngle);
        drawTank(tankX, tankY, tankImage, weaponImage, weaponAngle);
        getId('angle').innerHTML = angle;
    };

    getId('lessAngle').onclick = () => {
        angle = parseInt(getId('angle').innerHTML);
        if (angle <= 0) {return;}
        angle -= 5;
        clear(tankCtx);
        weaponAngle = angle*Math.PI/180;
        tankX = tank.getCoord().tankX;
        tankY = tank.getCoord().tankY;
        tank.setWeaponAngle(weaponAngle);
        drawTank(tankX, tankY, tankImage, weaponImage, weaponAngle);
        getId('angle').innerHTML = angle;
    };
}
