// const calculateDamageArea = _.memoize((array, damageX, damageY) => {
// TODO works only first shot. Every next does not change canvas
const calculateDamageArea = (array, damageX, damageY) => {
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
        distanceBetweenDamageSegments = 30,
        damageRadius = 40,
        pointsToReplace,
        pointsOfIntersect = [];

    pointsToReplace = findDamageLimits(array, damageX, damageY, damageRadius);

    for (let i = 0; i < pointsToReplace.length; i++) {
        if (pointsToReplace[i][2] == 'inDamage') {
            pointsOfIntersect.push(pointsToReplace[i]);
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

    // replace damage points in pointsToReplace array with extended damage points
    pointsToReplace.splice(1, pointsToReplace.length-2);
    for (let i = 0; i < pointRealOnCircle.length; i++) {
        pointsToReplace.splice((1 + i), 0, pointRealOnCircle[i]);
    }

    // insert damage points into originalPoints array with extended damage points
    elementToChangeFrom = pointsToReplace[0][2];
    array.splice(elementToChangeFrom, 4);
    // removing property of '1' from array points
    pointsToReplace[0].pop();
    pointsToReplace[pointsToReplace.length - 1].pop();

    pointsToReplace.map((item) => {
        array.splice(elementToChangeFrom, 0, item);
        elementToChangeFrom++;
    });

    // for (let i = 0; i < array.length; i++) {
    //     console.log('array[i]', i, array[i])
    // }

    return array;
};
// });

const findOriginalPointsToReplace = (array, damageX, damageY, damageRadius) => {
    let segmentPairPoints = [],
        distance,
        numberOfLast,
        pointsOfDamageCenterSegment,
        distanceFromDamageCenter1,
        distanceFromDamageCenter2;

    pointsOfDamageCenterSegment = findPointOnSegment(array, damageX, damageY, true);
    if (pointsOfDamageCenterSegment == null) {
        console.log('WARNING! Point is out of the ground');
    }

    distanceFromDamageCenter1 = calculateDistance(damageX, damageY, pointsOfDamageCenterSegment[0][0], pointsOfDamageCenterSegment[0][1]);
    distanceFromDamageCenter2 = calculateDistance(damageX, damageY, pointsOfDamageCenterSegment[1][0], pointsOfDamageCenterSegment[1][1]);

    if (distanceFromDamageCenter1 >= damageRadius && damageRadius <= distanceFromDamageCenter2) {
        segmentPairPoints.push(pointsOfDamageCenterSegment[0]);
        segmentPairPoints.push(pointsOfDamageCenterSegment[1]);

    } else {
        for (let i = 1; i < array.length; i++) {
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

        // number of last point of damaged line-segment in canvas array
        numberOfLast = segmentPairPoints[segmentPairPoints.length - 1][2] + 1;
        segmentPairPoints.push(array[numberOfLast]);
        // also setting index number from originalPoints array
        segmentPairPoints[segmentPairPoints.length - 1].push(numberOfLast);
    }

    return segmentPairPoints;
};

const findDamageLimits = (array, damageX, damageY, damageRadius) => {
    let pointsOnDamageLine = [],
        segmentWithDamage1 = [],
        segmentWithDamage2 = [],
        pointsToReplace = [],
        segmentPairPoints;

    segmentPairPoints = findOriginalPointsToReplace(array, damageX, damageY, damageRadius);

    // populating array pointsToReplace with points of area which is going to be modified
    pointsToReplace.push(segmentPairPoints[0]);
    for (let i = 1; i < segmentPairPoints.length; i++) {

        pointsOnDamageLine = findIntersectionCoordinates(segmentPairPoints[i - 1][0], segmentPairPoints[i - 1][1], segmentPairPoints[i][0], segmentPairPoints[i][1], damageX, damageY, damageRadius);

        segmentWithDamage1 = findPointOnSegment(array, pointsOnDamageLine[0][0], pointsOnDamageLine[0][1]);

        segmentWithDamage2 = findPointOnSegment(array, pointsOnDamageLine[1][0], pointsOnDamageLine[1][1]);

        if ( (segmentWithDamage1 != null) && (segmentWithDamage2 != null)) {
            setPointOrder(segmentPairPoints[i - 1][0], segmentPairPoints[i - 1][1], segmentPairPoints[i][0], segmentPairPoints[i][1], pointsOnDamageLine[0][0], pointsOnDamageLine[0][1], pointsOnDamageLine[1][0], pointsOnDamageLine[1][1], pointsToReplace);

        } else if (segmentWithDamage1 != null) {
            markAndPushPoint(pointsOnDamageLine[0], pointsToReplace);
        } else {
            markAndPushPoint(pointsOnDamageLine[1], pointsToReplace);
        }
    }

    pointsToReplace.push(segmentPairPoints[segmentPairPoints.length - 1]);

    return pointsToReplace;
};

// helper-functions

const markAndPushPoint = (point, arrayInOrder) => {
    point.push('inDamage');
    arrayInOrder.push(point);
};

const setPointOrder = (endpoint1X, endpoint1Y, endpoint2X, endpoint2Y, damagePoint1X, damagePoint1Y, damagePoint2X, damagePoint2Y, arrayOfOrder) => {
    // compare and set order of two damagePoint's T's coefficients of two points, situated on the same line segment
    let damagePoint1T,
        damagePoint2T,
        damagePoint1 = [damagePoint1X, damagePoint1Y],
        damagePoint2 = [damagePoint2X, damagePoint2Y];

    damagePoint1T = findLineSegmentCoefficient(endpoint1X, endpoint1Y, endpoint2X, endpoint2Y, damagePoint1X, damagePoint1Y);
    damagePoint2T = findLineSegmentCoefficient(endpoint1X, endpoint1Y, endpoint2X, endpoint2Y, damagePoint2X, damagePoint2Y);

    if (damagePoint1T < damagePoint2T) {
        markAndPushPoint(damagePoint1, arrayOfOrder);
        markAndPushPoint(damagePoint2, arrayOfOrder);
    } else {
        markAndPushPoint(damagePoint2, arrayOfOrder);
        markAndPushPoint(damagePoint1, arrayOfOrder);
    }
};

const findLineSegmentCoefficient = (endpoint1X, endpoint1Y, endpoint2X, endpoint2Y, damagePointX, damagePointY) => {
    // find coefficient of point, situated on line segment
    let deltaX,
        deltaY;

    deltaX = (endpoint2X - endpoint1X);
    deltaY = (endpoint2Y - endpoint1Y);

    if (deltaX != 0) {
        return ( (damagePointX - endpoint1X) / deltaX );
    } else {
        return ( (damagePointY - endpoint1Y) / deltaY );
    }
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

    let xPlus = ( ( -b + ( Math.sqrt( (Math.pow(b, 2)) -4 * a * c ) ) ) / (2 * a) );
    let xMinus = ( ( -b - ( Math.sqrt( (Math.pow(b, 2)) -4 * a * c ) ) ) / (2 * a) );

    /* using line equation again to calculate two variants of y */
    let yPlus = (m * xPlus + k);
    let yMinus = (m * xMinus + k);

    let point1 = [Math.round(xPlus), Math.round(yPlus)];
    let point2 = [Math.round(xMinus), Math.round(yMinus)];

    return [point1, point2];
};

const findInitialAngle = (x, y, cx, cy) => {
    // warning! in canvas positive x goes to the right but positive y goes to the bottom!
    return Math.atan2((y - cy), (x - cx));
};

const rotateFixed = (cx, cy, r, theta) => {
    let pX,
        pY;

    pX = Math.round( cx + (r * Math.cos(theta)) );
    pY = Math.round( cy + (r * Math.sin(theta)) );

    return [pX, pY];
};

const findPointOnSegment = (array, segmentX, segmentY, checkDamageCenter = false) => {
    /*returns endpoints of line segment (of battlefield on canvas) of point which belongs to it*/
    let x1,
        y1,
        x2,
        y2,
        foundPoint,
        point1,
        point2;

    for (let i = 1; i < array.length; i++) {
        x1 = array[i - 1][0];
        y1 = array[i - 1][1];
        x2 = array[i][0];
        y2 = array[i][1];

        if (checkDamageCenter && (array[i - 1][0] == segmentX && array[i - 1][1] == segmentY)) {
            // setting extra property 1 - point is within damage radius
            point1 = [array[i - 2][0], array[i - 2][1], (i - 1)];   // TODO should I implement when this is null
            point2 = [x2, y2, i];                                   // TODO should I implement when this is null

            return [point1, point2];
        }

        if (checkDamageCenter) {
            foundPoint = calculateDamageCenterLineEquation(x1, y1, x2, y2, segmentX, segmentY);
        } else {
            foundPoint = calculateLineEquation(x1, y1, x2, y2, segmentX, segmentY);
        }

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
    /*deltaY is a tolerance between equation and actual point on the canvas's array of points*/
    let deltaY = 2;
    let y = ( ( (segmentX - x1) * (y2 - y1) ) / (x2 - x1) + y1 );

    if ( (y - deltaY) <= segmentY && segmentY <= (y + deltaY) ) {
        return y;
    }

    return null;
};

const calculateDamageCenterLineEquation = (x1, y1, x2, y2, segmentX, segmentY) => {
    /*defines point which coordinates lays on the line of segment*/
    /*deltaY is a tolerance between equation and actual point on the canvas's array of points*/
    // 5 is a temporary solution before Misha fixes point to be on the ground instead of underground
    let deltaY = 5;
    let y = ( ( (segmentX - x1) * (y2 - y1) ) / (x2 - x1) + y1 );

    if ( (y - deltaY) <= segmentY && segmentY <= (y + deltaY) ) {
        return y;
    }

    return null;
};

const calculateDistance = (x1, y1, x2, y2) => {
    /*check distance between two points coordinates*/
    return ( (Math.sqrt( Math.pow( (x2 - x1), 2 ) + ( Math.pow( (y2 - y1), 2 ) ) )) );
};