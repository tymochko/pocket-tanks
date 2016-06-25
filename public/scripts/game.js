'use strict';

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var poligon = function poligon(array, color) {
    ctx.beginPath();

    array.forEach(function (pair, number) {
        if (number == 0) {
            ctx.moveTo(pair[0], pair[1]);
        } else {
            ctx.lineTo(pair[0], pair[1]);
        }
    });
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
};

var drawSky = function drawSky() {
    var grd = ctx.createLinearGradient(0, 0, 0, 500);
    grd.addColorStop(0, "#172059");
    grd.addColorStop(0.3, "#6D6D85");
    grd.addColorStop(1, "#A0837D");

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 800, 500);
};

var originalPoints = [[0, 300], [20, 305], [40, 330], [145, 345], [125, 400], [165, 350], [175, 360], [220, 370], [240, 320], [280, 300], [300, 270], [340, 200], [370, 170], [440, 190], [550, 430], [530, 370], [540, 330], [575, 310], [630, 340], [685, 340], [690, 355], [700, 340], [750, 300], [755, 305], [795, 270], [800, 270], [800, 500], [0, 500], [0, 300]];

console.log(originalPoints);

var drawGround = function drawGround() {

    var points = originalPoints;

    var colors = ['#040905', '#030C37', '#352E58', '#2F010B', '#991E23', '#E72E10', '#FFC057', '#F8F984'];
    colors.forEach(function (color) {
        poligon(points, color);

        points = points.map(function (pair) {
            return [pair[0], pair[1] + 40];
        });
    });
};

window.setInterval(function () {
    drawSky();
    drawGround();
    if (Math.random() <= 0.1) {
        ctx.fillStyle = 'rgba(255, 255, 255, .5)';
        ctx.fillRect(0, 0, 800, 500);
        drawLightning(370, 0);
    }
}, 100);