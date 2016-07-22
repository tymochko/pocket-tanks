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
}
