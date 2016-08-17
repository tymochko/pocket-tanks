import { WIDTH, HEIGHT, WEAPON_WIDTH, G } from './externalVariables';
import paper from 'paper';
import { tick } from './explosion';
import { calculateDamageArea } from './generateDamage';
import { ground } from './groundModel';
import { requestAnimFrame, clear, drawLifeBar } from './externalFunctions';
import { canvasModel } from './canvasModel';

const player1 = {};
const player2 = {};

let gameData;
let originalPoints;
let lastTime;
let deltaT = 0;
let deltaTTank1 = 0;
let deltaTTank2 = 0;
let bullet;
let gameTime = 0;
let power;
let angle;
const bulletImg = new Image();
let tankX;
let tankY;
let tankAngle;
let socket;
let bulletCtx;
let groundCtx;

export const intersectionPlayer = (tank1, tank2, gameInst) => {
    player1.data = tank1;
    player2.data = tank2;
    gameData = gameInst;
    gameData.player1.tank = tank1;
    gameData.player2.tank = tank2;
};

bulletImg.src='./public/images/bullet2.png';

const sendUpdates = () => {
    const activePlayer = gameData.player1.turn ? gameData.player1.id : gameData.player2.id;
    gameData.player1.turn = !gameData.player1.turn;
    gameData.player2.turn = !gameData.player2.turn;

    if (localStorage.getItem('playerId') === activePlayer) {
        socket.emit('update-data', gameData);
    }
};

const drawBullet = () => {
    const ctx = canvasModel.getBullet().ctx;

    clear(ctx);

    const now = Date.now();
    const dt = (now - lastTime) / 1000.0;
    updateBulletPos(dt);
    renderEntity(bullet);
    lastTime = now;
};

const generateExplosion = (dt) => {
    if (!bullet) {
        return;
    }
    paper.project.activeLayer.removeChildren();

    bulletCtx = canvasModel.getBullet().ctx;
    groundCtx = canvasModel.getGround().ctx;

    bullet.pos[0] = tankX + WEAPON_WIDTH * Math.cos(bullet.tankAngle + bullet.angle) +
        bullet.bulletSpeed * deltaT * Math.cos(bullet.angle + bullet.tankAngle);
    bullet.pos[1] = tankY - 30 - WEAPON_WIDTH * Math.sin(bullet.tankAngle + bullet.angle)-
        (bullet.bulletSpeed * deltaT * Math.sin(bullet.angle + bullet.tankAngle) - G * deltaT * deltaT / 2);

    deltaT += 4*dt;

    // creating path for bullet and originalPoints
    let bull = new paper.Path.Rectangle(new paper.Point(bullet.pos[0], bullet.pos[1]), new paper.Size(45, 7));
    //check angle for accuracy of point
    bull.rotate(-bullet.imgInf.currAngle * 180 / Math.PI);
    bull.strokeColor = '#ff0000';

    const groundPath = new paper.Path(
        new paper.Point(originalPoints[0][0], originalPoints[0][1])
    );

    for (let i = 1; i < originalPoints.length; i++) {
        groundPath.add(new paper.Point(originalPoints[i][0], originalPoints[i][1]));
    }
    groundPath.strokeColor = '#000';

    const tankSize = new paper.Size(80,30);
    const user1 = new paper.Path.Rectangle(new paper.Point(player1.data.tankX - tankSize.width / 2, player1.data.tankY - tankSize.height / 2), tankSize);
    user1.strokeColor = '#00ff00';
    const user2 = new paper.Path.Rectangle(new paper.Point(player2.data.tankX - tankSize.width / 2, player2.data.tankY - tankSize.height / 2), tankSize);
    user2.strokeColor = '#ff0000';

    user1.rotate(-player1.data.tankAngle * 180 / Math.PI);
    user2.rotate(-player2.data.tankAngle * 180 / Math.PI);

    paper.view.draw();
    // check if intersect the original points
    const intersectPlayer1 = bull.getIntersections(user2);
    if (intersectPlayer1.length > 0) {
        const crossPoint = {
            x: intersectPlayer1[0]._point.x,
            y: intersectPlayer1[0]._point.y
        };
        bullet = null;
        tick(crossPoint.x, crossPoint.y, tankX, tankY);

        gameData.player2.life -= 1;
        drawLifeBar('player2', gameData.player2.life);

        window.cancelAnimationFrame(requestAnimFrame);
        sendUpdates();

        return;
    }

    const intersectPlayer2 = bull.getIntersections(user1);
    if (intersectPlayer2.length > 0) {
        const crossPoint = {
            x: intersectPlayer2[0]._point.x,
            y: intersectPlayer2[0]._point.y
        };

        bullet = null;
        tick(crossPoint.x, crossPoint.y, tankX, tankY);

        gameData.player1.life -= 1;
        drawLifeBar('player1', gameData.player1.life);

        window.cancelAnimationFrame(requestAnimFrame);

        sendUpdates();

        return;
    }

    const intersect = bull.getIntersections(groundPath);
    if (intersect.length > 0) {
        bullet = null;

        const crossPoint = {
            x: intersect[0]._point.x,
            y: intersect[0]._point.y
        };

        tick(crossPoint.x, crossPoint.y, tankX, tankY);
        window.cancelAnimationFrame(requestAnimFrame);

        gameData.points = calculateDamageArea(originalPoints, crossPoint.x, crossPoint.y);

        sendUpdates();

    } else if (bullet.pos[0] > WIDTH || bullet.pos[1] > HEIGHT) {
        bullet = null;
        window.cancelAnimationFrame(requestAnimFrame);
    } else {
        requestAnimFrame(drawBullet);
    }
};

