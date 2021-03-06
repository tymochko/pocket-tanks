export function drawLightning(x, y, ctx) {
    ctx.fillStyle = '#002';
    ctx.strokeStyle = '#FFF';
    ctx.imageSmoothingEnabled = true;

    var step = function(start, attraction, limit, width, left) {
      if (limit <= 0) {
        return;
      }
      
      var rotated = rotate(0, 0, attraction[0], attraction[1], left ? Math.random() * -45 : Math.random() * 45);

    var end = [start[0] + rotated[0] * Math.random() * 20, start[1] + rotated[1] * Math.random() * 20];
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.closePath();
        ctx.stroke();

      if (Math.random() * 100 <= 10) {
        var rotated1 = rotate(0, 0, rotated[0], rotated[1], -22.5);
        var rotated2 = rotate(0, 0, rotated[0], rotated[1], 22.5);
        step(end, rotated1, limit - 2 * Math.random(), width * 0.9, true);
        step(end, rotated2, limit - 2 * Math.random(), width * 0.9, false);
      } else {
        step(end, rotated, limit - 2 * Math.random(), width * 0.9, !left);
      }
    };

    function rotate(cx, cy, x, y, angle) {
      var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
      return [nx, ny];
    }
    
    step([x, y], [0, 1], 20, 5, Math.random() >= 0.5);
}
