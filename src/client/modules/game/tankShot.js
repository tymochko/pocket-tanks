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

// var points = [[0, 300],[20, 305],[40, 330],[145, 345],[125, 400],[165, 350],[175, 360],[220, 370],
//     [240, 320],[280, 300],[300, 270],[340, 200],[370, 170],[440, 190],[550, 430],[530, 370],[540, 330],
//     [575, 310],[630, 340],[685, 340],[690, 355],[700, 340],[750, 300],[755, 305],[795, 270],[800, 270],
//     [800, 500],[0, 500],[0, 300]];
//
// // for (var i = 0; i < points.length; i++) {
// //     console.log(points[i], 'points[i]');
// // }
//
// var drawGround = function(){
//     var colors = ['#040905', '#030C37', '#352E58', '#2F010B', '#991E23', '#E72E10', '#FFC057','#F8F984'];
//     colors.forEach(function (color) {
//         poligon(points, color);
//
//         points = points.map(function(pair) {
//             pair[1] = pair[1] + 40;
//             return pair; // в ретурн лише вираз
//         });
//     })
// };

var originalPoints = [[0, 300],[20, 305],[40, 330],[145, 345],[125, 400],[165, 350],[175, 360],[220, 370],
    [240, 320],[280, 300],[300, 270],[340, 200],[370, 170],[440, 190],[550, 430],[530, 370],[540, 330],
    [575, 310],[630, 340],[685, 340],[690, 355],[700, 340],[750, 300],[755, 305],[795, 270],[800, 270],
    [800, 500],[0, 500],[0, 300]];

