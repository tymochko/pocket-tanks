import { getId, clear } from './externalFunctions';
import { drawTank } from './drawTank';
import { bulletToMove, weaponToMove } from './tankShot';
import { canvasModel } from './canvasModel';
import showChatWindow from './chatField';

export function navPanel(tank1, tank2, socket, gameInst) {
    let tankCtx = canvasModel.getTank().ctx;
    let tankImage = new Image();
    let weaponImage = new Image();
    let weaponAngle;
    let power;
    const step = 5;

    tankImage.src = './public/images/tankVehicle.png';
    weaponImage.src = './public/images/tankWeapon_straight.png';

    getId('fire').onclick = () => {
        bulletToMove();
    };

    const changePower = (power) => {
        let tankPowerChange;
        if (localStorage.getItem('playerId') === tank1.id) {
            tankPowerChange = 'tank1';
        } else {
            tankPowerChange = 'tank2';
        }

        socket.emit('powerChange', {
            tankPowerChange,
            power
        });
    };

    const tankPower = (tankParam, powerParam) => {
        if (tankParam === 'tank1') {
            tank1.power = powerParam;
        } else {
            tank2.power = powerParam;
        }
    };

    socket.on('powerChangeAns', (data) => {
        tankPower(data.tankPowerChange, data.power);
    });

    getId('morePower').onclick = () => {
        power = parseInt(getId('power').innerHTML);
        power += step;
        getId('power').innerHTML = power;
        changePower(power);
    };

    getId('lessPower').onclick = () => {
        power = parseInt(getId('power').innerHTML);
        power -= step;
        getId('power').innerHTML = power;
        changePower(power);
    };

    getId('moreAngle').onclick = () => {
        weaponAngle = parseInt(getId('angle').innerHTML);
        weaponAngle += step;
        weaponToMove(weaponAngle * Math.PI / 180);
        getId('angle').innerHTML = weaponAngle;
    };

    getId('lessAngle').onclick = () => {
        weaponAngle = parseInt(getId('angle').innerHTML);
        weaponAngle -= step;
        weaponToMove(weaponAngle * Math.PI / 180);
        getId('angle').innerHTML = weaponAngle;
    };

    getId('chatBtn').onclick = showChatWindow;

    socket.once('redirect-away-from-game', () => {
        window.location = '/dashboard';
    });

    getId('surrender').onclick = () => {
        const thisPlayerId = localStorage.getItem('playerId');
        gameInst.gameStatus = false;

        if (gameInst.player1.id === thisPlayerId) {
            gameInst.player1.life = 0;
            gameInst.player1.lose += 1;
            gameInst.player2.win += 1;

        } else {
            gameInst.player2.life = 0;
            gameInst.player2.lose += 1;
            gameInst.player1.win += 1;
        }

        socket.emit('end-game-request', gameInst);
    };
}
