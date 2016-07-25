import { canvasModel } from './canvasModel';
import { tank } from './tankModel';

const tankHeight = tank.getVehicleHeight(),
    tankWidth = tank.getVehicleWidth(),
    weaponHeight = tank.getWeaponHeight(),
    weaponWidth = tank.getWeaponWidth();

const moveWeapon = (xCoordinate, yCoordinate, angle, tankCtx, weaponImage) => {
    tankCtx.save();
    tankCtx.translate(xCoordinate, yCoordinate-weaponHeight);
    tankCtx.rotate(-angle- angle*Math.PI/180);
    tankCtx.drawImage(weaponImage, 0,  -weaponHeight/2, weaponWidth, weaponHeight);
    tankCtx.restore();
};

const drawTankFn = () => {
    return (xCoordinate, yCoordinate, angle, tankImage, weaponImage) => {

        let tankCtx = canvasModel.getTank().ctx;

        tankCtx.save();
        tankCtx.translate(xCoordinate, yCoordinate-weaponHeight);
        tankCtx.rotate(-angle);
        tankCtx.drawImage(tankImage,-tankWidth/2-weaponWidth/3,-tankHeight/2+weaponHeight/2 ,
        tankWidth, tankHeight);
        tankCtx.restore();

        moveWeapon(xCoordinate, yCoordinate, angle, tankCtx, weaponImage);
    };
};

export const drawTank = drawTankFn();