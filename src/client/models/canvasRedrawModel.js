const polygon = (array, color, groundCtx) => {
    groundCtx.beginPath();

    array.forEach((pair, number) => {
        if(number == 0) {
            groundCtx.moveTo(pair[0], pair[1]);
        } else {
            groundCtx.lineTo(pair[0], pair[1]);
        }
    });
    groundCtx.fillStyle = color;
    groundCtx.fill();
    groundCtx.closePath();
};

export function drawGround(originalPoints, groundCtx) {
    polygon(originalPoints, '#FFC057', groundCtx);
}

export function drawSky(skyCtx){
    let grd = skyCtx.createLinearGradient(0, 0, 0, 500);
    grd.addColorStop(0, "#172059");
    grd.addColorStop(0.3, "#6D6D85");
    grd.addColorStop(1, "#A0837D");

    skyCtx.fillStyle = grd;
    skyCtx.fillRect(0, 0, 800, 500);
}