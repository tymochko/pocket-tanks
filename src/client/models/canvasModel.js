module.exports.canvasModel = {
    ctx: 45,
    
    getCtx: function() {
        return {
            ctx: this.ctx
        };
    },
    setCtx: function(ctx) {
        this.ctx = ctx;
    }
};