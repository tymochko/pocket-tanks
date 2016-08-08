import { WIDTH } from './externalVariables';
import { requestAnimFrame, clear } from './externalFunctions';
import { ground } from './groundModel';
import { canvasModel } from './canvasModel';
import { drawTank } from './drawTank';

const originalPoints = ground.getGround();
let tank;
let tankImage;
let weaponImage;
let socket;
let direct;
let start = performance.now();

const findLinePoints = (posX) => {
    const arr = [];

    for (let i = originalPoints.length - 1; i > 0; i--) {
        if (originalPoints[i][0] >= posX && originalPoints[i-1][0] <= posX) {
            const x1 = originalPoints[i-1][0];
            const x2 = originalPoints[i][0];
            const y1 = originalPoints[i-1][1];
            const y2 = originalPoints[i][1];
            const time = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));

            for (let j = 0; j <= time; j++) {
                const delta = j/time;
                const a = delta*(x2 - x1) + x1;
                const b = delta*(y2 - y1) + y1;
                arr.push([Math.round(a), Math.round(b)]);
            }
            for (i = 0; i < arr.length; i++) {
                if (arr[i][0] === posX) {
                    return (arr[i][1]);
                }
            }
        } else if (posX >= WIDTH || posX <= 0) {
            return -1;
        }
    }
};

const draw = (direction, timePassed, checkTank = true) => {
    let tankY;
    let tankX = tank.getCoord().tankX;

    const weaponAngle = tank.getWeaponAngle();
    const ctx = canvasModel.getTank().ctx;

    if (direction === "right") {
        tankX++;
    } else {
        tankX--;
    }
    if (checkTank) {
        tankY = findLinePoints(tankX);

        tank.setCoord(tankX, tankY);

        socket.emit('inputPosTank', {
            posX: tankX,
            posY: tankY,
            weaponAngle
        });

        clear(ctx);
        drawTank(localStorage.getItem('playerId'), tank, tankImage, weaponImage, weaponAngle);

        socket.on('outputPosTank', function(data) {
            clear(ctx);
            return drawTank(localStorage.getItem('playerId'), tank, tankImage, weaponImage, weaponAngle);
        });
    }
    return tankX;
};


const animate = (time) => {
    const duration = 1500;
    let timePassed = time - start;

    if (timePassed > duration) {
        timePassed = duration;
    }
    draw(direct, timePassed);

    if (tank.getCoord().tankX >= WIDTH - tank.getVehicleWidth()/5 ||
        tank.getCoord().tankX <= tank.getVehicleWidth()/5) {
        window.cancelAnimationFrame(requestAnimFrame);
    } else if (timePassed < duration) {
        requestAnimFrame(animate);
    }
};

const animateStart = () => {
    start = performance.now();
    requestAnimFrame(animate);
};

module.exports.findLinePoints = findLinePoints;
module.exports.tankMove = (direction, tankInst, tankImg, weaponImg, socketio) => {
    console.log(tankInst);
    socket = socketio;
    direct = direction;
    tank = tankInst;
    tankImage = tankImg;
    weaponImage = weaponImg;
    animateStart(draw, 1500);
};
module.exports.draw = draw;
