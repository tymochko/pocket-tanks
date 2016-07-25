import { getId } from './externalFunctions';

export function navPanel(angle, tankX, tankY, angleWeapon) {
    getId('fire').onclick = function () {
        makeShot();
    };

    getId('morePower').onclick = function () {
        power++;
        getId('power').innerHTML = power;
        power = parseInt(getId('power').innerHTML);
    };

    getId('lessPower').onclick = function () {
        power--;
        getId('power').innerHTML = power;
        power = parseInt(getId('power').innerHTML);
    };

    getId('moreAngle').onclick = function () {

        getId('angle').innerHTML = angle;

        if (angle >= 80) {
            return;
        }
        angle += 5;
        getId('angle').innerHTML = angle;
        angle = parseInt(getId('angle').innerHTML);

        angleWeapon = angle * Math.PI / 180;
        // drawTank(tankX, tankY, angleWeapon);
    };

    getId('lessAngle').onclick = function () {

        getId('angle').innerHTML = angle;

        if (angle <= 0) {
            return;
        }
        angle -= 5;
        getId('angle').innerHTML = angle;
        angle = parseInt(getId('angle').innerHTML);

        angleWeapon = angle * Math.PI / 180;
        // drawTank(tankX, tankY, angleWeapon);
    };
}
