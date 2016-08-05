'use strict';
import paper from 'paper';
import { ground } from './groundModel';
import showChatWindow from './chatField';
import { findLinePoints, tankMove } from './tankMovement';
import { navPanel } from './navPanel';
import { makeShot } from './shotTrajectory';
import { getId, clear } from './externalFunctions';
import { Tank } from './tankModel';
import { drawGround, drawSky } from './canvasRedrawModel';
import { canvasModel } from './canvasModel';
import { drawTank } from './drawTank';
import { Game } from './gameModel';

const originalPoints = ground.getGround();
const tank = new Tank('playerId');

let tankX,
    tankY,
    weaponAngle,
    angle,
    power,
    tankImage = new Image(),
    weaponImage = new Image();

module.exports.initGame = (socket) => {

    let tankCtx = canvasModel.getTank().ctx;
    let lastTimeTankMoved;

/* ====== initialization ======== */

    paper.setup(canvasModel.getLightning().canvas);

    power = parseInt(getId('power').innerHTML);
    angle = parseInt(getId('angle').innerHTML);
/* ====== Tank Weapon Movement ======== */

    const moveWeaponKeyDown = (evt) => {
        switch (evt.keyCode) {
            case 38:    //Up arrow was pressed /
                if (angle >= 80) {
                    return;
                }
                angle +=5;
                clear(tankCtx);
                weaponAngle = angle*Math.PI/180;
                tank.setWeaponAngle(weaponAngle);
                drawTank(tank, tank.getCoord().tankX, tank.getCoord().tankY, tankImage, weaponImage, weaponAngle);
                getId('angle').innerHTML = angle;
                break;

            case 40:   //Down arrow was pressed /
                if (angle <= 0) {
                    return;
                }
                angle -=5;
                clear(tankCtx);
                weaponAngle = angle*Math.PI/180;
                tank.setWeaponAngle(weaponAngle);
                drawTank(tank, tank.getCoord().tankX, tank.getCoord().tankY, tankImage, weaponImage, weaponAngle);
                getId('angle').innerHTML = angle;
                break;
        }
    };

    document.addEventListener('keydown',moveWeaponKeyDown,true);

/* ======  Tank movement ======== */

    const doKeyDown = (evt) => {
        let now = new Date().getTime();

        if (now - lastTimeTankMoved > 1500) {
            switch (evt.keyCode) {
                case 37:  /* Left arrow was pressed */
                    tankMove('left', tank, tankImage, weaponImage, socket);
                    break;
                case 39:  /* Right arrow was pressed */
                    tankMove('right', tank, tankImage, weaponImage, socket);
                    break;
                case 13: /*ENTER*/
                    makeShot(
                        canvasModel.getBullet().ctx,
                        tank,
                        tank.getCoord().tankX,
                        tank.getCoord().tankY,
                        tank.getTankAngle(),
                        socket
                    );
                break;

            }
        lastTimeTankMoved = now;
        }
    };
    window.addEventListener('keydown', doKeyDown, true);

/* ======   Navigation ======== */

    navPanel(tank, angle, weaponAngle);

    getId('chatBtn').onclick = showChatWindow;

    (function initialization() {
	    tankImage.src = './public/images/tankVehicle.png';
    	weaponImage.src = './public/images/tankWeapon_straight.png';

        drawSky(canvasModel.getSky().ctx);
        drawGround(originalPoints, canvasModel.getGround().ctx);

        tankX = tank.getCoord().tankX;
        tankY = tank.getCoord().tankY;
        weaponAngle = tank.getWeaponAngle();

        tank.setCoord(tankX, tankY);

        lastTimeTankMoved = 0;
        socket.emit('initPosTank', { tankX, tankY, tankImage, weaponImage, weaponAngle });

        weaponImage.onload = () => {
            socket.on('initOutPosTank', (data) => {
                return drawTank(tank, data.x, data.y, tankImage, weaponImage, weaponAngle);
            });
        };
    })();
};
