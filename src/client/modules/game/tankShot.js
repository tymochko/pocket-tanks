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

console.log('points 0 ', points[3], points[4], points[5], points[6]);

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

let damageX = 145;
let damageY = 345;
let damagePower = 5;
//
let damageCenter = [damageX, damageY];
let damageCenterX = damageCenter[0];
let damageCenterY = damageCenter[1];
// let damageCoordsMin = [(damageX - damageRadius), (damageY - damageRadius)];
// let damageCoordsMax = [(damageX + damageRadius), (damageY + damageRadius)];
let damageCoords;

const calculateDamageArea = (array) => {
    let damageRadius = 10 * damagePower;
    // TODO calculate points which are even for every ground area
    /*
     1) find distance between closest 'points'
     2) compare to radius
     3) if radius is smaller - proceed with current closest 'points' - else -
        proceed with next closest 'points'
     4) build damageCoords in 90 deg in respect to closest 'points'
     */
    let distance;
    let x2 = array
    const calculateDistance = () => {
        distance = Math.sqrt( () );
    };

    damageCoords = [
        [(damageCenterX - damageRadius), damageCenterY],
        [(damageCenterX - damageRadius), (damageCenterY + damageRadius / 2)],
        [damageCenterX, (damageCenterY + damageRadius)],
        [(damageCenterX + damageRadius), (damageCenterY + damageRadius / 2)],
        [(damageCenterX + damageRadius), damageCenterY]
    ];
    console.log('damageCoords ', damageCoords[0], damageCoords[1], damageCoords[2], damageCoords[3], damageCoords[4]);

    return damageCoords;

    // ctx.beginPath();
    //
    // ctx.arc(damageX, damageY, damageRadius, 0, Math.PI*2, false);
    // ctx.stroke();
    //
    // ctx.closePath();
};

const findGround = (array) => {
    array.map((currentValue, index, array) => {
        if (damageCenterX == currentValue[0]) {
            console.log('currentValue[0] ', currentValue[0]);

            if (damageCenterY == currentValue[1]) {
                console.log('currentValue[1] ', currentValue[1]);

                let currentGroundElement = index;

                array.splice(currentGroundElement, 1);

                for (var j = (damageCoords.length - 1); j >= 0; j--) {
                    array.splice(currentGroundElement, 0, damageCoords[j]);
                }
            }
        }
    });
    // for (var i = 0; i < array.length; i++) {
    //     if (damageCenterX == array[i][0]) {
    //         console.log('array[i][0] ', array[i][0]);
    //
    //         if (damageCenterY == array[i][1]) {
    //             console.log('array[i][1] ', array[i][1]);
    //
    //             let currentGroundElement = i;
    //
    //             array.splice(currentGroundElement, 1);
    //
    //             for (var j = (damageCoords.length - 1); j >= 0; j--) {
    //                 array.splice(currentGroundElement, 0, damageCoords[j]);
    //             }
    //         }
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


