class Tank {
    constructor() {
        this.tankX = 45;
        this.tankY = 45;
        this.tankAngle = 0;
        this.weaponAngle = 0;
        this.vehicleWidth = 70;
        this.vehicleHeight = 30;
        this.weaponWidth = 35;
        this.weaponHeight = 20;
    }

    getCoord() {
        return {
            tankX: this.tankX,
            tankY: this.tankY
        };
    }

    setCoord(x, y) {
        this.tankX = x;
        this.tankY = y;
    }

    getTankAngle() {
        return this.tankAngle;
    }

    setTankAngle(value) {
        this.tankAngle = value;
    }

    getWeaponAngle() {
        return this.weaponAngle;
    }

    setWeaponAngle(value) {
        this.weaponAngle = value;
    }

    getVehicleWidth() {
        return this.vehicleWidth;
    }

    getVehicleHeight() {
        return this.vehicleHeight;
    }

    getWeaponWidth() {
        return this.weaponWidth;
    }

    getWeaponHeight() {
        return this.weaponHeight;
    }
}

module.exports.Tank = Tank;
