var constans = require('./constans');
var originalPoints = constans.originalPoints;

module.exports.findLinePoints = function(posX) {
    let arr = [];

    for(let i = originalPoints.length - 1; i > 0; i--) {
        if(originalPoints[i][0] >= posX && originalPoints[i-1][0] <= posX) {
            let x1 = originalPoints[i-1][0],
                x2 = originalPoints[i][0],
                y1 = originalPoints[i-1][1],
                y2 = originalPoints[i][1];

            let time = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
            for (let j = 0; j <= time; j++) {
                let delta = j/time ;
                let a =  delta*(x2 - x1) + x1;
                let b =  delta*(y2 - y1) + y1;
                arr.push([Math.round(a), Math.round(b)]);
            }
            for(let i = 0; i < arr.length; i++) {
                if(arr[i][0] === posX) return (arr[i][1]);
            }
        }
    }
}

const animate = (draw, duration) => {
    let start = performance.now();
    requestAnimFrame(function animate(time) {
        let timePassed = time - start;
        if (timePassed > duration) timePassed = duration;
        draw(timePassed);
        if(tankX >= WIDTH - 11 || tankX <= 11){
            window.cancelAnimationFrame(requestAnimFrame);
            // console.log('stop!!!');
        } else if (timePassed < duration) {
            requestAnimFrame(animate);
        }
    });
};

const tankMove = (direction) => {
    animate((timePassed) => {
        if(direction === "right") {
            tankX++;
        } else {
            tankX--;
        }
        angle = parseInt(getId('angle').innerHTML);
        tankY = findLinePoints(tankX);
        clear();
        fillBackground();
        drawTank(tankX, tankY, angleWeaponInc);
    }, 1500);
};
