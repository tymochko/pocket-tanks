module.exports.canvasModel = {
    skyCanvas: null,
    skyCtx: null,
    
    groundCanvas: null,
    groundCtx: null,
    
    lightningCanvas: null,
    lightningCtx: null,
    
    tankCanvas: null,
    tankCtx: null,
    
    bulletCanvas: null,
    bulletCtx: null,
    
    getSky: function() {
        return {
            canvas: this.skyCanvas,
            ctx: this.skyCtx
        };
    },
    setSky: function(canvas, ctx) {
        this.skyCanvas = canvas;
        this.skyCtx = ctx;
    },

    getGround: function() {
        return {
            canvas: this.groundCanvas,
            ctx: this.groundCtx
        };
    },
    setGround: function(canvas, ctx) {
        this.groundCanvas = canvas;
        this.groundCtx = ctx;
    },

    getLightning: function() {
        return {
            canvas: this.lightningCanvas,
            ctx: this.lightningCtx
        };
    },
    setLightning: function(canvas, ctx) {
        this.lightningCanvas = canvas;
        this.lightningCtx = ctx;
    },

    getTank: function() {
        return {
            canvas: this.tankCanvas,
            ctx: this.tankCtx
        };
    },
    setTank: function(canvas, ctx) {
        this.tankCanvas = canvas;
        this.tankCtx = ctx;
    },

    getBullet: function() {
        return {
            canvas: this.bulletCanvas,
            ctx: this.bulletCtx
        };
    },
    setBullet: function(canvas, ctx) {
        this.bulletCanvas = canvas;
        this.bulletCtx = ctx;
    }
};