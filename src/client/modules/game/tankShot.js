'use strict';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// console.log('ctx ', ctx);

var poligon = function(array, color) {
    ctx.beginPath();

    array.forEach(function(pair, number) {
        if(number == 0) {
            ctx.moveTo(pair[0], pair[1]);
        } else {
            ctx.lineTo(pair[0], pair[1]);
        }
    });
    ctx.fillStyle=color;
    ctx.fill();
    ctx.closePath();
};



var drawSky = function(){
    var grd=ctx.createLinearGradient(0,0,0,500);
    grd.addColorStop(0,"#172059");
    grd.addColorStop(0.3,"#6D6D85");
    grd.addColorStop(1,"#A0837D");

    ctx.fillStyle=grd;
    ctx.fillRect(0,0,800,500);
};

var originalPoints = [[0, 300],[20, 305],[40, 330],[145, 345],[125, 400],[165, 350],[175, 360],[220, 370],
    [240, 320],[280, 300],[300, 270],[340, 200],[370, 170],[440, 190],[550, 430],[530, 370],[540, 330],
    [575, 310],[630, 340],[685, 340],[690, 355],[700, 340],[750, 300],[755, 305],[795, 270],[800, 270],
    [800, 500],[0, 500],[0, 300]];

// for (var i = 0; i < originalPoints.length; i++) {
//     console.log(originalPoints[i], 'points[i]');
// }

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
    // console.log(segmentPoints, 'segmentPoints');

    let pointsOfIntersect = [];
    for (let i = 0; i < segmentPoints.length; i++) {
        if (segmentPoints[i][2] == 'inDamage') {
            pointsOfIntersect.push(segmentPoints[i]);
        }
    }
    console.log(pointsOfIntersect, 'pointsOfIntersect');

    let x1, y1, x2, y2, distance, pointsOnCircles;
    // setting distanceBetweenDamageSegments static as a distance between points of damaged ground
    let distanceBetweenDamageSegments = 15;
    for (let i = 1; i < pointsOfIntersect.length; i++) {
        x1 = pointsOfIntersect[i - 1][0];
        y1 = pointsOfIntersect[i - 1][1];
        x2 = pointsOfIntersect[i][0];
        y2 = pointsOfIntersect[i][1];
        console.log(x1, y1, x2, y2, 'x1, y1, x2, y2');
        
        distance = calculateDistance(x1, y1, x2, y2);
        console.log(distance, 'distance');
        if (distance <= distanceBetweenDamageSegments) {
            // TODO
            console.log('DO NOT HAVE TO CALCULATE');
        } else {
            pointsOnCircles = findCirclesIntersection(x1, y1, distanceBetweenDamageSegments, damageX, damageY, damageRadius);
            console.log(pointsOnCircles, 'pointsOnCircles');
        }
    }

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

const calculateDistance = (x1, y1, x2, y2) => {
    /*check distance between two points coordinates*/
    return Math.round( (Math.sqrt( Math.pow( (x2 - x1), 2 ) + ( Math.pow( (y2 - y1), 2 ) ) )) );
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

    let p3x = (p0x + ( ( (y2 - y1) / r2 ) * h ) );
    // console.log(p3x, 'p3x');
    let p3y = (p0y - ( ( (x2 - x1) / r2 ) * h ) );
    // console.log(p3y, 'p3y');

    let p4x = (p0x - ( ( (y2 - y1) / r2 ) * h ) );
    // console.log(p4x, 'p4x');
    let p4y = (p0y + ( ( (x2 - x1) / r2 ) * h ) );
    // console.log(p4y, 'p4y');

    let point1 = [p3x, p3y];
    let point2 = [p4x, p4y];

    // console.log(point1, point2, 'point1, point2');
    return [point1, point2];
};

// const findCirclesIntersection = (x1, y1, r1, x2, y2, r2) => {
//     // x1, y1, r1, x2, y2, r2 - are centre coordinates and radii of two circles - one of damage and one of distance between damage segments
//     console.log(x1, y1, r1, x2, y2, r2, 'x1, y1, r1, x2, y2, r2');
//     let m = ( (y1 - y2) / (x1 - x2) );
//     console.log(m, 'm');
//     let k = ( ( (Math.pow(r2, 2) - Math.pow(r1, 2)) - (Math.pow(y2, 2) - Math.pow(y1, 2)) - (Math.pow(x2, 2) - Math.pow(x1, 2)) ) / (2 * (x1 - x2)) );
//     console.log(k, 'k');
//
//     let a = (Math.pow(m, 2) + 1);
//     console.log(a, 'a');
//     let b = ( (2 * x1 * m) - (2 * m * k) - (2 * y1) );
//     console.log(b, 'b');
//     let c = ( Math.pow(y1, 2) - Math.pow(r1, 2) + (Math.pow((k - x1), 2)) );
//     console.log(c, 'c');
//     let d = Math.pow(b, 2) - 4 * a * c;
//     console.log(d, 'd');
//
//     let yPoint1 = (-b + Math.sqrt(d)) / 2 * a;
//     console.log(yPoint1, 'yPoint1');
//     let yPoint2 = (-b - Math.sqrt(d)) / 2 * a;
//     console.log(yPoint2, 'yPoint2');
//
//     let xPoint1 = k - m * yPoint1;
//     console.log(xPoint1, 'xPoint1');
//     let xPoint2 = k - m * yPoint2;
//     console.log(xPoint2, 'xPoint2');
//
//     let point1 = [xPoint1, yPoint1];
//     let point2 = [xPoint2, yPoint2];
//
//     console.log(point1, point2, 'point1, point2');
//     return [point1, point2];
// };

const checkGroundPoint = (point1, point2) => {

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

const drawPoints = (x, y) => {
    ctx.beginPath();
    ctx.fillStyle = '#eeeeee';
    ctx.fillRect(x, y, 5, 5);
    ctx.closePath();
};

const drawCircle = (x, y, r) => {
    ctx.beginPath();
    ctx.fillStyle = '#ee55ee';
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.closePath();
};

// const calculateCircleEquation = (damageX, damageY, damageRadius, y) => {
//     let x = Math.round( damageX + (Math.sqrt( (Math.pow(damageRadius, 2)) - (Math.pow((y - damageY), 2)) )) );
//     console.log(x, 'x');
//     return x;
// };

let segmentPoints = calculateDamageArea(originalPoints);

drawSky();
drawGround();

drawPoints(damageX, damageY);
drawCircle(damageX, damageY, damageRadius);
for (let i = 0; i < segmentPoints.length; i++) {

    drawPoints(segmentPoints[i][0], segmentPoints[i][1]);

}
// drawPoints(segmentPoints[0][2], segmentPoints[0][3]);
// drawPoints(segmentPoints[1][0], segmentPoints[1][1]);
// drawPoints(segmentPoints[1][2], segmentPoints[1][3]);
