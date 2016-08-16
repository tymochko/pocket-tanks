import { WIDTH, HEIGHT, WEAPON_WIDTH, G } from './externalVariables';
import paper from 'paper';
import { tick } from './explosion';
import { calculateDamageArea } from './generateDamage';
import { ground } from './groundModel';
import { drawGround } from './canvasRedrawModel';
import { requestAnimFrame, clear, changeTurn } from './externalFunctions';
import { canvasModel } from './canvasModel';


const player1 = {};
const player2 = {};
let gameData;


export const intersectionPlayer = (tank1, tank2, gameInst) => {
    player1.data = tank1;
    player2.data = tank2;
    gameData = gameInst;
    gameData.player1.tank = tank1;
    gameData.player2.tank = tank2;

};

let originalPoints,
    lastTime,
    deltaT = 0,
    deltaT_tank1 = 0,
    deltaT_tank2 = 0,
    bullet,
    gameTime = 0,
    power = 50,
    angle,
    bulletImg = new Image(),
    tankX,
    tankY,
    tankAngle,
    socket,
    bulletCtx,
    groundCtx,
    lightningCtx;

bulletImg.src='./public/images/bullet2.png';
const makeShot = (ctx, tank, tankCoordX, tankCoordY, tankAngleParam, weaponAngleParam, socketIo) => {
    originalPoints = ground.getGround();
    socket = socketIo;

    angle = weaponAngleParam;
    tankX = tankCoordX;
    tankY = tankCoordY;
    tankAngle = tankAngleParam;
    deltaT = 0;
    deltaT_tank1 = 0;
    deltaT_tank2 = 0;

    bullet = {
        pos: [tankX, tankY],
        imgInf: new ImgInf(bulletImg.src, [0, 0], angle, power),
        angle,
        tankAngle,
        bulletSpeed: power
    };

    shotStart();
};

const shotStart = (check_deltaT = true) => {
	if(!check_deltaT) deltaT = deltaT_tank1;
	else deltaT = deltaT_tank2;
    lastTime = Date.now();
    drawBullet();
};

const drawBullet = () => {
    const ctx = canvasModel.getBullet().ctx;

    clear(ctx);

    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    update(dt);
    renderEntity(bullet);
    lastTime = now;

};

const update = (dt) => {
    gameTime += dt;
    generateExplosion(dt);
};

const generateExplosion = (dt) => {
    if(!bullet) { return; }

    bulletCtx = canvasModel.getBullet().ctx;
    groundCtx = canvasModel.getGround().ctx;

    bullet.pos[0] = tankX + WEAPON_WIDTH * Math.cos(bullet.tankAngle + bullet.angle) +
        bullet.bulletSpeed * deltaT * Math.cos(bullet.angle + bullet.tankAngle);
    bullet.pos[1] = tankY - 30 - WEAPON_WIDTH * Math.sin(bullet.tankAngle + bullet.angle)-
        (bullet.bulletSpeed * deltaT * Math.sin(bullet.angle + bullet.tankAngle) - G * deltaT * deltaT / 2);

    deltaT += 4*dt;

    // creating path for bullet and originalPoints
    var bull = new paper.Path.Rectangle(bullet.pos[0], bullet.pos[1], 45, 7);
    //check angle for accuracy of point
    // bull.rotate(-bullet.imgInf.currAngle);


    var groundPath = new paper.Path(
        new paper.Point(originalPoints[0][0], originalPoints[0][1])
        );
    for(let i = 1; i < originalPoints.length; i++) {
        groundPath.add(new paper.Point(originalPoints[i][0], originalPoints[i][1]));
    }

    var user1 = new paper.Path.Rectangle(player1.data.tankX, player1.data.tankY,80,30);
    var user2 = new paper.Path.Rectangle(player2.data.tankX, player2.data.tankY,80,30);

    user1.rotate(player1.data.tankAngle);
    user2.rotate(player2.data.tankAngle);
    // check if intersect the original points
    var intersectPlayer1 = bull.getIntersections(user2);
    if(intersectPlayer1.length > 0) {
        console.log('boom2');
        let crossPoint = {
            x: intersectPlayer1[0]._point.x,
            y: intersectPlayer1[0]._point.y
        };
        console.log(crossPoint);

        bullet = null;
        tick(crossPoint.x, crossPoint.y, tankX, tankY);
        window.cancelAnimationFrame(requestAnimFrame);

    }
    var intersectPlayer2 = bull.getIntersections(user1);
    if(intersectPlayer2.length > 0) {
        console.log('boom1');
        let crossPoint = {
            x: intersectPlayer2[0]._point.x,
            y: intersectPlayer2[0]._point.y
        };
        console.log(crossPoint);

        bullet = null;
        tick(crossPoint.x, crossPoint.y, tankX, tankY);
        window.cancelAnimationFrame(requestAnimFrame);

    }
    var intersect = bull.getIntersections(groundPath);
    if(intersect.length > 0) {
        bullet = null;

        let crossPoint = {
            x: intersect[0]._point.x,
            y: intersect[0]._point.y
        };

        tick(crossPoint.x, crossPoint.y, tankX, tankY);
        window.cancelAnimationFrame(requestAnimFrame);

        const calculatedGroundPoints = calculateDamageArea(originalPoints, crossPoint.x, crossPoint.y);

        gameData.points = calculatedGroundPoints;

        gameData.player1.turn = changeTurn(gameData.player1.turn);
        gameData.player2.turn = changeTurn(gameData.player2.turn);

        socket.emit('update-data', gameData);

        ground.setGround(calculatedGroundPoints);

        groundCtx = canvasModel.getGround().ctx;
        bulletCtx = canvasModel.getBullet().ctx;

        clear(groundCtx);
        drawGround(ground.getGround(), groundCtx);


    } else if (bullet.pos[0]>WIDTH || bullet.pos[1]>HEIGHT) {
        bullet = null;
        window.cancelAnimationFrame(requestAnimFrame);
    } else {
        requestAnimFrame(drawBullet);
    }
};

const renderEntity = (bullet) => {
    if(!bullet) { return; }
    bullet.imgInf.render(canvasModel.getBullet().ctx, deltaT);
};
(function() {
    function ImgInf(url, pos, angle, v0) {
        this.pos = pos;
        this.url = url;
        this.angle=angle;
        this.v0=v0;
        this.currAngle = 0;
    }

    ImgInf.prototype = {

        render: function(ctx, deltaT) {
            ctx.save();
            var x = this.pos[0];
            var y = this.pos[1];
            clear(ctx);
            ctx.translate(bullet.pos[0], bullet.pos[1]);
            var A = bullet.bulletSpeed * Math.cos(bullet.angle + bullet.tankAngle);
            this.currAngle = Math.atan(((bullet.bulletSpeed) * Math.sin(bullet.angle + bullet.tankAngle)- G * deltaT)/A);

            if(bullet.angle + bullet.tankAngle > Math.PI/2) {
            	this.currAngle = this.currAngle + Math.PI;
            }

            ctx.rotate(-this.currAngle);
            ctx.drawImage(bulletImg, x, y);
            ctx.restore();
        }
    };

    window.ImgInf = ImgInf;
})();

module.exports.makeShot = makeShot;
