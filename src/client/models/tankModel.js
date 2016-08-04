class Tank {
    constructor(id = null, tankX = 45, tankY = 45, tankAngle = 0, weaponAngle = 0) {
        this.tankId = id;
        this.tankX = tankX;
        this.tankY = tankY;
        this.tankAngle = tankAngle;
        this.weaponAngle = weaponAngle;
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
