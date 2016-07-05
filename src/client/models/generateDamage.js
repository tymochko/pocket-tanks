// const _ = require('lodash');

// const calculateDamageArea = _.memoize((array, damageX, damageY) => {
const calculateDamageArea = (array, damageX, damageY) => {
    damageX = Math.round(damageX);
    damageY = Math.round(damageY);

    // TODO change all 'for' loops into 'map' where is possible
    let x1,
        y1,
        x2,
        y2,
        theta,
        delta = (Math.PI / 12),
        distance,
        pointOnCircle,
        pointRealOnCircle = [],
        elementToChangeFrom,
        // setting distanceBetweenDamageSegments static as a distance between points of damaged ground
        distanceBetweenDamageSegments = 15,
        damageRadius = 40,
        segmentPoints,
        pointsOfIntersect = [];

    segmentPoints = findDamageLimits(array, damageX, damageY, damageRadius);

    for (let i = 0; i < segmentPoints.length; i++) {
        if (segmentPoints[i][2] == 'inDamage') {
            pointsOfIntersect.push(segmentPoints[i]);
        }
    }

    for (let i = 1; i < pointsOfIntersect.length; i++) {
        if (i % 2) {
            x1 = pointsOfIntersect[i - 1][0];
            y1 = pointsOfIntersect[i - 1][1];
            x2 = pointsOfIntersect[i][0];
            y2 = pointsOfIntersect[i][1];

            pointRealOnCircle.push([x1, y1]);

            theta = findInitialAngle(pointRealOnCircle[pointRealOnCircle.length - 1][0], pointRealOnCircle[pointRealOnCircle.length - 1][1], damageX, damageY);

            do {
                if (pointOnCircle) {
                    pointRealOnCircle.push(pointOnCircle);
                }

                theta -= delta;

                pointOnCircle = rotateFixed(damageX, damageY, damageRadius, theta);

                distance = calculateDistance(pointOnCircle[0], pointOnCircle[1], x2, y2);
            }
            while (distance > distanceBetweenDamageSegments);

            pointRealOnCircle.push([x2, y2]);
        }
    }

    // replace damage points in segmentPoints array with extended damage points
    segmentPoints.splice(1, segmentPoints.length-2);
    for (let i = 0; i < pointRealOnCircle.length; i++) {
        segmentPoints.splice((1 + i), 0, pointRealOnCircle[i]);
    }

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

    return array;
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
        // TODO why?
        distanceFromDamageCenter1,
        distanceFromDamageCenter2;

    pointsOfDamageCenterSegment = findDamageCenterPointOnSegment(array, damageX, damageY);
    if (pointsOfDamageCenterSegment == null) {
        console.log('Point is out of the ground');
        // TODO should I keep it?
    }
    // TODO implement logic if pointOfDamageCenter is equal to point in originalPoints

    distanceFromDamageCenter1 = calculateDistance(damageX, damageY, pointsOfDamageCenterSegment[0][0], pointsOfDamageCenterSegment[0][1]);
    distanceFromDamageCenter2 = calculateDistance(damageX, damageY, pointsOfDamageCenterSegment[1][0], pointsOfDamageCenterSegment[1][1]);

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

    // populating array pointsRebuild with points of area which is going to be modified
    pointsRebuild.push(segmentPairPoints[0]);
    for (let i = 1; i < segmentPairPoints.length; i++) {

        pointsOnDamageLine = findIntersectionCoordinates(segmentPairPoints[i - 1][0], segmentPairPoints[i - 1][1], segmentPairPoints[i][0], segmentPairPoints[i][1], damageX, damageY, damageRadius);

        segmentWithDamage1 = findPointOnSegment(array, pointsOnDamageLine[0][0], pointsOnDamageLine[0][1]);

        segmentWithDamage2 = findPointOnSegment(array, pointsOnDamageLine[1][0], pointsOnDamageLine[1][1]);

        if (segmentWithDamage1 != undefined) {
            pointsOnDamageLine[0].push('inDamage');
            pointsRebuild.push(pointsOnDamageLine[0]);
        }

        if (segmentWithDamage2 != undefined) {
            pointsOnDamageLine[1].push('inDamage');
            pointsRebuild.push(pointsOnDamageLine[1]);
        }
    }

    pointsRebuild.sort();

    // number of last point of damaged line-segment in canvas array
    numberOfLast = segmentPairPoints[segmentPairPoints.length - 1][2] + 1;
    pointsRebuild.push(array[numberOfLast]);
    // also setting index number from originalPoints array
    pointsRebuild[pointsRebuild.length - 1].push(numberOfLast);

    return pointsRebuild;
};

// helper-functions

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

const findInitialAngle = (x, y, cx, cy) => {
    return Math.atan2((y - cy), (x - cx));
    // TODO always return angle less than PI. why?
};

const rotateFixed = (cx, cy, r, theta) => {
    let px2,
        py2;

    px2 = Math.round( cx + (r * Math.cos(theta)) );
    py2 = Math.round( cy + (r * Math.sin(theta)) );

    return [px2, py2];
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
            point1 = [x1, y1, (i - 1)];
            point2 = [x2, y2, i];
            return [point1, point2];
        }
    }

    return null;
};

const calculateLineEquation = (x1, y1, x2, y2, segmentX, segmentY) => {
    /*defines point which coordinates lays on the line of segment*/
    let y = Math.round( ( (segmentX - x1) * (y2 - y1) ) / (x2 - x1) + y1 );

    if ( y <= segmentY && segmentY <= y ) {
        return y;
    }
};

// dirty hack while Misha's point is underground
const findDamageCenterPointOnSegment = (array, segmentX, segmentY) => {
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

        // TODO should/can I encapsulate this function if it differs only with this part of code?
        if (array[i - 1][0] == segmentX && array[i - 1][1] == segmentY) {
            point1 = [array[i - 2][0], array[i - 2][1], (i - 1)];   // should I implement when this is null
            point2 = [x2, y2, i];                                   // should I implement when this is null

            return [point1, point2];
        }

        foundPoint = calculateDamageCenterLineEquation(x1, y1, x2, y2, segmentX, segmentY);

        if ( ((y1 <= foundPoint) && (foundPoint <= y2)) || ((y2 <= foundPoint) && (foundPoint <= y1)) ) {
            point1 = [x1, y1, (i - 1)];
            point2 = [x2, y2, i];

            return [point1, point2];
        }
    }

    return null;
};

const calculateDamageCenterLineEquation = (x1, y1, x2, y2, segmentX, segmentY) => {
    /*defines point which coordinates lays on the line of segment*/
    let y = Math.round( ( (segmentX - x1) * (y2 - y1) ) / (x2 - x1) + y1 );

    // temporary solution before Misha fixes point to be on the ground instead of underground
    if ( (y - 5) <= segmentY && segmentY <= (y + 5) ) {
        return y;
    }
};

const calculateDistance = (x1, y1, x2, y2) => {
    /*check distance between two points coordinates*/
    return Math.round( (Math.sqrt( Math.pow( (x2 - x1), 2 ) + ( Math.pow( (y2 - y1), 2 ) ) )) );
};