var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

let coords = {
    x: 280,
    y: 250,
    width: 10,
    height: 1
};
var poligon = function (array, color) {
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


var drawSky = function () {
    var grd = ctx.createLinearGradient(0, 0, 0, 500);
    grd.addColorStop(0, "#172059");
    grd.addColorStop(0.3, "#6D6D85");
    grd.addColorStop(1, "#A0837D");

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 800, 500);
}

var originalPoints = [[0, 300], [20, 305], [40, 330], [145, 345], [125, 400], [165, 350], [175, 360], [220, 370],
    [240, 320], [280, 300], [300, 270], [340, 200], [370, 170], [440, 190], [550, 430], [530, 370], [540, 330],
    [575, 310], [630, 340], [685, 340], [690, 355], [700, 340], [750, 300], [755, 305], [795, 270], [800, 270],
    [800, 500], [0, 500], [0, 300]];

var drawGround = function () {

    var points = originalPoints;

    var colors = ['#040905', '#030C37', '#352E58', '#2F010B', '#991E23', '#E72E10', '#FFC057', '#F8F984'];
    colors.forEach(function (color) {
        poligon(points, color);

        points = points.map(function (pair) {
            return [pair[0], pair[1] + 40];
        });
    })
};

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSky();
    drawGround();
    ctx.fillStyle = 'yellow';
    ctx.fillRect(coords.x, coords.y, coords.width, coords.height);

    coords.x += 0.5;

    if(checkCol(coords,originalPoints)){
            console.log( 'x:' +  (coords.x + coords.width), 'y:' + (coords.y + coords.height));
    }
        requestAnimationFrame(draw);

}

requestAnimationFrame(draw);
// function collision(objA, objB) {
//     if (objA.x + objA.width >= objB.x && objA.x <= objB.x + objB.width && objA.y + objA.height >= objB.y && objA.y <= objB.y + objB.height) {
//         return true;
//     }
//     else {
//         return false;
//     }
// }
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

    if(Math.abs(objPoint.y - (a*objPoint.x + b)) < 0.6) {
        return true;
    }
    return false;
}

window.setInterval(function(){
    drawSky();
    drawGround();
    if (Math.random() <= 0.1) {
        ctx.fillStyle='rgba(255, 255, 255, .5)';
        ctx.fillRect(0, 0, 800, 500);
        drawLightning(370, 0);
    }
}, 100);


