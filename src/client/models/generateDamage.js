// const calculateDamageArea = _.memoize((array, damageX, damageY) => {
// TODO works only first shot. Every next does not change canvas
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
        console.log('Point is out of the ground');
        // TODO should I keep it?
    }
    // TODO implement logic if pointOfDamageCenter is equal to point in originalPoints

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

            // TODO hard to read comparison
            if ( (segmentPairPoints[i][0] > segmentPairPoints[i - 1][0]) || ( (segmentPairPoints[i][0] == segmentPairPoints[i - 1][0]) && (segmentPairPoints[i - 1][1] > segmentPairPoints[i][1]) )) {

                // we never know which of the pointsOnDamageLine is larger
                if ( (pointsOnDamageLine[1][0] > pointsOnDamageLine[0][0]) || ( (pointsOnDamageLine[1][0] == pointsOnDamageLine[0][0]) && (pointsOnDamageLine[1][1] < pointsOnDamageLine[0][1]) ) ) {
                    pointsOnDamageLine[0].push('inDamage');
                    pointsToReplace.push(pointsOnDamageLine[0]);
                    pointsOnDamageLine[1].push('inDamage');
                    pointsToReplace.push(pointsOnDamageLine[1]);

                } else {
                    pointsOnDamageLine[1].push('inDamage');
                    pointsToReplace.push(pointsOnDamageLine[1]);
                    pointsOnDamageLine[0].push('inDamage');
                    pointsToReplace.push(pointsOnDamageLine[0]);
                }
            } else {

                // we never know which of the pointsOnDamageLine is larger
                if ( (pointsOnDamageLine[1][0] > pointsOnDamageLine[0][0]) || ( (pointsOnDamageLine[1][0] == pointsOnDamageLine[0][0]) && (pointsOnDamageLine[1][1] < pointsOnDamageLine[0][1]) )) {
                    pointsOnDamageLine[1].push('inDamage');
                    pointsToReplace.push(pointsOnDamageLine[1]);
                    pointsOnDamageLine[0].push('inDamage');
                    pointsToReplace.push(pointsOnDamageLine[0]);

                } else {
                    pointsOnDamageLine[0].push('inDamage');
                    pointsToReplace.push(pointsOnDamageLine[0]);
                    pointsOnDamageLine[1].push('inDamage');
                    pointsToReplace.push(pointsOnDamageLine[1]);
                }
            }

        } else if (segmentWithDamage1 != null) {
            pointsOnDamageLine[0].push('inDamage');
            pointsToReplace.push(pointsOnDamageLine[0]);
        } else {
            pointsOnDamageLine[1].push('inDamage');
            pointsToReplace.push(pointsOnDamageLine[1]);
        }
    }
    // manually sorting. starting on line 154
    // pointsToReplace.sort();
    pointsToReplace.push(segmentPairPoints[segmentPairPoints.length - 1]);

    return pointsToReplace;
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
    // warning! in canvas positive x goes to the right but positive y goes to the bottom!
    return Math.atan2((y - cy), (x - cx));
};

const rotateFixed = (cx, cy, r, theta) => {
    let px2,
        py2;

    px2 = Math.round( cx + (r * Math.cos(theta)) );
    py2 = Math.round( cy + (r * Math.sin(theta)) );

    return [px2, py2];
};

const findPointOnSegment = (array, segmentX, segmentY, checkDamageCenter = false) => {
    /*defines point which coordinates lays on the line-segment of canvas*/
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
            point1 = [array[i - 2][0], array[i - 2][1], (i - 1)];   // should I implement when this is null
            point2 = [x2, y2, i];                                   // should I implement when this is null

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
    let y = Math.round( ( (segmentX - x1) * (y2 - y1) ) / (x2 - x1) + y1 );

    if ( y == segmentY ) {
        return y;
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

    return null;
};

const calculateDistance = (x1, y1, x2, y2) => {
    /*check distance between two points coordinates*/
    return Math.round( (Math.sqrt( Math.pow( (x2 - x1), 2 ) + ( Math.pow( (y2 - y1), 2 ) ) )) );
};