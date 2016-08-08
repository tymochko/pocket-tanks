'use strict';
import paper from 'paper';
import { ground } from './groundModel';
import showChatWindow from './chatField';
import { findLinePoints, tankMove } from './tankMovement';
import { navPanel } from './navPanel';
import { makeShot } from './shotTrajectory';
import { getId, clear, clearAll, initTanks } from './externalFunctions';
import { Tank } from './tankModel';
import { drawGround, drawSky } from './canvasRedrawModel';
import { canvasModel } from './canvasModel';
import { drawTank } from './drawTank';

const originalPoints = ground.getGround();
const tank = new Tank('playerId');

let tank1;
let tank2;

let tankX,
    tankY,
    weaponAngle,
    angle,
    power,
    tankImage = new Image(),
    weaponImage = new Image();

module.exports.initGame = (gameInst, socket) => {

    const tankCtx = canvasModel.getTank().ctx;
    let lastTimeTankMoved;

/* ====== initialization ======== */
    paper.setup(canvasModel.getBullet().canvas);

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

            default:
                break;
        }
    };

    document.addEventListener('keydown', moveWeaponKeyDown, true);

/* ======  Tank movement ======== */

    const doKeyDown = (evt) => {
        let now = new Date().getTime();

        if (now - lastTimeTankMoved > 1500) {
            switch (evt.keyCode) {
                case 37:  /* Left arrow was pressed */
                    tankMove('left', tank1, tankImage, weaponImage, socket);
                    break;

                case 39:  /* Right arrow was pressed */
                    tankMove('right', tank2, tankImage, weaponImage, socket);
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

                default:
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
        clearAll(
            canvasModel.getSky().ctx,
            canvasModel.getGround().ctx,
            canvasModel.getLightning().ctx,
            canvasModel.getTank().ctx,
            canvasModel.getBullet().ctx
        );

	    tankImage.src = './public/images/tankVehicle.png';
        weaponImage.src = './public/images/tankWeapon_straight.png';

        drawSky(canvasModel.getSky().ctx);
        drawGround(originalPoints, canvasModel.getGround().ctx);

        tank1 = gameInst.player1.tank;
        tank2 = gameInst.player2.tank;
        console.log('In initialization: ' + tank1.id + ' ' + tank2.id);
        console.log(`${tank1.getCoord().tankX}, ${tank1.getCoord().tankY}
        ${tank2.getCoord().tankX}, ${tank2.getCoord().tankY}`);

        weaponAngle = tank.getWeaponAngle();

        lastTimeTankMoved = 0;
        socket.emit('initPosTank', { tank1, tank2, tankImage, weaponImage, weaponAngle });

        weaponImage.onload = () => {
            // if (!localStorage.getItem('turn')) {
            //     initTanks(drawTank, tank1, tank2, tankImage, weaponImage, weaponAngle);
            // }

            socket.on('initOutPosTank', (data) => {
                // return 0;
                return initTanks(drawTank, data.tank1, data.tank2, tankImage, weaponImage, weaponAngle);
            });
            initTanks(drawTank, tank1, tank2, tankImage, weaponImage, weaponAngle);
        };
    })();
};

module.exports.tank = tank;
