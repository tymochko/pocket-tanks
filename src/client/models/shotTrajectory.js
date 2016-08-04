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

const makeShot = (ctx, tank, tankCoordX, tankCoordY, tankangle, socketIo) => {
    originalPoints = ground.getGround();

    angle = tank.getWeaponAngle();
    socket = socketIo;
    tankX = tankCoordX;
    tankY = tankCoordY;
    tankAngle = tankangle;

    dt2=0;
    bullet = { pos: [tankX, tankY],
        imgInf: new ImgInf(bulletImg.src, [0, 0], angle, power),
        angle: angle,
        bulletSpeed: power
    };
    lastFire = Date.now();
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
    bulletCtx = canvasModel.getBullet().ctx;
    groundCtx = canvasModel.getGround().ctx;

    bullet.pos[0] = tankX + WEAPON_WIDTH * Math.cos(tankAngle + angle) + bullet.bulletSpeed * dt2*Math.cos(bullet.angle + tankAngle);
    bullet.pos[1] = tankY-30 - WEAPON_WIDTH * Math.sin(tankAngle + angle)- (bullet.bulletSpeed * dt2*Math.sin(bullet.angle + tankAngle) - G * dt2 * dt2 / 2);

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

        let calculatedGroundPoints = calculateDamageArea(originalPoints, crossPoint.x, crossPoint.y);

        ground.setGround(calculatedGroundPoints);

        groundCtx = canvasModel.getGround().ctx;
        lightningCtx = canvasModel.getLightning().ctx;

        clear(groundCtx);
        drawGround(ground.getGround(), groundCtx);
        
        clear(lightningCtx);
        drawGround(ground.getGround(), lightningCtx);
    }
    else if(bullet.pos[0]>WIDTH || bullet.pos[1]>HEIGHT)
    {
        bullet = null;
        window.cancelAnimationFrame(requestAnimFrame);
    }
    else
    {
        requestAnimFrame(drawBullet);
    }
};

const renderEntity = (entity) => {
    if(entity){
        socket.emit('inputPos', {
            posX: bullet.pos[0],
            posY: bullet.pos[1],
            power: power,
            angle: angle,
            tankAngle: tankAngle,
            deltaT: dt2
        });
        entity.imgInf.render(canvasModel.getBullet().ctx, dt2);
        socket.on('outputPos', function(data) {
            return entity.imgInf.render(canvasModel.getBullet().ctx, dt2, data);
        });
    }
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

        render: function(ctx, dt2, data) {
            ctx.save();
            var x = this.pos[0];
            var y = this.pos[1];
            if(data)
            {
                clear(ctx);
                ctx.translate(data.x, data.y);
                var A=data.power*Math.cos(data.angle + data.tankAngle);
                this.currAngle=Math.atan(((data.power)*Math.sin(data.angle + data.tankAngle)- G * data.deltaT)/A);
                ctx.rotate(-this.currAngle);
                ctx.drawImage(bulletImg, x, y);
                ctx.restore();

                groundCtx = canvasModel.getGround().ctx;
                lightningCtx = canvasModel.getLightning().ctx;

                clear(groundCtx);
                drawGround(ground.getGround(), groundCtx);
                
                clear(lightningCtx);
                drawGround(ground.getGround(), lightningCtx);
            }
            else
            {
                ctx.translate(bullet.pos[0], bullet.pos[1]);
                var A=this.v0*Math.cos(this.angle + tankAngle);
                this.currAngle=Math.atan(((this.v0)*Math.sin(this.angle + tankAngle)- G * dt2)/A);
                ctx.rotate(-this.currAngle);
                ctx.drawImage(bulletImg, x, y);
                ctx.restore();
            }
        }
    };

    window.ImgInf = ImgInf;
})();
