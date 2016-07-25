import { ground } from './groundModel';
let originalPoints = ground.getGround();

module.exports.tiltTank = function(posX) {
    let angle = 0;
    for(let i = originalPoints.length - 1; i > 0; i--) {
        if(originalPoints[i][0] >= posX && originalPoints[i-1][0] <= posX) {
            var x1 = originalPoints[i-1][0],
            x2 = originalPoints[i][0],
            y1 = originalPoints[i-1][1],
            y2 = originalPoints[i][1];
        }
    }
    let tan = (y1 > y2) ? (y1 - y2) / (x1 - x2) : (y2 - y1) / (x2 - x1);

    angle = Math.atan(tan);

    return angle;
}
