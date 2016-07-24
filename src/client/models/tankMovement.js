import externalVariables from './externalVariables';
import { requestAnimFrame } from './externalFunctions';
import { tank } from './tankModel';
// let originalPoints = externalVariables.originalPoints;
import { ground } from './groundModel';
import { canvasModel } from './canvasModel';

let originalPoints = ground.getGround();
let socket;

const WIDTH = externalVariables.WIDTH;

const findLinePoints = (posX) => {
    let arr = [];

    for(let i = originalPoints.length - 1; i > 0; i--) {
        if(originalPoints[i][0] >= posX && originalPoints[i-1][0] <= posX) {
            let x1 = originalPoints[i-1][0],
                x2 = originalPoints[i][0],
                y1 = originalPoints[i-1][1],
                y2 = originalPoints[i][1];

            let time = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
            for (let j = 0; j <= time; j++) {
                let delta = j/time ;
                let a =  delta*(x2 - x1) + x1;
                let b =  delta*(y2 - y1) + y1;
                arr.push([Math.round(a), Math.round(b)]);
            }
            for(let i = 0; i < arr.length; i++) {
                if(arr[i][0] === posX) return (arr[i][1]);
            }
        } else if(posX >= WIDTH || posX <= 0){
            return -1;
        }
    }
};

const animate = (time) => {
    const duration = 1500;
    let timePassed = time - start;

    if (timePassed > duration) {
        timePassed = duration;
    }
    draw(direct, timePassed);

    if(tank.getCoord().tankX >= WIDTH - tank.getVehicleWidth()/5 || tank.getCoord().tankX <= tank.getVehicleWidth()/5){
        window.cancelAnimationFrame(requestAnimFrame);
        console.log('stop!!!');
    } else if (timePassed < duration) {
        requestAnimFrame(animate);
    }
};

let start = performance.now(), direct;

const animateStart = (draw, duration) => {
    start = performance.now();
    requestAnimFrame(animate);
};

const draw = (direction, timePassed, checkTank = true) => {
    let tankY,
        tankX = tank.getCoord().tankX,
        angleWeapon = tank.getWeaponAngle();
    let ctx = canvasModel.getCtx().ctx;

    if(direction == "right") {
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
            angleWeapon: angleWeapon
        });

        clear(ctx);
        fillBackground(ctx);

        drawTank(tankX, tankY, angleWeapon);

        socket.on('outputPosTank', function(data){
            console.log(data, 'moving');
            clear(ctx);
            fillBackground(ctx);
            return drawTank(data.x, data.y, data.angleWeapon);
        });
    }
    return tankX;
};

module.exports.findLinePoints = findLinePoints;
module.exports.tankMove = (direction, socketio) => {
    socket = socketio;
    direct = direction;
    let timePassed;
    animateStart(draw, 1500);
};
module.exports.draw = draw;