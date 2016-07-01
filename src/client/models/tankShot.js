'use strict';

//      <------initialization------>
document.addEventListener("DOMContentLoaded", function(){
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

    var poligon = function(array, color) {
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
            poligon(points, color);

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
    tankImage.src = './public/images/tankVehicle.png';
    weaponImage.src = './public/images/tankWeapon.png';
    tankImage.onload = function() { 
    	ctx.drawImage(tankImage, xCoordinate, yCoordinate - 30, tankWidth, tankHeight); 
    }
    weaponImage.onload = function() { 
		ctx.drawImage(weaponImage, xCoordinate + 45, yCoordinate - 44, weaponWidth, weaponHeight);
    }
    console.log("hello");
};

    // <------Tank movement------>

    var findLinePoints = function(posX) {
        var arr = [];

        for(var i = originalPoints.length - 1; i > 0; i--) {
            if(originalPoints[i][0] >= posX && originalPoints[i-1][0] <= posX) {
                var x1 = originalPoints[i-1][0],
                x2 = originalPoints[i][0],
                y1 = originalPoints[i-1][1],
                y2 = originalPoints[i][1];
                console.log("Vova: " + x1 + " " + x2 + " " + y1 + " " + y2);
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
        }
    }
    window.addEventListener('keydown',doKeyDown,true);
    //      <------Yuri's part - name it yourself------>

    // for (var i = 0; i < originalPoints.length; i++) {
    //     console.log(originalPoints[i], 'points[i]');
    // }



    // window.setInterval(function(){
    //     drawSky();
    //     drawGround();
    //     // if (Math.random() <= 0.1) {
    //     //     ctx.fillStyle='rgba(255, 255, 255, .5)';
    //     //     ctx.fillRect(0, 0, 800, 500);
    //     //     drawLightning(370, 0);
    //     // }
    // }, 100);

    // let damageX = 98;
    // let damageY = 335;
    let damageX = 267;
    let damageY = 305;
    // let damageX = 350;
    // let damageY = 185;
    // let damageX = 450;
    // let damageY = 215;
    // let damageX = 500;
    // let damageY = 325;
    let damagePower = 5;
    let damageRadius = 10 * damagePower;

    const calculateDamageArea = (array) => {

        let segmentPoints = findSegment(array, damageX, damageY, damageRadius);

        console.log(segmentPoints, 'segmentPoints');

        // for (let i = 0; i < segmentPoints.length; i+2) {
        //     if (segmentPoints[i][2] == 'inDamage') {
        //
        //     }
        // }

        // array with coordinates of rebuild points only. Without special parameters
        let pointsInsert = [];
        for (let i = 0; i < segmentPoints.length; i++) {
            pointsInsert.push([segmentPoints[i][0], segmentPoints[i][1]]);
        }

        // // deleting points from original array of ground
        // array.splice(segmentPoints[0][2], pointsInsert.length);
        // // and replacing them by rebuild points
        // for (let i = 0; i < pointsInsert.length; i++) {
        //     console.log(pointsInsert[i]);
        //     array.splice(segmentPoints[0][2] + i, 0, pointsInsert[i]);
        // }

        // for (var i = 0; i < array.length; i++) {
        //     console.log(array[i], 'points[i]');
        // }

        return segmentPoints;
    };

    const calculateDistance = (damageX, damageY, arrayX, arrayY) => {
        /*check distance between centre of damage and canvas points coordinates*/
        return Math.round( (Math.sqrt( Math.pow( (arrayX - damageX), 2 ) + ( Math.pow( (arrayY - damageY), 2 ) ) )) );
    };

    const findSegment = (array, damageX, damageY, damageRadius) => {
        let segmentPairPoints = [];
        let distance;

        let pointsOfDamageCenterSegment = findPointOnSegment(array, damageX, damageY);
        console.log(pointsOfDamageCenterSegment, 'pointsOfDamageCenterSegment');
        let distanceFromDamageCenter1 = calculateDistance(damageX, damageY, pointsOfDamageCenterSegment[0][0], pointsOfDamageCenterSegment[0][1]);
        console.log(distanceFromDamageCenter1, 'distanceFromDamageCenter1');
        let distanceFromDamageCenter2 = calculateDistance(damageX, damageY, pointsOfDamageCenterSegment[1][0], pointsOfDamageCenterSegment[1][1]);
        console.log(distanceFromDamageCenter2, 'distanceFromDamageCenter2');
        if (distanceFromDamageCenter1 >= damageRadius || distanceFromDamageCenter2 >= damageRadius) {
            segmentPairPoints.push(pointsOfDamageCenterSegment[0]);
            segmentPairPoints.push(pointsOfDamageCenterSegment[1]);
        }

        for (let i = 0; i <= (array.length - 1); i++) {
            distance = calculateDistance(damageX, damageY, array[i][0], array[i][1]);

            if (distance <= damageRadius) {
                // setting extra property 1 - point is within damage radius, 0 - outside
                segmentPairPoints.push([array[i - 1][0], array[i - 1][1], i - 1]);
                segmentPairPoints.push([array[i][0], array[i][1], i]);
                // segmentPairPoints.push([array[i - 1][0], array[i - 1][1], i - 1, 1]);
                // segmentPairPoints.push([array[i][0], array[i][1], i, 1]);
            }
        }
        segmentPairPoints.sort();

        // removing duplicated coordinates
        for (let i = 1; i < segmentPairPoints.length; i++) {
            if (segmentPairPoints[i][2] == segmentPairPoints[i - 1][2]) {
                segmentPairPoints.splice(i, 1);
            }
        }
        console.log(segmentPairPoints, 'segmentPairPoints');

        let pointsRebuild = [];
        pointsRebuild.push(segmentPairPoints[0]);

        for (let i = 1; i < segmentPairPoints.length; i++) {
            let pointsOnDamageLine = findIntersectionCoordinates(segmentPairPoints[i - 1][0], segmentPairPoints[i - 1][1], segmentPairPoints[i][0], segmentPairPoints[i][1], damageX, damageY, damageRadius);
            console.log(pointsOnDamageLine, 'pointsOnDamageLine');

            let segmentWithDamage1 = findPointOnSegment(array, pointsOnDamageLine[0][0], pointsOnDamageLine[0][1]);

            let segmentWithDamage2 = findPointOnSegment(array, pointsOnDamageLine[1][0], pointsOnDamageLine[1][1]);

            // TODO if (segmentWithDamage1 == undefined && segmentWithDamage2 == undefined) {
            // }
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
        let numberOfLast = segmentPairPoints[segmentPairPoints.length - 1][2] + 1;
        pointsRebuild.push(array[numberOfLast]);
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

    // const findCirclesIntersection = () => {
    //
    // };

    const findPointOnSegment = (array, segmentX, segmentY) => {
        /*defines point which coordinates lays on the line-segment of canvas*/
        let x1;
        let y1;
        let x2;
        let y2;
        let foundPoint;
        let point1;
        let point2;

        for (var i = 1; i < array.length; i++) {
            x1 = array[i - 1][0];
            y1 = array[i - 1][1];
            x2 = array[i][0];
            y2 = array[i][1];

            foundPoint = calculateLineEquation(x1, y1, x2, y2, segmentX, segmentY);

            if ( ((y1 <= foundPoint) && (foundPoint <= y2)) || ((y2 <= foundPoint) && (foundPoint <= y1)) ) {
                console.log(foundPoint, 'foundPoint');

                point1 = [x1, y1, i - 1];
                point2 = [x2, y2, i];
                console.log([point1, point2], 'foundPoint lays on a line-segment between these coordinates');
                return [point1, point2];
            }
        }

        return null;
    };

    const calculateLineEquation = (x1, y1, x2, y2, segmentX, segmentY) => {
        /*defines point which coordinates lays on the line of segment*/
        let y = Math.round( ( (segmentX - x1) * (y2 - y1) ) / (x2 - x1) + y1 );
        if ( (y - 5) <= segmentY && segmentY <= (y + 5) ) {
            console.log(y, 'y');
            return y;
        }
    };

    // const drawDamage = () => {
    //
    // };

    const drawPoints = (x, y) => {
        backCtx.beginPath();
        backCtx.fillStyle = '#eeeeee';
        backCtx.fillRect(x, y, 5, 5);
        backCtx.closePath();
    };

    const drawCircle = (x, y, r) => {
        backCtx.beginPath();
        backCtx.fillStyle = '#ee55ee';
        backCtx.arc(x, y, r, 0, Math.PI * 2, false);
        backCtx.stroke();
        backCtx.closePath();
    };

    // const calculateCircleEquation = (damageX, damageY, damageRadius, y) => {
    //     let x = Math.round( damageX + (Math.sqrt( (Math.pow(damageRadius, 2)) - (Math.pow((y - damageY), 2)) )) );
    //     console.log(x, 'x');
    //     return x;
    // };

    let segmentPoints = calculateDamageArea(originalPoints);


    for (let i = 0; i < segmentPoints.length; i++) {

        drawPoints(segmentPoints[i][0], segmentPoints[i][1]);

    }
    // drawPoints(segmentPoints[0][2], segmentPoints[0][3]);
    // drawPoints(segmentPoints[1][0], segmentPoints[1][1]);
    // drawPoints(segmentPoints[1][2], segmentPoints[1][3]);

    (function initialization() {
        clear();
        drawSky();
        drawGround();
        drawPoints(damageX, damageY);
        drawCircle(damageX, damageY, damageRadius);

        pattern = ctx.createPattern(backCanvas, "no-repeat");
        tankX = Math.floor((Math.random() * 330) + 30);
        tankY = findLinePoints(tankX);
        rad = 10;
        //circle(tankX, tankY, rad);
        drawTank(tankX, tankY);
        fillBackground();
    })();
});