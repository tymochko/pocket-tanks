'use strict';

const radius = 40;
const WIDTH = 800,
    HEIGHT = 500;

var ctx;
var tankX, tankY;
var originalPoints;
var angleWeaponInc = 0;

// document.addEventListener("DOMContentLoaded", function(){
    function initGame(){

        var backCanvas;
        var backCtx, canvas;
        var lastTimeTankMoved;
        var pattern;
        var inv=1;       

        const tankHeight = 30,
            tankWidth = 70,
            weaponHeight = 20,
            weaponWidth = 35,      
            tankImage = new Image(),
            weaponImage = new Image();
        let angleWeapon,
            angleWeapon10 = 10*Math.PI/180;

        //      <------initialization------>
        backCanvas = document.createElement('canvas');
 
        paper.setup(backCanvas)
        backCanvas.width  = WIDTH;
        backCanvas.height = HEIGHT;
        backCtx = backCanvas.getContext('2d');
        canvas = document.getElementById('myCanvas');
        ctx = canvas.getContext('2d');
 
        // <------Ground and sky drawing------>
 
        var polygon = function(array, color) {
            backCtx.beginPath();
 
            array.forEach(function(pair, number) {
                if(number == 0) {
                    backCtx.moveTo(pair[0], pair[1]);
                } else {
                    backCtx.lineTo(pair[0], pair[1]);
                }
            });
            backCtx.fillStyle=color;
            backCtx.fill();
            backCtx.closePath();
        };
 
        var drawGround = function(){
 
            var points = originalPoints;
 
            var colors = ['#040905', '#030C37', '#352E58', '#2F010B', '#991E23', '#E72E10', '#FFC057'];
            colors.forEach(function (color) {
                polygon(points, color);
 
                // points = points.map(function(pair) {
                //     return [pair[0], pair[1] + 40];
                // });
            })
        };
 
        var drawSky = function(){
            var grd=backCtx.createLinearGradient(0,0,0,500);
            grd.addColorStop(0,"#172059");
            grd.addColorStop(0.3,"#6D6D85");
            grd.addColorStop(1,"#A0837D");
 
            backCtx.fillStyle=grd;
            backCtx.fillRect(0,0,800,500);
        };
 
        // <------Tank drawing------>
 
        /*const tankImage = new Image();
        const weaponImage = new Image();
        var xCof, yCof;
        var angle_second;
        var angleWeapon;
        var angle_weapon = 0;*/
 
        const drawTankFn = () => {
           
            tankImage.src = './public/images/tankVehicle.png';
            weaponImage.src = './public/images/tankWeapon_straight.png';


            return (xCoordinate, yCoordinate, angleW) => {
              
                angleWeapon = -tiltTank(xCoordinate); 
                
                ctx.save();
                ctx.translate(xCoordinate, yCoordinate-weaponHeight);                
                ctx.rotate(-angleWeapon);               
                ctx.drawImage(tankImage,-tankWidth/2-weaponWidth/3,-tankHeight/2+weaponHeight/2 , 
                tankWidth, tankHeight);
                ctx.restore();

                moveWeapon(xCoordinate, yCoordinate, angleW);
            };

        }
 
        const drawTank = drawTankFn();
 
       // <------Tank Weapon Movement------>

        let moveWeapon = (xCoordinate, yCoordinate, angleW) => {
                ctx.save();
                ctx.translate(xCoordinate, yCoordinate-weaponHeight);
                ctx.rotate(-angleWeapon- angle*Math.PI/180); 
                ctx.drawImage(weaponImage, 0,  -weaponHeight/2, weaponWidth, weaponHeight);
                ctx.restore();
        }

        let moveWeaponKeyDown = (evt) => {
            switch (evt.keyCode) {
                    case 38:    //Up arrow was pressed /
                        if(angle >=  80) {return;}
                        angle +=5; 
                        clear();
                        fillBackground();
                        angleWeaponInc = angle*Math.PI/180;
                        drawTank(tankX, tankY,angleWeaponInc);
                        getId('angle').innerHTML = angle;                        
                        break;

                    case 40:   //Down arrow was pressed /
                      if(angle <=  0) {return;}
                       angle -=5;
                        clear();
                        fillBackground();
                        angleWeaponInc = angle*Math.PI/180;
                        drawTank(tankX, tankY,angleWeaponInc);
                        getId('angle').innerHTML = angle;
                        break;
            }
        }

        document.addEventListener('keydown',moveWeaponKeyDown,true);

        // <------Tank Tilt------>
 
        var tiltTank = function(posX) {
            for(var i = originalPoints.length - 1; i > 0; i--) {
                if(originalPoints[i][0] >= posX && originalPoints[i-1][0] <= posX) {
                    var x1 = originalPoints[i-1][0],
                    x2 = originalPoints[i][0],
                    y1 = originalPoints[i-1][1],
                    y2 = originalPoints[i][1];
                }
            }
            var tan = (y1 > y2) ? (y1 - y2) / (x1 - x2) : (y2 - y1) / (x2 - x1);
 
            this.angle = Math.atan(tan);
 
            // if (tan < 0)
                // this.angle += 180;
 
            return this.angle;
        };


        // <------Tank movement------>

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
 
                    case 32: /*SPACE*/
                        dt2=0;
                        bullets.push({ pos: [tankX, tankY],
                            imgInf: new ImgInf(bulletImg.src,[0,0],angle,power),
                            angle: angle,
                            bulletSpeed: power
                        });
                        lastFire = Date.now();
                        shotStart();
                        break;
                    case 13: /*ENTER*/
                        makeShot();
                    break;
 
                }
            lastTimeTankMoved = now;
            }
        };
        window.addEventListener('keydown',doKeyDown,true);

        const clear = () => {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
        };

        const fillBackground = () => {
            ctx.rect(0,0,WIDTH,HEIGHT);
            ctx.fillStyle = pattern;
            ctx.fill();
        };


        function makeShot() {
            dt2=0;
            bullets.push({ pos: [tankX+45, tankY-44],
                imgInf: new ImgInf(bulletImg.src,[0,0],angle,power),
                angle: angle,
                bulletSpeed: power
            });
            lastFire = Date.now();
            shotStart();
        }
 
 
