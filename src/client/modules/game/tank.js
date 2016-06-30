'use strict';

var drawTank = function drawTank(xCoordinate, yCoordinate) {
    var tankImage = new Image();
    var weaponImage = new Image();
    var tankHeight = 30;
    var tankWidth = 70;
    var weaponHeight = 20;
    var weaponWidth = 35;
    tankImage.src = 'tankVehicle.png';
    weaponImage.src = 'tankWeapon.png';
    ctx.drawImage(tankImage, xCoordinate, yCoordinate, tankWidth, tankHeight);
    ctx.drawImage(weaponImage, xCoordinate - 13, yCoordinate - 14, weaponWidth, weaponHeight);
};