const updateBulletPos = (dt) => {
    gameTime += dt;
    generateExplosion(dt);
};

const renderEntity = (currentBullet) => {
    if (!currentBullet) {
        return;
    }
    currentBullet.imgInf.render(canvasModel.getBullet().ctx);
};

const shotStart = (checkDeltaT = true) => {
    if (!checkDeltaT) {
        deltaT = deltaTTank1;
    } else {
        deltaT = deltaTTank2;
    }
    lastTime = Date.now();
    drawBullet();
};

const makeShot = (ctx, tank, tankCoordX, tankCoordY, tankAngleParam, weaponAngleParam, socketIo) => {
    originalPoints = ground.getGround();
    socket = socketIo;

    angle = weaponAngleParam;
    tankX = tankCoordX;
    tankY = tankCoordY;
    tankAngle = tankAngleParam;
    power = tank.power;
    deltaT = 0;
    deltaTTank1 = 0;
    deltaTTank2 = 0;

    bullet = {
        pos: [tankX, tankY],
        imgInf: new ImgInf(),
        angle,
        tankAngle,
        bulletSpeed: power
    };

    shotStart();
};

(function() {
    function ImgInf() {
        this.currAngle = 0;
    }

    ImgInf.prototype = {

        render(ctx) {
            ctx.save();
            const initialBulletPosX = 0;
            const initialBulletPosY = 0;
            clear(ctx);
            ctx.translate(bullet.pos[0], bullet.pos[1]);
            const alpha = bullet.bulletSpeed * Math.cos(bullet.angle + bullet.tankAngle);
            this.currAngle = Math.atan(((bullet.bulletSpeed) * Math.sin(bullet.angle + bullet.tankAngle)- G * deltaT)/alpha);

            if (bullet.angle + bullet.tankAngle > Math.PI/2) {
                this.currAngle = this.currAngle + Math.PI;
            }

            ctx.rotate(-this.currAngle);
            ctx.drawImage(bulletImg, initialBulletPosX, initialBulletPosY);
            ctx.restore();
        }
    };

    window.ImgInf = ImgInf;
})();

module.exports.makeShot = makeShot;