// <------Vika's part - Navigation ------>
 
        function getId(id) {
            return document.getElementById(id);
        }
 
        getId('fire').onclick = function() {
            makeShot();
        }
 
        getId('morePower').onclick = function (){
            power++;
            getId('power').innerHTML = power;
            power = parseInt(getId('power').innerHTML);
        }
        getId('lessPower').onclick = function (){
            power--;
            getId('power').innerHTML = power;
            power = parseInt(getId('power').innerHTML);
        }

        getId('chatBtn').onclick = function (){
            var adiv = document.getElementById('chat-window');
            var starttime;
            var maxOpacity=1;
            var timeDur=1000;

            function moveit(timestamp, el, dist, duration){
                var timestamp = timestamp || new Date().getTime();
                var runtime = timestamp - starttime;
                var progress = runtime / duration;

                progress = Math.min(progress, maxOpacity);
                el.style.opacity = inv*(dist * progress).toFixed(2);
                
                (inv==1) ? el.style.display="initial" : el.style.display="none";

                if (runtime < duration){
                    requestAnimationFrame(function(timestamp){ 
                        moveit(timestamp, el, dist, duration);
                    })
                }
                else
                    inv=-inv;
            }
             
            requestAnimationFrame(function(timestamp){
                starttime = timestamp || new Date().getTime();
                moveit(timestamp, adiv, maxOpacity, timeDur);
            });
        }

        getId('moreAngle').onclick = function (){
            
           getId('angle').innerHTML = angle;

            if(angle >= 80) {return;}
            angle +=5;
            getId('angle').innerHTML = angle;
            angle = parseInt(getId('angle').innerHTML);
 
            clear();
            fillBackground();            
            angleWeaponInc = angle*Math.PI/180;
            drawTank(tankX, tankY,angleWeaponInc);
        }
        getId('lessAngle').onclick = function (){
           
            getId('angle').innerHTML = angle;

            if(angle <= 0) {return;}
            angle -=5;
            getId('angle').innerHTML = angle;
            angle = parseInt(getId('angle').innerHTML);

            clear();
            fillBackground();
            angleWeaponInc = angle*Math.PI/180;
            drawTank(tankX, tankY,angleWeaponInc);
        }
 
 
        //<------Maks's part-------->
 
 
        var requestAnimFrame = (function(){
            return window.requestAnimationFrame   ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback){
                window.setTimeout(callback, 1000 / 60);
            };
        })();
        var power =  parseInt(getId('power').innerHTML);
        var angle = parseInt(getId('angle').innerHTML);;
        var lastTime;
        var dt2=0;
        var bullets = [];
        var bullet;
        var lastFire = Date.now();
        var gameTime = 0;
        var bulletImg=new Image();
        bulletImg.src='./public/images/bullet2.png';
 
        function drawBullet() {
            clear();
 
            fillBackground();
            drawTank(tankX,tankY);
 
            var now = Date.now();
            var dt = (now - lastTime) / 1000.0;
            update(dt);
            render();
            lastTime = now;
        }
 
        function shotStart() {
            lastTime = Date.now();
            drawBullet();
        }
 
        function update(dt) {
            gameTime += dt;
            updateEntities(dt);
        }
 
        function updateEntities(dt) {
            for(var i = 0; i < bullets.length; i++) {
                bullet = bullets[i];
                bullet.pos[0] = tankX + weaponWidth * Math.cos(angleWeapon + angle*Math.PI/180) + bullet.bulletSpeed * dt2*Math.cos(bullet.angle*Math.PI/180 + angleWeapon);
                bullet.pos[1] = tankY-30 - weaponWidth * Math.sin(angleWeapon + angle*Math.PI/180)- (bullet.bulletSpeed * dt2*Math.sin(bullet.angle*Math.PI/180 + angleWeapon) - 9.8 * dt2 * dt2 / 2);
                dt2 += 2*dt;
                    // creating path for bullet and originalPoints
                var bull = new paper.Path.Rectangle(bullet.pos[0],bullet.pos[1], 45, 7);
                //check angle for accuracy of point
                bull.rotate(-bullet.imgInf.currAngle);
 
                var groundPath = new paper.Path(
                    new paper.Point(originalPoints[0][0], originalPoints[0][1])
                );
                for(let i = 1; i < originalPoints.length; i++) {
                    groundPath.add(new paper.Point(originalPoints[i][0], originalPoints[i][1]))
                }
                // check if intersect the original points
                var intersect = bull.getIntersections(groundPath);
                if(intersect.length > 0 ) {
                    bullets.splice(i, 1);
                    i--;
 
                    let crossPoint = {
                        x: intersect[0]._point.x,
                        y: intersect[0]._point.y
                    };
                    console.log( 'x:' +  crossPoint.x, 'y:' + crossPoint.y );
                    tick(crossPoint);                                   // <------ Explosion ------>
                    window.cancelAnimationFrame(requestAnimFrame);
 
                    originalPoints = calculateDamageArea(originalPoints, crossPoint.x, crossPoint.y);
 
                    // temporary solution for redrawing updated array originalPoints
                    clear();
                    drawSky();
                    drawGround();
 
                    pattern = ctx.createPattern(backCanvas, "no-repeat");
                    tankY = findLinePoints(tankX);
 
                    fillBackground();
                    drawTank(tankX, tankY);
                }
                else if(bullet.pos[0]>WIDTH || bullet.pos[1]>HEIGHT)
                {
                    bullets.splice(i, 1);
                    window.cancelAnimationFrame(requestAnimFrame);
                    i--;
                    clear();
                    drawSky();
                    drawGround();
 
                    pattern = ctx.createPattern(backCanvas, "no-repeat");
                    tankY = findLinePoints(tankX);
 
                    fillBackground();
                    drawTank(tankX, tankY);
                }
                else
                {
                    requestAnimFrame(drawBullet);
                }
            }
        }
 
        function render() {
            renderEntities(bullets);
        };
 
        function renderEntities(list) {
            for(var i=0; i<list.length; i++) {
                renderEntity(list[i]);
            }
        }
 
        function renderEntity(entity) {
            ctx.save();
            ctx.translate(entity.pos[0], entity.pos[1]);
            entity.imgInf.render(ctx,dt2);
            ctx.restore();
        }
 
        function reset() {
            gameTime = 0;
            bullets = [];
        };
 
        (function() {
            function ImgInf(url, pos, angle, v0) {
                this.pos = pos;
                this.url = url;
                this.angle=angle;
                this.v0=v0;
                this.currAngle = 0;
            };
 
            ImgInf.prototype = {
 
                render: function(ctx, dt2) {
                    var x = this.pos[0];
                    var y = this.pos[1];
 
                    ctx.translate(x,y);
                    var A=this.v0*Math.cos(this.angle*Math.PI/180 + angleWeapon);
                    this.currAngle=Math.atan(((this.v0)*Math.sin(this.angle*Math.PI/180 + angleWeapon)-9.81*dt2)/A);
                    ctx.rotate(-this.currAngle);
                    ctx.drawImage(bulletImg,x, y);
                    ctx.restore();
                }
            };
 
            window.ImgInf = ImgInf;
        })();
 
        (function initialization() {
            originalPoints = [[0, 280],[20, 285],[40, 310],[145, 325],[125, 380],[165, 330],[175, 340],[220, 350],
                [240, 300],[280, 280],[300, 250],[340, 180],[370, 150],[440, 170],[550, 410],[530, 350],[540, 310],
                [575, 290],[630, 320],[685, 320],[690, 335],[700, 320],[750, 280],[755, 285],[795, 250],[800, 250],
                [800, 500],[0, 500],[0, 280]];
            clear();
            drawSky();
            drawGround();
 
            pattern = ctx.createPattern(backCanvas, "no-repeat");
            tankX = Math.floor((Math.random() * 330) + 30);
            tankY = findLinePoints(tankX);
            lastTimeTankMoved = 0;
            fillBackground();
            angle_weapon = tiltTank(tankX);
            weaponImage.onload = function() {
                drawTank(tankX, tankY);
            }
        })();

        window.clear = clear;
        window.fillBackground = fillBackground;
        window.drawTank = drawTank;
        window.requestAnimFrame = requestAnimFrame;
        window.getId = getId;
    }
// });
