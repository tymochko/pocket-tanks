import { WIDTH } from './externalVariables';
import { requestAnimFrame, clear, drawTanks } from './externalFunctions';
import { ground } from './groundModel';
import { canvasModel } from './canvasModel';
import { drawTank } from './drawTank';

const originalPoints = ground.getGround();
let tank1;
let tank2;
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
    let tankX = tank1.tankX;

    // const weaponAngle = tank1.weaponAngle;
    const ctx = canvasModel.getTank().ctx;

    if (direction === "right") {
        tankX++;
    } else {
        tankX--;
    }
    if (checkTank) {
        tankY = findLinePoints(tankX);
        tank1.tankX = tankX;
        tank1.tankY = tankY;

        clear(ctx);
        drawTanks(drawTank, tank1, tank2, tankImage, weaponImage);
    }
    return tankX;
};

const sendCoords = () => {
    socket.emit('changeCoords', { tank: tank1 });
};


const animate = (time) => {
    const duration = 800;
    let timePassed = time - start;

    if (timePassed > duration) {
        timePassed = duration;
    }
    draw(direct, timePassed);

    if (tank1.tankX >= WIDTH ||
        tank1.tankX <= 33) {
        sendCoords();
        window.cancelAnimationFrame(requestAnimFrame);
    } else if (timePassed < duration) {
        requestAnimFrame(animate);
    } else {
        sendCoords();
        window.cancelAnimationFrame(requestAnimFrame);
    }
};

const animateStart = () => {
    start = performance.now();
    requestAnimFrame(animate);
};

module.exports.findLinePoints = findLinePoints;
module.exports.tankMove = (direction, move, tank1param, tank2param, tankImg, weaponImg, socketio) => {
    socket = socketio;
    direct = direction;
    if (move === 'tank1') {
        tank1 = tank1param;
        tank2 = tank2param;
    } else {
        tank1 = tank2param;
        tank2 = tank1param;
    }
    tankImage = tankImg;
    weaponImage = weaponImg;
    animateStart(draw, 1500);
};
module.exports.draw = draw;
