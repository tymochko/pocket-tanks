'use strict';

// document.addEventListener("DOMContentLoaded", function(){
    function initGame(){

        //      <------initialization------>
        var backCanvas = document.createElement('canvas');
        var WIDTH = backCanvas.width  = 800;
        var HEIGHT = backCanvas.height = 500;
        var backCtx = backCanvas.getContext('2d');

        var canvas = document.getElementById('myCanvas');
        var ctx = canvas.getContext('2d');
        var lastTimeTankMoved;
        var tankX, tankY;

        var pattern;

        var originalPoints = [[0, 280],[20, 285],[40, 310],[145, 325],[125, 380],[165, 330],[175, 340],[220, 350],
        [240, 300],[280, 280],[300, 250],[340, 180],[370, 150],[440, 170],[550, 410],[530, 350],[540, 310],
        [575, 290],[630, 320],[685, 320],[690, 335],[700, 320],[750, 280],[755, 285],[795, 250],[800, 250],
        [800, 500],[0, 500],[0, 280]];

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
		const tankImage = new Image();
    	const weaponImage = new Image();

        const drawTankFn = () => {
        	
        	var tankHeight = 30;
            var tankWidth = 70;
            var weaponHeight = 20;
            var weaponWidth = 35;

            tankImage.src = './public/images/tankVehicle.png';
            weaponImage.src = './public/images/tankWeapon.png';

            return (xCoordinate, yCoordinate) => {
            	ctx.save();
            	var angle = tiltTank(xCoordinate);
             	ctx.translate(xCoordinate, yCoordinate - 30);
                ctx.translate(tankWidth / 2, tankHeight / 2);
                ctx.rotate(angle);
                ctx.drawImage(tankImage, -(tankWidth / 2), -(tankHeight / 2), tankWidth, tankHeight);
                ctx.restore();
                ctx.save();
                ctx.translate(xCoordinate + 45, yCoordinate - 44);
                ctx.translate(weaponWidth / 2, weaponHeight / 2);
                ctx.rotate(angle);
                ctx.drawImage(weaponImage, -(weaponWidth / 2), -(weaponHeight / 2), weaponWidth, weaponHeight);
                ctx.restore();

            };

        }
        const drawTank = drawTankFn();

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
        }
        // <------Tank movement------>

        var findLinePoints = function(posX) {
            var arr = [];

            for(var i = originalPoints.length - 1; i > 0; i--) {
                if(originalPoints[i][0] >= posX && originalPoints[i-1][0] <= posX) {
                    var x1 = originalPoints[i-1][0],
                        x2 = originalPoints[i][0],
                        y1 = originalPoints[i-1][1],
                        y2 = originalPoints[i][1];
                    // console.log("Vova: " + x1 + " " + x2 + " " + y1 + " " + y2);
                    var time = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
                    for (var j = 0; j <= time; j++) {
                        var delta = j/time ;
                        var a =  delta*(x2 - x1) + x1;
                        var b =  delta*(y2 - y1) + y1;
                        arr.push([Math.round(a), Math.round(b)]);
                    }
                    for(var i = 0; i < arr.length; i++) {
                        if(arr[i][0] === posX) return (arr[i][1]);
                    }
                }
            }
        };

        var clear = function() {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
        };

        var fillBackground = function () {
            ctx.rect(0,0,WIDTH,HEIGHT);
            ctx.fillStyle = pattern;
            ctx.fill();
        };

        var animate = function(draw, duration) {
            var start = performance.now();
            requestAnimFrame(function animate(time) {
                var timePassed = time - start;
                if (timePassed > duration) timePassed = duration;
                draw(timePassed);
                if(tankX >= WIDTH - 11 || tankX <= 11){
                    window.cancelAnimationFrame(requestAnimFrame);
                    console.log('stop!!!');
                } else if (timePassed < duration) {
                    requestAnimFrame(animate);
                }
            });
        };

        var tankMove = function(direction) {
            animate(function(timePassed) {
                if(direction === "right") {
                    tankX++;
                } else {
                    tankX--;
                }
                tankY = findLinePoints(tankX);
                clear();
                fillBackground();
                drawTank(tankX, tankY);
            }, 1500);
        };


        function doKeyDown(evt){
            var now = new Date().getTime();
            if(now - lastTimeTankMoved > 1500) {
                switch (evt.keyCode) {
                    case 37:  /* Left arrow was pressed */
                        tankMove('left');
                        break;
                    case 39:  /* Right arrow was pressed */
                        tankMove('right');
                        break;
                    case 13: /*ENTER*/
                        makeShot();
                    break;
                }
            lastTimeTankMoved = now;
            }
        }
        window.addEventListener('keydown',doKeyDown,true);

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

        getId('moreAngle').onclick = function (){
            angle++;
            getId('angle').innerHTML = angle;
            angle = parseInt(getId('angle').innerHTML);
        }
        getId('lessAngle').onclick = function (){
            angle--;
            getId('angle').innerHTML = angle;
            angle = parseInt(getId('angle').innerHTML);
        }

        // <------Vika's part - Explosion ------>

        var xSprite = 0;
        var sprite = new Image();
        sprite.src = './public/images/explosion_sheet.png';
        function tick(coords){
            var xExplosion = coords.x - 40;   // x = x-central - R;
            var yExplosion = coords.y - 40;   // y = y-central - R;

            clear();
            
            fillBackground(); // it's instead of ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawTank(tankX, tankY);
            ctx.drawImage(sprite, xSprite, 0, 134, 134, xExplosion, yExplosion, 134, 134);
            if (xSprite < 1608) {
                xSprite = xSprite + 134;
                window.setTimeout(tick, 70, coords);
                // console.log('Coords are: ' + coords.x + ' and ' + coords.y);
            } else {
                xSprite = 0;
            }
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
            for(var i=0; i<bullets.length; i++) {
                bullet = bullets[i];
                bullet.pos[0] = tankX+45 + bullet.bulletSpeed * dt2*Math.cos(bullet.angle*Math.PI/180);
                bullet.pos[1]=tankY-44-(bullet.bulletSpeed*dt2*Math.sin(bullet.angle*Math.PI/180)-9.8*dt2*dt2/2);
                dt2+=2*dt;

                var coords = {x:bullet.pos[0],
                    y:bullet.pos[1],
                    width:10,
                    height:10};

                if (checkCol(coords,originalPoints)){
                    console.log( 'x:' +  (coords.x + coords.width), 'y:' + (coords.y + coords.height));
                    bullets.splice(i, 1);
                    tick(coords);                                   // <------ Explosion ------>
                    window.cancelAnimationFrame(requestAnimFrame);
                    i--;

                    originalPoints = calculateDamageArea(originalPoints, (coords.x + coords.width), (coords.y + coords.height));
                    console.log('originalPoints has been cut out');

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
            };

            ImgInf.prototype = {

                render: function(ctx, dt2) {
                    var x = this.pos[0];
                    var y = this.pos[1];

                    ctx.translate(x,y);
                    var A=this.v0*Math.cos(this.angle*Math.PI/180);
                    var an=Math.atan(((this.v0)*Math.sin(this.angle*Math.PI/180)-9.81*dt2)/A);
                    ctx.rotate(-an);
                    ctx.drawImage(bulletImg,x, y);
                    ctx.restore();
                }
            };

            window.ImgInf = ImgInf;
        })();

        // ======= Misha's part =======

        function checkCol(current, array) {
            let startPoint = array[0];
            for (let i = 1; i < array.length; i++) {
                let endPoint = array[i];
                if (current.x > startPoint[0] && current.x < endPoint[0]) {
                    if (checkCross(startPoint, endPoint, current)) {
                        return true;
                    }
                }
                startPoint = array[i];
            }
        }

        function checkCross(startPoint, endPoint, currPoint) {
            let point1 = {
                x: startPoint[0],
                y: startPoint[1]
            };
            let point2 = {
                x: endPoint[0],
                y: endPoint[1]
            };
            let objPoint = {
                x:currPoint.x + currPoint.width,
                y:currPoint.y + currPoint.height
            };

            let a = (point2.y - point1.y) / (point2.x - point1.x);
            let b = point1.y - a * point1.x;

            if(Math.abs(objPoint.y - (a*objPoint.x + b)) < 2) {
                return true;
            }
            return false;
        }

        //<------Yuri's part - generate damage on battlefield ------>

        const calculateDamageArea = (array, damageX, damageY) => {
            damageX = Math.round(damageX);
            damageY = Math.round(damageY);

            // TODO bookmark
            // TODO change all 'for' loops into 'map' where is possible
            let x1,
                y1,
                x2,
                y2,
                theta,
                delta = (Math.PI / 12),
                distance,
                pointOnCircle,
                pointRealOnCircle = [],
                elementToChangeFrom,
            // setting distanceBetweenDamageSegments static as a distance between points of damaged ground
                distanceBetweenDamageSegments = 15,
                damageRadius = 40;

            let segmentPoints = findDamageLimits(array, damageX, damageY, damageRadius);

            let pointsOfIntersect = [];
            for (let i = 0; i < segmentPoints.length; i++) {
                if (segmentPoints[i][2] == 'inDamage') {
                    pointsOfIntersect.push(segmentPoints[i]);
                }
            }

            for (let i = 1; i < pointsOfIntersect.length; i++) {
                if (i % 2) {
                    x1 = pointsOfIntersect[i - 1][0];
                    y1 = pointsOfIntersect[i - 1][1];
                    x2 = pointsOfIntersect[i][0];
                    y2 = pointsOfIntersect[i][1];

                    pointRealOnCircle.push([x1, y1]);

                    distance = calculateDistance(pointRealOnCircle[pointRealOnCircle.length - 1][0], pointRealOnCircle[pointRealOnCircle.length - 1][1], x2, y2);

                    if (distance <= distanceBetweenDamageSegments) {
                        pointRealOnCircle.push([x2, y2]);
                        continue;
                    }

                    theta = findInitialAngle(pointRealOnCircle[pointRealOnCircle.length - 1][0], pointRealOnCircle[pointRealOnCircle.length - 1][1], damageX, damageY);

                    do {
                        if (pointOnCircle) {
                            pointRealOnCircle.push(pointOnCircle);
                        }

                        theta -= delta;

                        pointOnCircle = rotateFixed(damageX, damageY, damageRadius, theta);

                        distance = calculateDistance(pointOnCircle[0], pointOnCircle[1], x2, y2);
                    }
                    while (distance > distanceBetweenDamageSegments);

                    pointRealOnCircle.push([x2, y2]);
                }
            }

            // replace damage points in segmentPoints array with extended damage points
            segmentPoints.splice(1, segmentPoints.length-2);
            for (let i = 0; i < pointRealOnCircle.length; i++) {
                segmentPoints.splice((1 + i), 0, pointRealOnCircle[i]);
            }

            // insert damage points into originalPoints array with extended damage points
            elementToChangeFrom = segmentPoints[0][2];
            array.splice(elementToChangeFrom, 4);
            // removing property of '1' from array points
            segmentPoints[0].pop();
            segmentPoints[segmentPoints.length - 1].pop();

            segmentPoints.map((item) => {
                array.splice(elementToChangeFrom, 0, item);
                elementToChangeFrom++;
            });

            return array;
        };

        const calculateDistance = (x1, y1, x2, y2) => {
            /*check distance between two points coordinates*/
            return Math.round( (Math.sqrt( Math.pow( (x2 - x1), 2 ) + ( Math.pow( (y2 - y1), 2 ) ) )) );
        };

        const findDamageLimits = (array, damageX, damageY, damageRadius) => {
            let segmentPairPoints = [],
                distance,
                pointsOnDamageLine = [],
                segmentWithDamage1 = [],
                segmentWithDamage2 = [],
                numberOfLast,
                pointsRebuild = [],
                pointsOfDamageCenterSegment = [],
                distanceFromDamageCenter1,
                distanceFromDamageCenter2;

            pointsOfDamageCenterSegment = findDamageCenterPointOnSegment(array, damageX, damageY);
            if (pointsOfDamageCenterSegment == null) {
                console.log('Point is out of the ground');
            }
            // TODO implement logic if pointOfDamageCenter is equal to point in originalPoints


            distanceFromDamageCenter1 = calculateDistance(damageX, damageY, pointsOfDamageCenterSegment[0][0], pointsOfDamageCenterSegment[0][1]);
            distanceFromDamageCenter2 = calculateDistance(damageX, damageY, pointsOfDamageCenterSegment[1][0], pointsOfDamageCenterSegment[1][1]);

            if (distanceFromDamageCenter1 >= damageRadius || damageRadius <= distanceFromDamageCenter2) {
                segmentPairPoints.push(pointsOfDamageCenterSegment[0]);
                segmentPairPoints.push(pointsOfDamageCenterSegment[1]);
            }

            for (let i = 0; i <= (array.length - 1); i++) {
                distance = calculateDistance(damageX, damageY, array[i][0], array[i][1]);
                if (distance < damageRadius) {
                    // setting extra property 1 - point is within damage radius
                    segmentPairPoints.push([array[i - 1][0], array[i - 1][1], (i - 1)]);
                    segmentPairPoints.push([array[i][0], array[i][1], i]);
                }
            }

            segmentPairPoints.sort((a, b) => {
                if (a[2] > b[2]) {
                    return 1;
                }

                if (a[2] < b[2]) {
                    return -1;
                }

                return 0;
            });

            // removing duplicated coordinates
            for (let i = 1; i < segmentPairPoints.length; i++) {
                if (segmentPairPoints[i][2] == segmentPairPoints[i - 1][2]) {
                    segmentPairPoints.splice(i, 1);
                }
            }

            // populating array pointsRebuild with points of area which is going to be modified
            pointsRebuild.push(segmentPairPoints[0]);
            for (let i = 1; i < segmentPairPoints.length; i++) {
                pointsOnDamageLine = findIntersectionCoordinates(segmentPairPoints[i - 1][0], segmentPairPoints[i - 1][1], segmentPairPoints[i][0], segmentPairPoints[i][1], damageX, damageY, damageRadius);

                segmentWithDamage1 = findPointOnSegment(array, pointsOnDamageLine[0][0], pointsOnDamageLine[0][1]);

                segmentWithDamage2 = findPointOnSegment(array, pointsOnDamageLine[1][0], pointsOnDamageLine[1][1]);

                if (segmentWithDamage1 != undefined) {
                    pointsOnDamageLine[0].push('inDamage');
                    pointsRebuild.push(pointsOnDamageLine[0]);
                }

                if (segmentWithDamage2 != undefined) {
                    pointsOnDamageLine[1].push('inDamage');
                    pointsRebuild.push(pointsOnDamageLine[1]);
                }
            }

            // number of last point of damaged line-segment in canvas array
            numberOfLast = segmentPairPoints[segmentPairPoints.length - 1][2] + 1;
            pointsRebuild.push(array[numberOfLast]);
            // also setting index number from originalPoints array
            pointsRebuild[pointsRebuild.length - 1].push(numberOfLast);

            return pointsRebuild;
        };

        const findIntersectionCoordinates = (x1, y1, x2, y2, cX, cY, r) => {
            /* x1, y1 and x2, y2 - are coordinates of line-segment on canvas
             * cX, cY and r - are coordinates of center of damage and a radius */

            /* using line equation (y = m*x + k) */
            let m = ( (y2 - y1) / (x2 - x1) );
            let k = (y1 - m * x1);

            /* using circle equation (a*x^2 + b*x + c = 0) */
            let a = (Math.pow(m, 2) + 1);
            let b = 2 * (m * k - m * cY - cX);
            let c = ( Math.pow(cY, 2) - Math.pow(r, 2) + Math.pow(cX, 2) - 2 * k * cY + Math.pow(k, 2) );

            let xPlus = Math.round( ( -b + ( Math.sqrt( (Math.pow(b, 2)) -4 * a * c ) ) ) / (2 * a) );
            let xMinus = Math.round( ( -b - ( Math.sqrt( (Math.pow(b, 2)) -4 * a * c ) ) ) / (2 * a) );

            /* using line equation again to calculate two variants of y */
            let yPlus = Math.round(m * xPlus + k);
            let yMinus = Math.round(m * xMinus + k);

            let point1 = [xPlus, yPlus];
            let point2 = [xMinus, yMinus];

            return [point1, point2];
        };

        const findInitialAngle = (x, y, cx, cy) => {
            return Math.atan2((y - cy), (x - cx));
        };

        const rotateFixed = (cx, cy, r, theta) => {
            let px2,
                py2;

            px2 = cx + (r * Math.cos(theta));
            py2 = cy + (r * Math.sin(theta));

            return [px2, py2];
        };

        const findPointOnSegment = (array, segmentX, segmentY) => {
            /*defines point which coordinates lays on the line-segment of canvas*/
            let x1;
            let y1;
            let x2;
            let y2;
            let foundPoint;
            let point1;
            let point2;

            for (let i = 1; i < array.length; i++) {
                x1 = array[i - 1][0];
                y1 = array[i - 1][1];
                x2 = array[i][0];
                y2 = array[i][1];

                foundPoint = calculateLineEquation(x1, y1, x2, y2, segmentX, segmentY);

                if ( ((y1 <= foundPoint) && (foundPoint <= y2)) || ((y2 <= foundPoint) && (foundPoint <= y1)) ) {
                    point1 = [x1, y1, (i - 1)];
                    point2 = [x2, y2, i];
                    return [point1, point2];
                }
            }
            return null;
        };

        const calculateLineEquation = (x1, y1, x2, y2, segmentX, segmentY) => {
            /*defines point which coordinates lays on the line of segment*/
            let y = Math.round( ( (segmentX - x1) * (y2 - y1) ) / (x2 - x1) + y1 );

            if ( (y - 5) <= segmentY && segmentY <= (y + 5) ) {
                return y;
            }
        };

        // dirty hack while Misha's point is underground
        const findDamageCenterPointOnSegment = (array, segmentX, segmentY) => {
            /*defines point which coordinates lays on the line-segment of canvas*/
            let x1;
            let y1;
            let x2;
            let y2;
            let foundPoint;
            let point1;
            let point2;

            for (let i = 1; i < array.length; i++) {
                x1 = array[i - 1][0];
                y1 = array[i - 1][1];
                x2 = array[i][0];
                y2 = array[i][1];

                foundPoint = calculateDamageCenterLineEquation(x1, y1, x2, y2, segmentX, segmentY);

                if ( ((y1 <= foundPoint) && (foundPoint <= y2)) || ((y2 <= foundPoint) && (foundPoint <= y1)) ) {
                    point1 = [x1, y1, (i - 1)];
                    point2 = [x2, y2, i];
                    return [point1, point2];
                }
            }
            return null;
        };

        const calculateDamageCenterLineEquation = (x1, y1, x2, y2, segmentX, segmentY) => {
            /*defines point which coordinates lays on the line of segment*/
            let y = Math.round( ( (segmentX - x1) * (y2 - y1) ) / (x2 - x1) + y1 );

            // temporary solution before Misha fixes point to be on the ground instead of underground
            if ( (y - 10) <= segmentY && segmentY <= (y + 10) ) {
                return y;
            }
        };

        (function initialization() {
            clear();
            drawSky();
            drawGround();

            pattern = ctx.createPattern(backCanvas, "no-repeat");
            tankX = Math.floor((Math.random() * 330) + 30);
            tankY = findLinePoints(tankX);
            lastTimeTankMoved = 0;
            fillBackground();
            weaponImage.onload = function() {
            	drawTank(tankX, tankY);
            }
        })();
        
    }
// });