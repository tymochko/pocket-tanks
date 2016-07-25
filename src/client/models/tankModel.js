module.exports.tank = {
    tankX: 45,
    tankY: 45,
    tankAngle: 0,
    weaponAngle: 0,
    vehicleWidth: 70,
    vehicleHeight: 30,
    weaponWidth: 35,
    weaponHeight: 20,

    getCoord: function() {
        return {
            tankX: this.tankX,
            tankY: this.tankY
        };
    },

    setCoord: function(x, y) {
        this.tankX = x;
        this.tankY = y;
    },

    getTankAngle: function() {
        return this.tankAngle;
    },

    setTankAngle: function(value) {
        this.tankAngle = value;
    },

    getWeaponAngle: function() {
        return this.weaponAngle;
    },

    setWeaponAngle: function(value) {
        this.weaponAngle = value;
    },

    getVehicleWidth: function() {
        return this.vehicleWidth;
    },

    getVehicleHeight: function() {
        return this.vehicleHeight;
    },

    getWeaponWidth: function() {
        return this.weaponWidth;
    },

    getWeaponHeight: function() {
        return this.weaponHeight;
    }
};
