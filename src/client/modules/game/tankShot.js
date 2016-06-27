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

var points = [[0, 300],[20, 305],[40, 330],[145, 345],[125, 400],[165, 350],[175, 360],[220, 370],
    [240, 320],[280, 300],[300, 270],[340, 200],[370, 170],[440, 190],[550, 430],[530, 370],[540, 330],
    [575, 310],[630, 340],[685, 340],[690, 355],[700, 340],[750, 300],[755, 305],[795, 270],[800, 270],
    [800, 500],[0, 500],[0, 300]];

// console.log('points 0 ', points[3], points[4], points[5], points[6]);

var drawGround = function(){
    var colors = ['#040905', '#030C37', '#352E58', '#2F010B', '#991E23', '#E72E10', '#FFC057','#F8F984'];
    colors.forEach(function (color) {
        poligon(points, color);

        points = points.map(function(pair) {
            pair[1] = pair[1] + 40;
            return pair; // в ретурн лише вираз
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

let damageX = 140;
let damageY = 340;
let damagePower = 5;

let damageCenter = [damageX, damageY];
let damageCenterX = damageCenter[0];
let damageCenterY = damageCenter[1];
let damageCoordinates;

const calculateDamageArea = (array) => {
    let damageRadius = 10 * damagePower;
    // console.log('damageRadius ', damageRadius);
    let damageCoordinatesMin = [(damageX - damageRadius), (damageY - damageRadius)];
    let damageCoordinatesMax = [(damageX + damageRadius), (damageY + damageRadius)];

    console.log(damageCoordinatesMin, 'damageCoordinatesMin');
    findSegment(array, damageCoordinatesMin, damageX, damageY, damageRadius);

    // console.log(damageCoordinatesMax, 'damageCoordinatesMax');
    // findSegment(array, damageCoordinatesMax, damageX, damageY, damageRadius);


    // TODO calculate points which are even for every ground area
    /*
     4) build damageCoordinates in 90 deg in respect to closest 'points'
     */

    damageCoordinates = [
        [(damageCenterX - damageRadius), damageCenterY],
        [(damageCenterX - damageRadius), (damageCenterY + damageRadius / 2)],
        [damageCenterX, (damageCenterY + damageRadius)],
        [(damageCenterX + damageRadius), (damageCenterY + damageRadius / 2)],
        [(damageCenterX + damageRadius), damageCenterY]
    ];
    console.log('damageCoordinates ', damageCoordinates[0], damageCoordinates[1], damageCoordinates[2], damageCoordinates[3], damageCoordinates[4]);


};

const findSegment = (array, neededCoordinates, damageX, damageY, damageRadius) => {
    let x1, y1, x2, y2;

    for (var i = 0; i < array.length; i++) {
        if (neededCoordinates[0] <= array[i][0]) {
            x1 = array[i][0];
            y1 = array[i][1];
            x2 = array[i -1][0];
            y2 = array[i -1][1];

            break;
        }
    }

    // console.log('x1 ', x1);
    // console.log('y1 ', y1);
    // console.log('x2 ', x2);
    // console.log('y2 ', y2);
    //
    // console.log(damageX, 'damageX');
    // console.log(damageY, 'damageY');
    // console.log(damageRadius, 'damageRadius');

    solveEquation(x1, y1, x2, y2, damageX, damageY, damageRadius);
};

const solveEquation = (x1, y1, x2, y2, cX, cY, r) => {
    /* x1, y1 and x2, y2 - are coordinates of line-segment on canvas
     * cX, cY and r - are coordinates of center of damage and a radius */

    /* using line equation formula (y = m*x + k) */
    let m = ( (y2 - y1) / (x2 - x1) );
    let k = (y1 - m * x1);

    /* using circle equation formula (a*x^2 + b*x + c = 0) */
    let a = (Math.pow(m, 2) + 1);
    let b = 2 * (m * k - m * cY - cX);
    let c = ( Math.pow(cY, 2) - Math.pow(r, 2) + Math.pow(cX, 2) - 2 * k * cY + Math.pow(k, 2) );

    let xPlus = Math.round( ( -b + ( Math.sqrt( (Math.pow(b, 2)) -4 * a * c ) ) ) / (2 * a) );
    console.log(xPlus, 'xPlus');
    let xMinus = Math.round( ( -b - ( Math.sqrt( (Math.pow(b, 2)) -4 * a * c ) ) ) / (2 * a) );
    console.log(xMinus, 'xMinus');

    /* using line equation fomula again to calculate two variants of y */
    let yPlus = Math.round(m * xPlus + k);
    let yMinus = Math.round(m * xMinus + k);
    console.log(yPlus, 'yPlus');
    console.log(yMinus, 'yMinus');
};

// const calculateLineEquation = (x1, y1, x2, y2, x) => {
//     console.log(x1, 'x1');
//     console.log(y1, 'y1');
//     console.log(x2, 'x2');
//     console.log(y2, 'y2');
//     console.log(x, 'x');
//     let y = Math.round( ( (x - x1) * (y2 - y1) ) / (x2 - x1) + y1 );
//     console.log(y, 'y');
//     return y;
// };
//
// calculateLineEquation(40, 330, 145, 345, 90);
//
// const calculateCircleEquation = (damageX, damageY, damageRadius, y) => {
//     let x = Math.round( damageX + (Math.sqrt( (Math.pow(damageRadius, 2)) - (Math.pow((y - damageY), 2)) )) );
//     console.log(x, 'x');
//     return x;
// };
//
// calculateCircleEquation(140, 340, 50, 337);

const findGround = (array) => {
    // array.map((currentValue, index, array) => {
    //
    //     if (damageCenterX <= currentValue[0]) {
    //         console.log('currentValue[0] ', currentValue[0]);
    //
    //         if (damageCenterY <= currentValue[1]) {
    //             console.log('currentValue[1] ', currentValue[1]);
    //
    //             let currentGroundElement = index;
    //
    //             array.splice(currentGroundElement, 1);
    //
    //             for (var j = (damageCoordinates.length - 1); j >= 0; j--) {
    //                 array.splice(currentGroundElement, 0, damageCoordinates[j]);
    //             }
    //         }
    //     }
    // });

    // for (var i = 0; i < array.length; i++) {
    //     if (damageCenterX <= array[i][0]) {
    //         console.log('array[i][0] ', array[i][0]);
    //
    //         if (damageCenterY <= array[i][1]) {
    //             console.log('array[i][1] ', array[i][1]);
    //
    //             let currentGroundElement = i;
    //
    //             array.splice(currentGroundElement, 1);
    //
    //             for (var j = (damageCoordinates.length - 1); j >= 0; j--) {
    //                 array.splice(currentGroundElement, 0, damageCoordinates[j]);
    //             }
    //
    //             break;
    //         }
    //
    //     }
    // }
};



const generateDamagedCanvas = () => {
    calculateDamageArea(points);
    findGround(points);
};

generateDamagedCanvas();

drawSky();
drawGround();


