'use strict';

//      <------initialization------>
document.addEventListener("DOMContentLoaded", function(){
    if (document.getElementById('myCanvas') != null) {
        var backCanvas = document.createElement('canvas');
        var WIDTH = backCanvas.width  = 800;
        var HEIGHT = backCanvas.height = 500;
        var backCtx = backCanvas.getContext('2d');

        var canvas = document.getElementById('myCanvas');
        var ctx = canvas.getContext('2d');
        var dx = 5,
        dy = 5;
        var tankX, tankY, rad;

        var pattern;

        var originalPoints = [[0, 300],[20, 305],[40, 330],[145, 345],[125, 400],[165, 350],[175, 360],[220, 370],
        [240, 320],[280, 300],[300, 270],[340, 200],[370, 170],[440, 190],[550, 430],[530, 370],[540, 330],
        [575, 310],[630, 340],[685, 340],[690, 355],[700, 340],[750, 300],[755, 305],[795, 270],[800, 270],
        [800, 500],[0, 500],[0, 300]];

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

        var drawTank = function(xCoordinate, yCoordinate) {
            var tankImage = new Image();
            var weaponImage = new Image();
            var tankHeight = 30;
            var tankWidth = 70;
            var weaponHeight = 20;
            var weaponWidth = 35;
            var angle = tiltTank(xCoordinate);
            tankImage.src = './public/images/tankVehicle.png';
            weaponImage.src = './public/images/tankWeapon.png';
            tankImage.onload = function() {
                ctx.save();
                ctx.rotate(angle);
                ctx.drawImage(tankImage, xCoordinate, yCoordinate - 30, tankWidth, tankHeight);
                ctx.restore();
            }
            weaponImage.onload = function() {
                ctx.drawImage(weaponImage, xCoordinate + 45, yCoordinate - 44, weaponWidth, weaponHeight);
            }
            console.log("hello");
        };

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

            this.angel = Math.atan(tan);

            if (tan < 0)
                this.angle += 180;

            return this.angel;
        }
        // <------Tank movement------>

        var findLinePoints = function(posX) {
            var arr = [];

            for(var i = originalPoints.length - 1; i > 0; i--) {
                if(originalPoints[i][0] >= posX && originalPoints[i-1][0] <= posX) {
                    var x1 = originalPoints[i-1][0],
                    x2 = originalPoints[i][0],
                    y1 = originalPoints[i-1][1],
                    y2 = originalPoints[i][1],
                    console.log("Vova: " + x1 + " " + x2 + " " + y1 + " " + y2);
                    console.log('til', tiltTank(x1, x2, y1, y2));
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

        var circle = function(x,y,r) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI*2, true);
            ctx.fillStyle = "purple";
            ctx.fill();
        };

        function doKeyDown(evt){
            switch (evt.keyCode) {
                case 37:  /* Left arrow was pressed */
                if (tankX - dx > 0){
                    tankX -= dx;
                    tankY = findLinePoints(tankX);
                    clear();
                    drawTank(tankX, tankY);
                    //circle(tankX, tankY, rad);
                    fillBackground();
                }
                break;
                case 39:  /* Right arrow was pressed */
                if (tankX + dx < WIDTH){
                    tankX += dx;
                    tankY = findLinePoints(tankX);
                    clear();
                    drawTank(tankX, tankY);
                    //circle(tankX, tankY, rad);
                    fillBackground();
                }
                break;
                case 32: /*SPACE*/
                console.log('dvcs');
                dt2=0;
                power=40;
                angle=40;
                bullets.push({ pos: [tankX, tankY],
                    imgInf: new ImgInf(bulletImg.src,[0,0],angle,power),
                    angle: angle,
                    bulletSpeed: power
                });
                lastFire = Date.now();
                shotStart();
                break;
            }
        }
        window.addEventListener('keydown',doKeyDown,true);

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

        var power,angle;
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
            circle(tankX, tankY, rad);
            fillBackground();

            var now = Date.now();
            var dt = (now - lastTime) / 1000.0;

            update(dt);
            render();

            lastTime = now;

        }

        function shotStart() {
            //reset();
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
                console.log('1');
                bullet.pos[0] = tankX + bullet.bulletSpeed * dt2 * Math.cos(bullet.angle * Math.PI/180);
                bullet.pos[1] = tankY - (bullet.bulletSpeed * dt2 * Math.sin(bullet.angle * Math.PI/180)-9.8*dt2*dt2/2);
                dt2+=2*dt;

                var coords = {x:bullet.pos[0],
                    y:bullet.pos[1],
                    width:10,
                    height:1};

                    if(checkCol(coords,originalPoints)){
                        console.log( 'x:' +  (coords.x + coords.width), 'y:' + (coords.y + coords.height));
                        bullets.splice(i, 1);
                        window.cancelAnimationFrame(requestAnimFrame);
                        i--;

                        let generateDamage = calculateDamageArea(originalPoints, (coords.x + coords.width), (coords.y + coords.height));
                        console.log(generateDamage, 'generateDamage - returns rebuilt array of originalPoints');
                        originalPoints = generateDamage;
                        //         clear();
                        // circle(tankX, tankY, rad);
                        // fillBackground();
                    }

                    // if(bullet.pos[1] > canvas.height ||
                    //     bullet.pos[0] > canvas.width) {
                    //     bullets.splice(i, 1);
                    //     window.cancelAnimationFrame(requestAnimFrame);
                    //     i--;
                    // }
                    else requestAnimFrame(drawBullet);
                }
            }

            // ======= Misha's part ======= START

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

                if(Math.abs(objPoint.y - (a*objPoint.x + b)) < 1.5) {
                    return true;
                }
                return false;
            }

            // ======= Misha's part ======= END

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

            //      <------Yuri's part - generate damage on battlefield ------>

            // let damageX = 98;
            // let damageY = 335;
            //     let damageX = 311;
            //     let damageY = 251;
            // let damageX = 267;
            // let damageY = 303;
            // let damageX = 240;
            // let damageY = 320;
            // let damageX = 450;
            // let damageY = 215;
            // let damageX = 500;
            // let damageY = 325;


            const calculateDamageArea = (array, damageX, damageY) => {
                Math.round(damageX);
                Math.round(damageY);
                // TODO bookmark
                // TODO change all 'for' loops into 'map' where is possible
                let x1,
                y1,
                x2,
                y2,
                distance,
                pointsOnCircles,
                pointCheck1,
                pointCheck2,
                pointRealOnCircle = [],
                elementToChangeFrom,
                // setting distanceBetweenDamageSegments static as a distance between points of damaged ground
                distanceBetweenDamageSegments = 15,
                damageRadius = 40;

                let segmentPoints = findDamageLimits(array, damageX, damageY, damageRadius);
                // console.log(segmentPoints, 'segmentPoints');

                let pointsOfIntersect = [];
                for (let i = 0; i < segmentPoints.length; i++) {
                    if (segmentPoints[i][2] == 'inDamage') {
                        pointsOfIntersect.push(segmentPoints[i]);
                    }
                }
                // console.log(pointsOfIntersect, 'pointsOfIntersect');

                for (let i = 1; i < pointsOfIntersect.length; i++) {
                    if (i % 2) {
                        x1 = pointsOfIntersect[i - 1][0];
                        y1 = pointsOfIntersect[i - 1][1];
                        x2 = pointsOfIntersect[i][0];
                        y2 = pointsOfIntersect[i][1];
                        // console.log(x1, y1, x2, y2, 'x1, y1, x2, y2');
                        // console.log(i, 'i');

                        pointRealOnCircle.push([x1, y1]);

                        distance = calculateDistance(pointRealOnCircle[pointRealOnCircle.length - 1][0], pointRealOnCircle[pointRealOnCircle.length - 1][1], x2, y2);
                        if (distance <= distanceBetweenDamageSegments) {
                            // console.log('minimal distance is set');
                            pointRealOnCircle.push([x2, y2]);
                            continue;
                        }

                        while (distance > distanceBetweenDamageSegments) {
                            // console.log(distance, 'distance inside');
                            // console.log('pointRealOnCircle current point', pointRealOnCircle.length-1, pointRealOnCircle[pointRealOnCircle.length-1]);

                            pointsOnCircles = findCirclesIntersection(pointRealOnCircle[pointRealOnCircle.length - 1][0], pointRealOnCircle[pointRealOnCircle.length - 1][1], distanceBetweenDamageSegments, damageX, damageY, damageRadius);
                            // console.log(pointsOnCircles, 'pointsOnCircles');

                            pointCheck1 = checkGroundPoint(pointRealOnCircle[pointRealOnCircle.length - 1][0], pointRealOnCircle[pointRealOnCircle.length - 1][1], x2, y2, pointsOnCircles[0][0], pointsOnCircles[0][1]);
                            // console.log(pointCheck1, 'pointCheck1');

                            pointCheck2 = checkGroundPoint(pointRealOnCircle[pointRealOnCircle.length - 1][0], pointRealOnCircle[pointRealOnCircle.length - 1][1], x2, y2, pointsOnCircles[1][0], pointsOnCircles[1][1]);
                            // console.log(pointCheck2, 'pointCheck2');

                            if (pointCheck1) {

                                pointRealOnCircle.push(pointCheck1);
                                // console.log('pointRealOnCircle current point >>>>>>> pointCheck1', pointRealOnCircle.length-1, pointRealOnCircle[pointRealOnCircle.length-1]);
                                distance = calculateDistance(pointRealOnCircle[pointRealOnCircle.length - 1][0], pointRealOnCircle[pointRealOnCircle.length - 1][1], x2, y2);
                                // console.log(distance, 'distance >>>>>>> pointCheck1');

                            } else if (pointCheck2) {

                                pointRealOnCircle.push(pointCheck2);
                                // console.log('pointRealOnCircle current point >>>>>>> pointCheck2', pointRealOnCircle.length-1, pointRealOnCircle[pointRealOnCircle.length-1]);
                                distance = calculateDistance(pointRealOnCircle[pointRealOnCircle.length - 1][0], pointRealOnCircle[pointRealOnCircle.length - 1][1], x2, y2);
                                // console.log(distance, 'distance >>>>>>> pointCheck2');

                            } else {

                                console.log('Oops! You may want to add this unique condition to checkGroundPoint function');
                                pointRealOnCircle.push([x2, y2]);
                                break;
                            }

                            if (distance <= distanceBetweenDamageSegments) {
                                // console.log('minimal distance is set');
                                pointRealOnCircle.push([x2, y2]);
                            }
                        }
                    }
                    // console.log('Loop is still working');
                }

                // console.log(pointRealOnCircle, 'pointRealOnCircle[i]');
                // replace damage points in segmentPoints array with extended damage points
                segmentPoints.splice(1, segmentPoints.length-2);
                for (let i = 0; i < pointRealOnCircle.length; i++) {
                    segmentPoints.splice((1 + i), 0, pointRealOnCircle[i]);
                }

                // console.log(segmentPoints[0],
                //     segmentPoints[1],
                //     segmentPoints[2],
                //     segmentPoints[3],
                //     segmentPoints[4],
                //     segmentPoints[5],
                //     segmentPoints[6],
                //     segmentPoints[7],
                //     segmentPoints[8],
                //     segmentPoints[9],
                //     segmentPoints[10],
                //     segmentPoints[11], 'segmentPoints');
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

                // console.log(array[0],
                //     array[1],
                //     array[2],
                //     array[3],
                //     array[4],
                //     array[5],
                //     array[6],
                //     array[7],
                //     array[8],
                //     array[9],
                //     array[10],
                //     array[11],
                //     array[12],
                //     array[13],
                //     array[14],
                //     array[15],
                //     array[16],
                //     array[17],
                //     array[18],
                //     array[19],
                //     array[20],
                //     array[21],
                //     array[22],
                //     array[23],
                //     array[24],
                //     array[25],
                //     array[26],
                //     array[27],
                //     array[28],
                //     array[29], 'originalPoints modified');

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

                pointsOfDamageCenterSegment = findPointOnSegment(array, damageX, damageY);
                if (pointsOfDamageCenterSegment == null) {
                    console.log('Point is out of the ground');
                }
                // TODO implement logic if pointOfDamageCenter is equal to point in originalPoints
                // console.log(pointsOfDamageCenterSegment[0], 'pointsOfDamageCenterSegment[0]');
                // console.log(pointsOfDamageCenterSegment[1], 'pointsOfDamageCenterSegment[1]');
                distanceFromDamageCenter1 = calculateDistance(damageX, damageY, pointsOfDamageCenterSegment[0][0], pointsOfDamageCenterSegment[0][1]);
                // console.log(distanceFromDamageCenter1, 'distanceFromDamageCenter1');
                distanceFromDamageCenter2 = calculateDistance(damageX, damageY, pointsOfDamageCenterSegment[1][0], pointsOfDamageCenterSegment[1][1]);
                // console.log(distanceFromDamageCenter2, 'distanceFromDamageCenter2');

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
                // console.log(segmentPairPoints, 'segmentPairPoints');

                // populating array pointsRebuild with points of area which is going to be modified
                pointsRebuild.push(segmentPairPoints[0]);
                for (let i = 1; i < segmentPairPoints.length; i++) {
                    pointsOnDamageLine = findIntersectionCoordinates(segmentPairPoints[i - 1][0], segmentPairPoints[i - 1][1], segmentPairPoints[i][0], segmentPairPoints[i][1], damageX, damageY, damageRadius);
                    // console.log(pointsOnDamageLine, 'pointsOnDamageLine');

                    segmentWithDamage1 = findPointOnSegment(array, pointsOnDamageLine[0][0], pointsOnDamageLine[0][1]);

                    segmentWithDamage2 = findPointOnSegment(array, pointsOnDamageLine[1][0], pointsOnDamageLine[1][1]);

                    if (segmentWithDamage1 != undefined) {
                        pointsOnDamageLine[0].push('inDamage');
                        pointsRebuild.push(pointsOnDamageLine[0]);
                        // console.log(pointsOnDamageLine[0], 'pointsOnDamageLine[0]');
                    }

                    if (segmentWithDamage2 != undefined) {
                        pointsOnDamageLine[1].push('inDamage');
                        pointsRebuild.push(pointsOnDamageLine[1]);
                        // console.log(pointsOnDamageLine[1], 'pointsOnDamageLine[1]');
                    }
                }

                // number of last point of damaged line-segment in canvas array
                numberOfLast = segmentPairPoints[segmentPairPoints.length - 1][2] + 1;
                pointsRebuild.push(array[numberOfLast]);
                // also setting index number from originalPoints array
                pointsRebuild[pointsRebuild.length - 1].push(numberOfLast);

                // console.log(pointsRebuild, 'pointsRebuild');
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

            const findCirclesIntersection = (x1, y1, r1, x2, y2, r2) => {
                // x1, y1, r1, x2, y2, r2 - are centre coordinates and radii of two circles - one of damage and one of distance between damage segments
                // d = a + b - distance between centers of two circles
                // p0 - point between a and b
                // h - distance between p0 and points of intersections: p3 and p4
                // console.log(x1, y1, r1, x2, y2, r2, 'x1, y1, r1, x2, y2, r2');
                let b = ( (Math.pow(r2, 2) - Math.pow(r1, 2) + Math.pow(r2, 2) ) / (2 * r2) );
                // console.log(b, 'b');

                let a = r2 - b;
                // console.log(a, 'a');

                let h = ( Math.sqrt( Math.pow(r1, 2) - Math.pow(a, 2) ) );
                // console.log(h, 'h');

                let p0x = x1 + a / r2 * (x2 - x1);
                // console.log(p0x, 'p0x');
                let p0y = y1 + a / r2 * (y2 - y1);
                // console.log(p0y, 'p0y');

                let p3x = Math.round(p0x + ( ( (y2 - y1) / r2 ) * h ) );
                // console.log(p3x, 'p3x');
                let p3y = Math.round(p0y - ( ( (x2 - x1) / r2 ) * h ) );
                // console.log(p3y, 'p3y');

                let p4x = Math.round(p0x - ( ( (y2 - y1) / r2 ) * h ) );
                // console.log(p4x, 'p4x');
                let p4y = Math.round(p0y + ( ( (x2 - x1) / r2 ) * h ) );
                // console.log(p4y, 'p4y');

                let point1 = [p3x, p3y];
                let point2 = [p4x, p4y];

                // console.log(point1, point2, 'point1, point2');
                return [point1, point2];
            };

            const checkGroundPoint = (point1x, point1y, point2x, point2y, pointIntersectionX, pointIntersectionY) => {
                // point1 always first on canvas
                // console.log(point1x, point1y, point2x, point2y, pointIntersectionX, pointIntersectionY, 'point1x, point1y, point2x, point2y, pointIntersectionX, pointIntersectionY ======= checkGroundPoint parameters');

                // general cases
                let conditions1x = (point1x < pointIntersectionX && pointIntersectionX < point2x);
                let conditions1y = (point1y < pointIntersectionY && pointIntersectionY > point2y);
                let conditions2x = (point1x > pointIntersectionX && pointIntersectionX < point2x);
                let conditions2y = (point1y < pointIntersectionY && pointIntersectionY < point2y);
                let conditions3x = (point1x > pointIntersectionX && pointIntersectionX > point2x);
                let conditions3y = (point1y > pointIntersectionY && pointIntersectionY < point2y);
                let conditions4x = (point1x < pointIntersectionX && pointIntersectionX > point2x);
                let conditions4y = (point1y > pointIntersectionY && pointIntersectionY > point2y);

                // cases when p1 == x and y == p2 or vise versa
                let conditions5x = (point1x < pointIntersectionX && pointIntersectionX == point2x);
                let conditions5y = (point1y == pointIntersectionY && pointIntersectionY > point2y);
                let conditions6x = (point1x == pointIntersectionX && pointIntersectionX > point2x);
                let conditions6y = (point1y > pointIntersectionY && pointIntersectionY == point2y);
                let conditions7x = (point1x > pointIntersectionX && pointIntersectionX == point2x);
                let conditions7y = (point1y == pointIntersectionY && pointIntersectionY < point2y);
                let conditions8x = (point1x == pointIntersectionX && pointIntersectionX < point2x);
                let conditions8y = (point1y < pointIntersectionY && pointIntersectionY == point2y);

                // TODO tons of cases
                // cases when p1 == y
                let conditions9x = (point1x < pointIntersectionX && pointIntersectionX < point2x);
                let conditions9y = (point1y == pointIntersectionY && pointIntersectionY > point2y);
                // let conditions6x = (point1x == pointIntersectionX && pointIntersectionX > point2x);
                // let conditions6y = (point1y > pointIntersectionY && pointIntersectionY == point2y);
                // let conditions7x = (point1x > pointIntersectionX && pointIntersectionX == point2x);
                // let conditions7y = (point1y == pointIntersectionY && pointIntersectionY < point2y);
                // let conditions8x = (point1x == pointIntersectionX && pointIntersectionX < point2x);
                // let conditions8y = (point1y < pointIntersectionY && pointIntersectionY == point2y);

                let conditions10x = (point1x > pointIntersectionX && pointIntersectionX > point2x);
                let conditions10y = (point1y > pointIntersectionY && pointIntersectionY > point2y);

                let conditions1 = (conditions1x && conditions1y);
                let conditions2 = (conditions2x && conditions2y);
                let conditions3 = (conditions3x && conditions3y);
                let conditions4 = (conditions4x && conditions4y);
                let conditions5 = (conditions5x && conditions5y);
                let conditions6 = (conditions6x && conditions6y);
                let conditions7 = (conditions7x && conditions7y);
                let conditions8 = (conditions8x && conditions8y);
                let conditions9 = (conditions9x && conditions9y);
                let conditions10 = (conditions10x && conditions10y);

                if (conditions1 || conditions2 || conditions3 || conditions4 || conditions5 || conditions6 || conditions7 || conditions8 || conditions9 || conditions10) {
                    return [pointIntersectionX, pointIntersectionY];
                }

                return false;
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
                        // console.log(foundPoint, 'foundPoint');

                        point1 = [x1, y1, (i - 1)];
                        point2 = [x2, y2, i];
                        // console.log([point1, point2], 'foundPoint lays on a line-segment between these coordinates');
                        return [point1, point2];
                    }
                }
                return null;
            };

            const calculateLineEquation = (x1, y1, x2, y2, segmentX, segmentY) => {
                /*defines point which coordinates lays on the line of segment*/
                let y = Math.round( ( (segmentX - x1) * (y2 - y1) ) / (x2 - x1) + y1 );
                // console.log(y, 'y outside');
                if ( (y) <= segmentY && segmentY <= (y) ) {
                    // console.log(y, 'y inside');
                    return y;
                }
            };

            // let segmentPoints = calculateDamageArea(originalPoints, damageX, damageY);

            (function initialization() {
                clear();
                drawSky();
                drawGround();

                pattern = ctx.createPattern(backCanvas, "no-repeat");
                tankX = Math.floor((Math.random() * 330) + 30);
                tankY = findLinePoints(tankX);
                // rad = 10;
                //circle(tankX, tankY, rad);
                drawTank(tankX, tankY);
                fillBackground();
            })();
    }
});
