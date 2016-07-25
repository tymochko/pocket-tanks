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

let originalPoints = ground.getGround();

let tankX,
    tankY,
    angleWeapon,
    angle,
    power,
    pattern,
    tankImage = new Image(),
    weaponImage = new Image();

module.exports.initGame = function ( backCanvas, backCtx, socket) {

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
                angleWeapon = angle*Math.PI/180;
                drawTank(tankX, tankY, angleWeapon, tankImage, weaponImage);
                getId('angle').innerHTML = angle;
                break;

            case 40:   //Down arrow was pressed /
                if(angle <=  0) {return;}
                angle -=5;
                clear(tankCtx);
                angleWeapon = angle*Math.PI/180;
                drawTank(tankX, tankY, angleWeapon, tankImage, weaponImage);
                getId('angle').innerHTML = angle;
                break;
        }
    };

    document.addEventListener('keydown',moveWeaponKeyDown,true);

/* ====== Tank Tilt ======== */

    var tiltTank = function(posX) {
        let angle = 0;
        for(let i = originalPoints.length - 1; i > 0; i--) {
            if(originalPoints[i][0] >= posX && originalPoints[i-1][0] <= posX) {
                var x1 = originalPoints[i-1][0],
                x2 = originalPoints[i][0],
                y1 = originalPoints[i-1][1],
                y2 = originalPoints[i][1];
            }
        }
        let tan = (y1 > y2) ? (y1 - y2) / (x1 - x2) : (y2 - y1) / (x2 - x1);

        angle = Math.atan(tan);

        return angle;
    };

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
                    makeShot(canvasModel.getBullet().ctx, backCanvas, backCtx, pattern, tank.getCoord().tankX, tank.getCoord().tankY, angleWeapon, socket);
                break;

            }
        lastTimeTankMoved = now;
        }
    };
    window.addEventListener('keydown',doKeyDown,true);

/* ======   Navigation ======== */

    navPanel(angle, tankX, tankY, angleWeapon);

    getId('chatBtn').onclick = showChatWindow;

    (function initialization() {
	    tankImage.src = './public/images/tankVehicle.png';
    	weaponImage.src = './public/images/tankWeapon_straight.png';

        drawSky(canvasModel.getSky().ctx);
        drawGround(originalPoints, canvasModel.getGround().ctx);

        tankX = 179;
        tankY = findLinePoints(tankX);
        angleWeapon = tank.getWeaponAngle();

        tank.setCoord(tankX, tankY);

        lastTimeTankMoved = 0;
        angleWeapon = -tiltTank(tankX, tankY);
        socket.emit('initPosTank', {'tankX':tankX, 'tankY':tankY, 'angleWeapon': angleWeapon, 'tankImage': tankImage, 'weaponImage': weaponImage});
        weaponImage.onload = function() {
            socket.on('initOutPosTank', function(data){
                return drawTank(data.x, data.y, data.angleWeapon, tankImage, weaponImage);
            });
        }
    })();
};