var drawGround = function(){

    var points = originalPoints;

    var colors = ['#040905', '#030C37', '#352E58', '#2F010B', '#991E23', '#E72E10', '#FFC057','#F8F984'];
    colors.forEach(function (color) {
        poligon(points, color);

        points = points.map(function(pair) {
            return [pair[0], pair[1] + 40];
        });
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
// let damageX = 267;
// let damageY = 305;
// let damageX = 350;
// let damageY = 185;
let damageX = 450;
let damageY = 215;
// let damageX = 500;
// let damageY = 325;
let damagePower = 5;

const calculateDamageArea = (array) => {
    let damageRadius = 10 * damagePower;

    // let leftSegmentPoints = findSegmentLeft(array, damageX, damageY, damageRadius);
    // let rightSegmentPoints = findSegmentRight(array, damageX, damageY, damageRadius);
    let segmentPoints = findSegment(array, damageX, damageY, damageRadius);

    // TODO calculate points which are even for every ground area
    /*
     4) build damageCoordinates in 90 deg in respect to closest 'points'
     */

    // damageCoordinates = [
    //     [(damageX - damageRadius), damageY],
    //     [(damageX - damageRadius), (damageY + damageRadius / 2)],
    //     [damageX, (damageY + damageRadius)],
    //     [(damageX + damageRadius), (damageY + damageRadius / 2)],
    //     [(damageX + damageRadius), damageY]
    // ];
    // console.log('damageCoordinates ', damageCoordinates[0], damageCoordinates[1], damageCoordinates[2], damageCoordinates[3], damageCoordinates[4]);

    console.log(segmentPoints, 'segmentPoints');
    return segmentPoints;
};

const calculateDistance = (damageX, damageY, arrayX, arrayY) => {
    /*check distance between centre of damage and canvas points coordinates*/
    return Math.round( (Math.sqrt( Math.pow( (arrayX - damageX), 2 ) + ( Math.pow( (arrayY - damageY), 2 ) ) )) );
};

const findSegmentLeft = (array, damageX, damageY, damageRadius) => {
    let segmentLeftX1;
    let segmentLeftY1;
    let segmentLeftX2;
    let segmentLeftY2;

    for (var i = 0; i < array.length; i++) {
        let distance = calculateDistance(damageX, damageY, array[i][0], array[i][1]);
        console.log(distance, 'distance 1');

        /*TODO
        * ??? should I check if hit point (center of damage) lays on the line-segment?
        * 1) check distance from hit point to closest coordinates of line-segment
        * 2) if this found distance is larger than damageRadius - implement this issue as unique */
        if (distance <= damageRadius) {
            console.log(distance, 'distance 2');
            segmentLeftX1 = array[i][0];
            segmentLeftY1 = array[i][1];
            segmentLeftX2 = array[i -1][0];
            segmentLeftY2 = array[i -1][1];

            console.log(segmentLeftX1, segmentLeftY1, segmentLeftX2, segmentLeftY2, 'segmentLeft: X1, Y1, X2, Y2');
            break;
        }
    }

    let leftSegmentPoints = findIntersectionCoordinates(segmentLeftX1, segmentLeftY1, segmentLeftX2, segmentLeftY2, damageX, damageY, damageRadius);
    console.log(leftSegmentPoints, 'leftSegmentPoints');

    let foundPoint1 = findPointOnSegment(array, leftSegmentPoints[0], leftSegmentPoints[1]);
    let foundPoint2 = findPointOnSegment(array, leftSegmentPoints[2], leftSegmentPoints[3]);
    
    if (foundPoint1) {
        return foundPoint1;
    }
    return foundPoint2;

};

// const findSegmentRight = (array, damageX, damageY, damageRadius) => {
//     let segmentRightX1;
//     let segmentRightY1;
//     let segmentRightX2;
//     let segmentRightY2;
//
//     for (var i = (array.length - 1); i >= 0; i--) {
//         let distance = calculateDistance(damageX, damageY, damageRadius, array[i][0], array[i][1]);
//
//         if (distance <= damageRadius) {
//             console.log(distance, 'distance');
//             segmentRightX1 = array[i + 1][0];
//             segmentRightY1 = array[i + 1][1];
//             segmentRightX2 = array[i][0];
//             segmentRightY2 = array[i][1];
//
//             console.log(segmentRightX1, 'segmentRightX1');
//             console.log(segmentRightY1, 'segmentRightY1');
//             console.log(segmentRightX2, 'segmentRightX2');
//             console.log(segmentRightY2, 'segmentRightY2');
//             break;
//         }
//     }
//
//     let rightSegmentPoints = findIntersectionCoordinates(segmentRightX1, segmentRightY1, segmentRightX2, segmentRightY2, damageX, damageY, damageRadius);
//     console.log(rightSegmentPoints, 'rightSegmentPoints');
//
//     let foundPoint1 = findPointOnSegment(array, rightSegmentPoints[0], rightSegmentPoints[1]);
//     let foundPoint2 = findPointOnSegment(array, rightSegmentPoints[2], rightSegmentPoints[3]);
//
//     if (foundPoint1 != undefined) {
//         return foundPoint1;
//     } else {
//         return foundPoint2;
//     }
// };

const findSegment = (array, damageX, damageY, damageRadius) => {
    // let segmentLeftX;
    // let segmentLeftY;
    // let segmentRightX;
    // let segmentRightY;
    let segmentPairPoints = [];
    let distance;
    let distanceArray = [];
    
    let coordinatesOfDamageCenter = findPointOnSegment(array, damageX, damageY);
    console.log(coordinatesOfDamageCenter, 'coordinatesOfDamageCenter');
    let distanceOfDamageCenter1 = calculateDistance(damageX, damageY, coordinatesOfDamageCenter[0], coordinatesOfDamageCenter[1]);
    console.log(distanceOfDamageCenter1, 'distanceOfDamageCenter1');
    let distanceOfDamageCenter2 = calculateDistance(damageX, damageY, coordinatesOfDamageCenter[2], coordinatesOfDamageCenter[3]);
    console.log(distanceOfDamageCenter2, 'distanceOfDamageCenter2');
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!
    for (let i = 0; i <= (array.length - 1); i++) {
        // console.log(array[i], 'array[i]');
        distance = calculateDistance(damageX, damageY, array[i][0], array[i][1]);
        distanceArray.push(distance);
        
        if (distance <= damageRadius) {
            // console.log(distance, 'distance');
            segmentPairPoints.push([array[i - 1][0], array[i - 1][1], array[i][0], array[i][1], i]);
            console.log(segmentPairPoints, 'segmentPairPoints');
        }
    }

    for (let i = 0; i < distanceArray.length; i++) {
        console.log(distanceArray[i], 'distanceArray');


    }

    // let segmentPoints = findIntersectionCoordinates(segmentLeftX, segmentLeftY, segmentRightX, segmentRightY, damageX, damageY, damageRadius);
    // console.log(segmentPoints, 'segmentPoints');

    // let foundPoint1 = findPointOnSegment(array, segmentPoints[0][0], segmentPoints[0][1]);
    // let foundPoint2 = findPointOnSegment(array, segmentPoints[1][0], segmentPoints[1][1]);

    // if (foundPoint1 != undefined) {
    //     return foundPoint1;
    // } else {
    //     return foundPoint2;
    // }
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

const findPointOnSegment = (array, segmentX, segmentY) => {
    /*defines point which coordinates lays on the line-segment of canvas*/
    let x1;
    let y1;
    let x2;
    let y2;

    let foundPoint;

    for (var i = 1; i < array.length; i++) {
        x1 = array[i - 1][0];
        y1 = array[i - 1][1];
        x2 = array[i][0];
        y2 = array[i][1];

        foundPoint = calculateLineEquation(x1, y1, x2, y2, segmentX, segmentY);

        if ( ((y1 <= foundPoint) && (foundPoint <= y2)) || ((y2 <= foundPoint) && (foundPoint <= y1)) ) {
            console.log(foundPoint, 'foundPoint');

            console.log([x1, y1, x2, y2, segmentX, segmentY], 'foundPoint lays on a segment of canvas');
            return [x1, y1, x2, y2, segmentX, segmentY];
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

// const calculateCircleEquation = (damageX, damageY, damageRadius, y) => {
//     let x = Math.round( damageX + (Math.sqrt( (Math.pow(damageRadius, 2)) - (Math.pow((y - damageY), 2)) )) );
//     console.log(x, 'x');
//     return x;
// };

let segmentPoints = calculateDamageArea(originalPoints);

drawSky();
drawGround();

drawPoints(damageX, damageY);
// drawPoints(segmentPoints[0][0], segmentPoints[0][1]);
// drawPoints(segmentPoints[0][2], segmentPoints[0][3]);
// drawPoints(segmentPoints[1][0], segmentPoints[1][1]);
// drawPoints(segmentPoints[1][2], segmentPoints[1][3]);
