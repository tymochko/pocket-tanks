import { canvasModel } from './canvasModel';
import { TANK_HEIGHT, TANK_WIDTH, WEAPON_HEIGHT, WEAPON_WIDTH } from './externalVariables';
import { tiltTank } from './tiltTank';

const moveWeapon = (xCoordinate, yCoordinate, tankAngle, tankCtx, weaponImage, weaponAngle) => {
    tankCtx.save();
    tankCtx.translate(xCoordinate, yCoordinate - WEAPON_HEIGHT);
    tankCtx.rotate(-tankAngle - weaponAngle);
    tankCtx.drawImage(weaponImage, 0, -WEAPON_HEIGHT/2, WEAPON_WIDTH, WEAPON_HEIGHT);
    tankCtx.restore();
};

const drawTankFn = () => {
    return (playerId, tank, tankImage, weaponImage, weaponAngle) => {
        const xCoordinate = tank.tankX;
        const yCoordinate = tank.tankY;
        console.log(xCoordinate + ' ' + yCoordinate + ' in drawTank');

        const tankCtx = canvasModel.getTank().ctx;
        const _tankAngle = -tiltTank(xCoordinate);

        tank.tankAngle = _tankAngle;

        tankCtx.save();
        tankCtx.translate(xCoordinate, yCoordinate - WEAPON_HEIGHT);
        tankCtx.rotate(-_tankAngle);
        tankCtx.drawImage(tankImage, -TANK_WIDTH/2 - WEAPON_WIDTH/3, -TANK_HEIGHT/2 + WEAPON_HEIGHT/2,
            TANK_WIDTH, TANK_HEIGHT);
        tankCtx.restore();

        moveWeapon(xCoordinate, yCoordinate, _tankAngle, tankCtx, weaponImage, weaponAngle);
    };
};

export const drawTank = drawTankFn();
