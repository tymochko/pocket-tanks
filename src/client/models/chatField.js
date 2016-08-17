let inv = 1;

module.exports = function() {
    let adiv = document.getElementById('chat-window');
    let starttime;
    let maxOpacity = 1;
    let timeDur = 1000;

    function moveit(timestamp, el, dist, duration) {
        var timestamp = timestamp || new Date().getTime();
        let runtime = timestamp - starttime;
        let progress = runtime / duration;

        progress = Math.min(progress, maxOpacity);
        el.style.opacity = inv*(dist * progress).toFixed(2);

        (inv == 1) ? el.style.display="initial" : el.style.display="none";

        if (runtime < duration){
            requestAnimationFrame(function(timestamp) {
                moveit(timestamp, el, dist, duration);
            })
        }
        else
            inv = -inv;
    }

    requestAnimationFrame(function(timestamp) {
        starttime = timestamp || new Date().getTime();
        moveit(timestamp, adiv, maxOpacity, timeDur);
    });
}
