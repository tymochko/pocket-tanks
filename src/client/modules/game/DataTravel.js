module.exports.notify = function ($window) {
    return function(msg) {
        $window.alert(msg);
    };
};
