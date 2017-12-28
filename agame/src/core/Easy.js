//实现一些方便全局使用的函数
function debug(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    // if (!DEBUG) {
    //     return;
    // }
    if (optionalParams) {
        if (GameConst.isNative()) {
            egret.log.apply(egret, ["nav-sdk-lgzb:" + message].concat(optionalParams));
        }
        else {
            egret.log.apply(egret, [message].concat(optionalParams));
        }
    }
    else {
        if (GameConst.isNative()) {
            egret.log("nav-sdk-lgzb:" + message);
        }
        else {
            egret.log(message);
        }
    }
}
function sayError(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    if (!true)
        return;
    egret.error.apply(egret, [message].concat(optionalParams));
}
function Po(x, y) {
    return new egret.Point(x, y);
}
function Po2(x, y) {
    return { x: x, y: y };
}
function Po3(x, y, k) {
    return { x: x, y: y, k: k };
}
//# sourceMappingURL=Easy.js.map