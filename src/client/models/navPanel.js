import { getId, clear } from './externalFunctions';
import { drawTank } from './drawTank';
import { makeShot } from './shotTrajectory';
import { canvasModel } from './canvasModel';

export function navPanel(tank, angle, weaponAngle, socket, gameInst) {
    let tankCtx = canvasModel.getTank().ctx,
        tankImage = new Image(),
        weaponImage = new Image();

    tankImage.src = './public/images/tankVehicle.png';
    weaponImage.src = './public/images/tankWeapon_straight.png';

    getId('fire').onclick = () => {
        makeShot(
            canvasModel.getBullet().ctx,
            tank,
            tank.getCoord().tankX,
            tank.getCoord().tankY,
            tank.getWeaponAngle(),
            socket
        );
    };

    getId('morePower').onclick = () => {
        power++;
        getId('power').innerHTML = power;
        power = parseInt(getId('power').innerHTML);
    };

    getId('lessPower').onclick = () => {
        power--;
        getId('power').innerHTML = power;
        power = parseInt(getId('power').innerHTML);
    };

    getId('moreAngle').onclick = () => {
        angle = parseInt(getId('angle').innerHTML);
        if(angle >=  80) {
            return;
        }
        angle +=5;
        clear(tankCtx);
        weaponAngle = angle*Math.PI/180;
        tank.setWeaponAngle(weaponAngle);
        drawTank(tank, tank.getCoord().tankX, tank.getCoord().tankY, tankImage, weaponImage, weaponAngle);
        getId('angle').innerHTML = angle;
    };

    getId('lessAngle').onclick = () => {
        angle = parseInt(getId('angle').innerHTML);
        if (angle <= 0) {
            return;
        }
        angle -= 5;
        clear(tankCtx);
        weaponAngle = angle*Math.PI/180;
        tank.setWeaponAngle(weaponAngle);
        drawTank(tank, tank.getCoord().tankX, tank.getCoord().tankY, tankImage, weaponImage, weaponAngle);
        getId('angle').innerHTML = angle;
    };

    socket.on('redirect-away-from-game', () => {
        window.location = '/dashboard';
    });
    
    getId('surrender').onclick = () => {
        const thisPlayerId = localStorage.getItem('playerId');
        gameInst.gameStatus = false;

        if (gameInst.player1.id === thisPlayerId) {
            gameInst.player1.life = 0;
        } else {
            gameInst.player2.life = 0;
        }

        socket.emit('end-game', gameInst);
    };
}
