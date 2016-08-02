'use strict';
import paper from 'paper';
import { ground } from './groundModel';
import showChatWindow from './chatField';
import { findLinePoints } from './tankMovement';
import { tankMove } from './tankMovement';
import { navPanel } from './navPanel';
import { makeShot } from './shotTrajectory';
import { getId } from './externalFunctions';
import { tank } from './tankModel';
import { drawGround } from './canvasRedrawModel';
import { drawSky } from './canvasRedrawModel';
import { clear } from './externalFunctions';
import { canvasModel } from './canvasModel';
import { drawTank } from './drawTank';
import { Game } from './gameModel';

let originalPoints = ground.getGround();

let tankX,
    tankY,
    weaponAngle,
    angle,
    power,
    tankImage = new Image(),
    weaponImage = new Image();

module.exports.initGame = ( backCanvas, backCtx, socket) => {

    let tankCtx = canvasModel.getTank().ctx;
    let lastTimeTankMoved;

/* ====== initialization ======== */

    paper.setup(canvasModel.getBullet().canvas);

    power =  parseInt(getId('power').innerHTML);
    angle = parseInt(getId('angle').innerHTML);
/* ====== Tank Weapon Movement ======== */

    let moveWeaponKeyDown = (evt) => {
        switch (evt.keyCode) {
            case 38:    //Up arrow was pressed /
                if(angle >=  80) {return;}
                angle +=5;
                clear(tankCtx);
                weaponAngle = angle*Math.PI/180;
                tankX = tank.getCoord().tankX;
                tankY = tank.getCoord().tankY;
                tank.setWeaponAngle(weaponAngle);
                drawTank(tankX, tankY, tankImage, weaponImage, weaponAngle);
                getId('angle').innerHTML = angle;
                break;

            case 40:   //Down arrow was pressed /
                if(angle <=  0) {return;}
                angle -=5;
                clear(tankCtx);
                weaponAngle = angle*Math.PI/180;
                tankX = tank.getCoord().tankX;
                tankY = tank.getCoord().tankY;
                tank.setWeaponAngle(weaponAngle);
                drawTank(tankX, tankY, tankImage, weaponImage, weaponAngle);
                getId('angle').innerHTML = angle;
                break;
        }
    };

    document.addEventListener('keydown',moveWeaponKeyDown,true);

/* ======  Tank movement ======== */

    const doKeyDown = (evt) => {
        let now = new Date().getTime();

        if(now - lastTimeTankMoved > 1500) {
            switch (evt.keyCode) {
                case 37:  /* Left arrow was pressed */
                    tankMove('left', tankImage, weaponImage, socket);
                    break;
                case 39:  /* Right arrow was pressed */
                    tankMove('right', tankImage, weaponImage, socket);
                    break;
                case 13: /*ENTER*/
                    makeShot(canvasModel.getBullet().ctx, backCanvas, backCtx, tank.getCoord().tankX, tank.getCoord().tankY, tank.getTankAngle(), socket);
                break;

            }
        lastTimeTankMoved = now;
        }
    };
    window.addEventListener('keydown',doKeyDown,true);

/* ======   Navigation ======== */

    navPanel(angle, tankX, tankY, weaponAngle);

    getId('chatBtn').onclick = showChatWindow;

    (function initialization() {
	    tankImage.src = './public/images/tankVehicle.png';
    	weaponImage.src = './public/images/tankWeapon_straight.png';

        drawSky(canvasModel.getSky().ctx);
        drawGround(originalPoints, canvasModel.getGround().ctx);

        tankX = 179;
        tankY = findLinePoints(tankX);
        weaponAngle = tank.getWeaponAngle();

        tank.setCoord(tankX, tankY);

        lastTimeTankMoved = 0;
        socket.emit('initPosTank', {'tankX':tankX, 'tankY':tankY, 'tankImage': tankImage, 'weaponImage': weaponImage, 'weaponAngle': weaponAngle});
        weaponImage.onload = function() {
            socket.on('initOutPosTank', function(data){
                return drawTank(data.x, data.y, tankImage, weaponImage, weaponAngle);
            });
        }
    })();
};
