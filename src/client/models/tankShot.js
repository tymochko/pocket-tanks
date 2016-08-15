'use strict';
import paper from 'paper';
import { ground } from './groundModel';
import { tankMove, findLinePoints } from './tankMovement';
import { navPanel } from './navPanel';
import { makeShot, intersectionPlayer } from './shotTrajectory';
import { getId, clear, drawTanks, allowTurn } from './externalFunctions';
import { Tank } from './tankModel';
import { drawGround, drawSky } from './canvasRedrawModel';
import { canvasModel } from './canvasModel';
import { drawTank } from './drawTank';

let originalPoints;
let tank1;
let tank2;

let weaponAngle,
    angle,
    power;
let tank;

const tankImage = new Image();
const weaponImage = new Image();

module.exports.initGame = (gameInst, socket) => {
    console.log(gameInst);
    const tankCtx = canvasModel.getTank().ctx;
    // socket.on('points',(data)=> {
    //     ground.setGround(data);
    //
    // });
    ground.setGround(gameInst.points);
    originalPoints = ground.getGround();
    console.log(originalPoints, 'points inside tankShot');
    let lastTimeTankMoved = 0;

/* ====== initialization ======== */
    paper.setup(canvasModel.getBullet().canvas);

    power = parseInt(getId('power').innerHTML);
    angle = parseInt(getId('angle').innerHTML);

/* ====== Tank Weapon Movement ======== */

    const weaponToMove = (value) => {
        let weaponMoves;
        if (localStorage.getItem('playerId') === tank1.id) {
            weaponMoves = 'tank1';
        } else {
            weaponMoves = 'tank2';
            value = value + Math.PI / 2;
        }

        socket.emit('inputPosWeapon', {
            weaponMoves,
            angle: value,
            tank1,
            tank2
        });
    };

    const bulletToMove = () => {
        let bulletMoves;
        let tank;
        if (localStorage.getItem('playerId') === tank1.id) {
            bulletMoves = 'tank1';
            tank = tank1;
        } else {
            bulletMoves = 'tank2';
            tank = tank2;
        }

        socket.emit('inputBulletPos', {
            bulletMoves,
            tank
        });
    };

    const weaponMove = (tankParam, angleParam) => {
        clear(tankCtx);
        if (tankParam === 'tank1') {
            tank1.setWeaponAngle(angleParam);
            drawTanks(drawTank, tank1, tank2, tankImage, weaponImage);
        } else {
            tank2.setWeaponAngle(angleParam);
            drawTanks(drawTank, tank2, tank1, tankImage, weaponImage);
        }
    };

    const moveWeaponKeyDown = (evt) => {
        switch (evt.keyCode) {
            case 38:    //Up arrow was pressed /
                if (angle >= 80) {
                    return;
                }
                angle +=5;
                getId('angle').innerHTML = angle;
                weaponToMove(angle*Math.PI/180);
                break;

            case 40:   //Down arrow was pressed /
                if (angle <= 0) {
                    return;
                }
                angle -=5;
                getId('angle').innerHTML = angle;
                weaponToMove(angle*Math.PI/180);
                break;

            default:
                break;
        }
    };
    document.addEventListener('keydown', moveWeaponKeyDown, true);

    socket.on('outputPosWeapon', (data) => {
        weaponMove(data.weaponMoves, data.angle);
    });

    socket.on('outputBulletPos', (data) => {
        bulletMove(data.bulletMoves, data.power, data.angleWeapon, data.tankAngle);

    });

    const bulletMove = (tankParam, powerParam, angleParam, tankAngleParam) => {
        if (tankParam === 'tank1') {
            makeShot(
                canvasModel.getBullet().ctx,
                tank1,
                tank1.getCoord().tankX,
                tank1.getCoord().tankY,
                tank1.getTankAngle(),
                tank1.getWeaponAngle(),
                socket

            );
        } else {
            makeShot(
                canvasModel.getBullet().ctx,
                tank2,
                tank2.getCoord().tankX,
                tank2.getCoord().tankY,
                tank2.getTankAngle(),
                tank2.getWeaponAngle(),
                socket
            );
        }
    };
/* ========  Tank movement ======== */

    const tankToMove = (direction) => {
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

        if (now - lastTimeTankMoved > 800) {
            switch (evt.keyCode) {
                case 37:  /* Left arrow was pressed */
                    tankToMove('left');
                    break;

                case 39:  /* Right arrow was pressed */
                    tankToMove('right');
                    break;

                case 13: /*ENTER*/
                    bulletToMove();
                    tank1.tankY = findLinePoints(tank1.tankX);
                    tank2.tankY = findLinePoints(tank2.tankX);
                    drawTanks(drawTank, tank1, tank2, tankImage, weaponImage);
                    break;

                default:
                    break;
            }
        lastTimeTankMoved = now;
        }
    };

    allowTurn(gameInst, () => {
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
                gameInst.player2.tank.weaponAngle + Math.PI / 2
            );

            intersectionPlayer(tank1, tank2,gameInst);

            //tank = new Tank(localStorage.getItem('playerId'), getRandomPos(333, 33));
            //weaponAngle = tank.getWeaponAngle();

            socket.emit('initPosTank', { tank1, tank2 });

            socket.on('initOutPosTank', (data) => {
                tank1.setCoord(data.tank1.tankX, data.tank1.tankY);
                tank2.setCoord(data.tank2.tankX, data.tank2.tankY);

                clear(canvasModel.getTank().ctx);

                drawTanks(drawTank, tank1, tank2, tankImage, weaponImage);
                // drawTank(tank2, tankImage, weaponImage);
            });
        };
    })();
};
