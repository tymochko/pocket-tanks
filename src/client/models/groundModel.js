export let ground = {
    groundPoints: [[0, 280],[200, 350], [350, 150], [500, 250],[800, 250],
    [800, 500],[0, 500],[0, 280]],

    getGround: function () {
        console.log(this.groundPoints, 'this.groundPoints');
        return this.groundPoints;
    },

    setGround: function (newGroundPoints) {
        this.groundPoints = newGroundPoints;
        console.log(this.groundPoints, 'this.groundPoints');
    }
};
