import { WIDTH, HEIGHT, WEAPON_WIDTH, G } from './externalVariables';
import paper from 'paper';
import { tick } from './explosion';
import { calculateDamageArea } from './generateDamage';
import { ground } from './groundModel';
import { drawGround } from './canvasRedrawModel';
import { requestAnimFrame, clear } from './externalFunctions';
import { canvasModel } from './canvasModel';

let originalPoints,
    lastTime,
    dt2 = 0,
    bullet,
    lastFire = Date.now(),
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

const makeShot = (ctx, tank, tankCoordX, tankCoordY, tankAngleParam, socketIo) => {
    originalPoints = ground.getGround();

    angle = tank.getWeaponAngle();
    socket = socketIo;
    tankX = tankCoordX;
    tankY = tankCoordY;
    tankAngle = tankAngleParam;

    dt2=0;
    bullet = {
        pos: [tankX, tankY],
        imgInf: new ImgInf(bulletImg.src, [0, 0], angle, power),
        angle,
        tankAngle,
        bulletSpeed: power
    };
    lastFire = Date.now();
    socket.emit('inputPos', {
        posX: bullet.pos[0],
        posY: bullet.pos[1],
        power,
        angle,
        tankAngle,
        deltaT: dt2
    });
    socket.on('outputPos', function(data) {
        bullet = {
            pos: [data.x, data.y],
            imgInf: new ImgInf(bulletImg.src, [0, 0], data.angle, data.power),
            angle: data.angleWeapon,
            bulletSpeed: data.power,
            tankAngle: data.tankAngle
        };
        return shotStart();//bullet.imgInf.render(canvasModel.getBullet().ctx, dt2, data);
    });
    shotStart();
};



module.exports.makeShot = makeShot;
const shotStart = () => {

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
    // groundCtx = canvasModel.getGround().ctx;
    // clear(groundCtx);
    // drawGround(ground.getGround(), groundCtx);
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
        bullet.bulletSpeed * dt2 * Math.cos(bullet.angle + bullet.tankAngle);
    bullet.pos[1] = tankY - 30 - WEAPON_WIDTH * Math.sin(bullet.tankAngle + bullet.angle)-
        (bullet.bulletSpeed * dt2 * Math.sin(bullet.angle + bullet.tankAngle) - G * dt2 * dt2 / 2);
    console.log(bullet);
    dt2 += 4*dt;
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

    // check if intersect the original points
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
    bullet.imgInf.render(canvasModel.getBullet().ctx, dt2);
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

        render: function(ctx, dt2) {
            ctx.save();
            var x = this.pos[0];
            var y = this.pos[1];
                clear(ctx);
                ctx.translate(bullet.x, bullet.y);
                var A=bullet.power*Math.cos(bullet.angle + bullet.tankAngle);
                this.currAngle=Math.atan(((bullet.power) * Math.sin(bullet.angle + bullet.tankAngle)- G * bullet.deltaT)/A);
                ctx.rotate(-this.currAngle);
                ctx.drawImage(bulletImg, x, y);
                ctx.restore();

                groundCtx = canvasModel.getGround().ctx;
                bulletCtx = canvasModel.getBullet().ctx;

                clear(groundCtx);
                drawGround(ground.getGround(), groundCtx);

        }
    };

    window.ImgInf = ImgInf;
})();
