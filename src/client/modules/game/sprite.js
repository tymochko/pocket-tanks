
(function() {
    function ImgInf(url, pos, angle, v0) {
        this.pos = pos;
        this.url = url;
        this.angle=angle;
        this.v0=v0;
    };

    ImgInf.prototype = {

        render: function(ctx, dt2) {
            var x = this.pos[0];
            var y = this.pos[1];

            ctx.translate(x,y);
            var A=this.v0*Math.cos(this.angle*Math.PI/180);
            var an=Math.atan(((this.v0)*Math.sin(this.angle*Math.PI/180)-9.81*dt2)/A);
            ctx.rotate(-an);
            ctx.drawImage(bulletImg,x, y);
            ctx.restore();
        }
    };

    window.ImgInf = ImgInf;
})();