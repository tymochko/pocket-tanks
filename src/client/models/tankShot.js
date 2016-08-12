'use strict';
import paper from 'paper';
import { ground } from './groundModel';
import { tankMove } from './tankMovement';
import { navPanel } from './navPanel';
import { makeShot, intersectionPlayer } from './shotTrajectory';
import { getId, clear, clearAll, drawTanks, checkTurn } from './externalFunctions';
import { Tank } from './tankModel';
import { drawGround, drawSky } from './canvasRedrawModel';
import { canvasModel } from './canvasModel';
import { drawTank } from './drawTank';

const originalPoints = ground.getGround();

let tank1;
let tank2;
let move;

let tankX,
    tankY,
    weaponAngle,
    angle,
    power;
let tank;

const tankImage = new Image();
const weaponImage = new Image();

module.exports.initGame = (gameInst, socket) => {
    const tankCtx = canvasModel.getTank().ctx;
    let lastTimeTankMoved = 0;

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
    const toMove = (direction) => {
        let tankMoves;
        if (localStorage.getItem('playerId') === tank1.id) {
            tankMoves = 'tank1';
        } else {
            tankMoves = 'tank2';
        }
        socket.emit('inputPosTank', {
            direction,
            tankMoves,
            tank1,
            tank2
        });
    };

    const doKeyDown = (evt) => {
        const now = new Date().getTime();

        if (now - lastTimeTankMoved > 1500) {
            switch (evt.keyCode) {
                case 37:  /* Left arrow was pressed */
                    toMove('left');
                    break;

                case 39:  /* Right arrow was pressed */
                    toMove('right');
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

    checkTurn(gameInst, () => {
        window.addEventListener('keydown', doKeyDown, true);
    });

    socket.on('outputPosTank', (data) => {
        tankMove(data.direction, data.tankMoves, data.tank1, data.tank2, tankImage, weaponImage, socket);
    });
    socket.on('sendCoordsOnClient', (data) => {
        if (tank1.id === data.tank.id) {
            tank1.setCoord(data.tank.tankX, data.tank.tankY);
        } else if (tank2.id === data.tank.id) {
            tank2.setCoord(data.tank.tankX, data.tank.tankY);
        }
    });

/* ======   Navigation ======== */

    navPanel(tank, angle, weaponAngle, socket, gameInst);

    const getRandomPos = (a, b) => {
        return Math.floor((Math.random() * a) + b);
    };

    (function initialization() {
        tankImage.src = './public/images/tankVehicle.png';
        weaponImage.src = './public/images/tankWeapon_straight.png';

        weaponImage.onload = () => {

            drawSky(canvasModel.getSky().ctx);
            drawGround(originalPoints, canvasModel.getGround().ctx);

            tank1 = new Tank(
                gameInst.player1.id,
                gameInst.player1.tank.tankX,
                gameInst.player1.tank.tankAngle,
                gameInst.player1.tank.weaponAngle
            );
            tank2 = new Tank(
                gameInst.player2.id,
                gameInst.player2.tank.tankX,
                gameInst.player2.tank.tankAngle,
                gameInst.player2.tank.weaponAngle
            );

            intersectionPlayer(tank1, tank2);
            tank = new Tank(localStorage.getItem('playerId'), getRandomPos(333, 33));
            weaponAngle = tank.getWeaponAngle();

            socket.emit('initPosTank', { tank1, tank2 });

            socket.on('initOutPosTank', (data) => {
                tank1.setCoord(data.tank1.tankX, data.tank1.tankY);
                tank2.setCoord(data.tank2.tankX, data.tank2.tankY);

                clear(canvasModel.getTank().ctx);

                drawTank(tank1, tankImage, weaponImage, weaponAngle);
                drawTank(tank2, tankImage, weaponImage, weaponAngle);
            });
        };
    })();
};
