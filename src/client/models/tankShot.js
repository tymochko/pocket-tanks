'use strict';
import paper from 'paper';
import { ground } from './groundModel';
import showChatWindow from './chatField';
import { findLinePoints, tankMove } from './tankMovement';
import { navPanel } from './navPanel';
import { makeShot } from './shotTrajectory';
import { getId, clear, clearAll, drawTanks } from './externalFunctions';
import { Tank } from './tankModel';
import { drawGround, drawSky } from './canvasRedrawModel';
import { canvasModel } from './canvasModel';
import { drawTank } from './drawTank';
import {intersectionPlayer} from './shotTrajectory'

const originalPoints = ground.getGround();
const tank = new Tank('playerId');

let tank1;
let tank2;
let opponentId;

let tankX,
    tankY,
    weaponAngle,
    angle,
    power;

const tankImage = new Image();
const weaponImage = new Image();

module.exports.initGame = (gameInst, socket) => {

    const tankCtx = canvasModel.getTank().ctx;
    let lastTimeTankMoved;

/* ====== initialization ======== */
    paper.setup(canvasModel.getBullet().canvas);

    power = parseInt(getId('power').innerHTML);
    angle = parseInt(getId('angle').innerHTML);
/* ====== Tank Weapon Movement ======== */

    const opponentIdInit = (value) => {
         opponentId = value;
    };

    const checkTank = (playerId) => {
        if (tank1.id === playerId) {
            return tank1;
        }
        return tank2;
    };

    const getOpponentId = (playerId) => {
        socket.emit('moveIdServer', {playerId});
        socket.on('moveIdClient', (data) => {
            return opponentIdInit(data.playerId);
        });
    };

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
                drawTank(localStorage.getItem('playerId'), tank, tankImage, weaponImage, weaponAngle);
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
                drawTank(localStorage.getItem('playerId'), tank, tankImage, weaponImage, weaponAngle);
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
                    tankMove('left', tank1, tank2, tankImage, weaponImage, socket);
                    // const promise = new Promise((resolve, reject) => {
                    //     getOpponentId(localStorage.getItem('playerId'));
                    //     resolve();
                    // });
                    // promise.then(() => {
                    //     console.log('opponentID: ' + opponentId);
                    //     tankMove('left', tank1, tankImage, weaponImage, socket);
                    // });
                    break;

                case 39:  /* Right arrow was pressed */
                    tankMove('right', tank1, tank2, tankImage, weaponImage, socket);
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

    navPanel(tank, angle, weaponAngle, socket, gameInst);

    getId('chatBtn').onclick = showChatWindow;

    (function initialization() {
        tankImage.src = './public/images/tankVehicle.png';
        weaponImage.src = './public/images/tankWeapon_straight.png';

        drawSky(canvasModel.getSky().ctx);
        drawGround(originalPoints, canvasModel.getGround().ctx);

        tank1 = gameInst.player1.tank;
        tank2 = gameInst.player2.tank;

        intersectionPlayer(tank1,tank2);


     

        weaponAngle = tank.getWeaponAngle();

        lastTimeTankMoved = 0;
        socket.emit('initPosTank', { tank1, tank2, tankImage, weaponImage, weaponAngle });

        weaponImage.onload = () => {
            drawTanks(drawTank, tank1, tank2, tankImage, weaponImage);
            socket.on('initOutPosTank', (data) => {
                // getOpponentId(localStorage.getItem('playerId'));
                const tank1temp = new Tank(gameInst.player1.id, data.tank1.tankX, data.tank1.tankAngle, data.tank1.weaponAngle);
                const tank2temp = new Tank(gameInst.player2.id, data.tank2.tankX, data.tank2.tankAngle, data.tank2.weaponAngle);

                return drawTanks(drawTank, tank1temp, tank2temp, tankImage, weaponImage);
            });
        };
    })();
};

module.exports.tank = tank;
