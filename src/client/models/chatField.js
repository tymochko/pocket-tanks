let inv = 1;

module.exports = () => {
    let adiv = document.getElementById('chat-window');
    let starttime;
    let maxOpacity = 1;
    let timeDur = 1000;

    const moveit = (timePoint, el, dist, duration) => {
        let timestamp = timePoint || new Date().getTime();
        let runtime = timestamp - starttime;
        let progress = runtime / duration;

        progress = Math.min(progress, maxOpacity);
        el.style.opacity = inv * (dist * progress).toFixed(2);

        (inv) ? el.style.display = "initial" : el.style.display = "none";

        if (runtime < duration){
            requestAnimationFrame((timestamp) => {
                moveit(timestamp, el, dist, duration);
            })
        }
        else
            inv = -inv;
    }

    requestAnimationFrame((timestamp) => {
        starttime = timestamp || new Date().getTime();
        moveit(timestamp, adiv, maxOpacity, timeDur);
    });
}
