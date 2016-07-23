'use strict';
import paper from 'paper';
import externalVariables from './externalVariables';
import showChatWindow from './chatField';
import { findLinePoints } from './tankMovement';
import { tankMove } from './tankMovement';
import { navPanel } from './navPanel';
import { makeShot } from './shotTrajectory';
import { getId } from './externalFunctions';
import { tank } from './tankModel';
import { drawGround } from './canvasRedrawModel';
import { drawSky } from './canvasRedrawModel';

let originalPoints = externalVariables.originalPoints;

const WIDTH = externalVariables.WIDTH,
    HEIGHT = externalVariables.HEIGHT;

let tankX,
    tankY,
    angleWeapon,
    angle,
    power,
    pattern;

module.exports.initGame = function (ctx, backCanvas, backCtx) {

    let lastTimeTankMoved;

    const tankHeight = tank.getVehicleHeight(),
        tankWidth = tank.getVehicleWidth(),
        weaponHeight = tank.getWeaponHeight(),
        weaponWidth = tank.getWeaponWidth(),
        tankImage = new Image(),
        weaponImage = new Image();

    // let angleWeapon10 = 10*Math.PI/180;

/* ====== initialization ======== */

    paper.setup(backCanvas);

    power =  parseInt(getId('power').innerHTML);
    angle = parseInt(getId('angle').innerHTML);

/* ====== Tank drawing ======== */

    const drawTankFn = () => {

        tankImage.src = './public/images/tankVehicle.png';
        weaponImage.src = './public/images/tankWeapon_straight.png';


        return (xCoordinate, yCoordinate, angle) => {

            // angleWeapon = -tiltTank(xCoordinate);

            ctx.save();
            ctx.translate(xCoordinate, yCoordinate-weaponHeight);
            ctx.rotate(-angle);
            ctx.drawImage(tankImage,-tankWidth/2-weaponWidth/3,-tankHeight/2+weaponHeight/2 ,
            tankWidth, tankHeight);
            ctx.restore();

            moveWeapon(xCoordinate, yCoordinate, angle);
        };

    };

    const drawTank = drawTankFn();

/* ====== Tank Weapon Movement ======== */

    let moveWeapon = (xCoordinate, yCoordinate, angle) => {
            ctx.save();
            ctx.translate(xCoordinate, yCoordinate-weaponHeight);
            ctx.rotate(-angle- angle*Math.PI/180);
            ctx.drawImage(weaponImage, 0,  -weaponHeight/2, weaponWidth, weaponHeight);
            ctx.restore();
    };

    let moveWeaponKeyDown = (evt) => {
        switch (evt.keyCode) {
                case 38:    //Up arrow was pressed /
                    if(angle >=  80) {return;}
                    angle +=5;
                    clear();
                    fillBackground();
                    angleWeapon = angle*Math.PI/180;
                    drawTank(tankX, tankY, angleWeapon);
                    getId('angle').innerHTML = angle;
                    break;

                case 40:   //Down arrow was pressed /
                  if(angle <=  0) {return;}
                   angle -=5;
                    clear();
                    fillBackground();
                    angleWeapon = angle*Math.PI/180;
                    drawTank(tankX, tankY, angleWeapon);
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
                    tankMove('left');
                    break;
                case 39:  /* Right arrow was pressed */
                    tankMove('right');
                    break;
                case 13: /*ENTER*/
                    makeShot(ctx, backCanvas, backCtx, pattern, tank.getCoord().tankX, tank.getCoord().tankY, angleWeapon);
                break;

            }
        lastTimeTankMoved = now;
        }
    };
    window.addEventListener('keydown',doKeyDown,true);

    const clear = () => {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    };

    const fillBackground = (pattern) => {
        ctx.rect(0,0,WIDTH,HEIGHT);
        ctx.fillStyle = pattern;
        ctx.fill();
    };

/* ======   Navigation ======== */

    navPanel(angle, tankX, tankY, angleWeapon);

    getId('chatBtn').onclick = showChatWindow;

    (function initialization() {
        clear();

        drawSky(backCtx);
        drawGround(originalPoints, backCtx);

        tankX = Math.floor((Math.random() * 330) + 30);
        tankY = findLinePoints(tankX);
        angleWeapon = tank.getWeaponAngle();

        tank.setCoord(tankX, tankY);

        pattern = ctx.createPattern(backCanvas, "no-repeat");
        lastTimeTankMoved = 0;
        fillBackground(pattern);
        angleWeapon = -tiltTank(tankX, tankY);
        weaponImage.onload = function() {
            drawTank(tankX, tankY, angleWeapon);
        }
    })();

    
    window.clear = clear;
    window.fillBackground = fillBackground;
    window.drawTank = drawTank;
};
