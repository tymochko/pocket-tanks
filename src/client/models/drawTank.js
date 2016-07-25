import { canvasModel } from './canvasModel';
import { tank } from './tankModel';
import { tiltTank } from './tiltTank';

const tankHeight = tank.getVehicleHeight(),
    tankWidth = tank.getVehicleWidth(),
    weaponHeight = tank.getWeaponHeight(),
    weaponWidth = tank.getWeaponWidth();

const moveWeapon = (xCoordinate, yCoordinate, tankAngle, tankCtx, weaponImage, weaponAngle) => {
    tankCtx.save();
    tankCtx.translate(xCoordinate, yCoordinate-weaponHeight);
    tankCtx.rotate(-tankAngle- weaponAngle);
    tankCtx.drawImage(weaponImage, 0,  -weaponHeight/2, weaponWidth, weaponHeight);
    tankCtx.restore();
};

const drawTankFn = () => {
    return (xCoordinate, yCoordinate, tankImage, weaponImage, weaponAngle) => {

        let tankCtx = canvasModel.getTank().ctx,
            tankAngle = -tiltTank(xCoordinate);

        tank.setTankAngle(tankAngle);

        tankCtx.save();
        tankCtx.translate(xCoordinate, yCoordinate-weaponHeight);
        tankCtx.rotate(-tankAngle);
        tankCtx.drawImage(tankImage,-tankWidth/2-weaponWidth/3,-tankHeight/2+weaponHeight/2 ,
        tankWidth, tankHeight);
        tankCtx.restore();

        moveWeapon(xCoordinate, yCoordinate, tankAngle, tankCtx, weaponImage, weaponAngle);
    };
};

export const drawTank = drawTankFn();
