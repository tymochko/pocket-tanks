module.exports.requestAnimFrame = (function(){
    return window.requestAnimationFrame   ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(callback){
        window.setTimeout(callback, 1000 / 60);
    };
})();

export function getId (id) {
    return document.getElementById(id);
};

export function tankFunc() {
    var tankX = 100,
        tankY = 100;
    
    if(arguments[0]) {
        tankX = arguments[0];
        tankY = arguments[1];
    }

    console.log('In tankFunc: ' + tankX + ', ' + tankY);

    return {
        tankX: tankX,
        tankY: tankY
    };
};

