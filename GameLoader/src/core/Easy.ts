//实现一些方便全局使用的函数

function debug(message?: any, ...optionalParams: any[]) {
    // if (!DEBUG) {
    //     return;
    // }
    if (optionalParams) {
        if (GameConst.isNative()) {
            egret.log("nav-sdk-lgzb:" + message, ...optionalParams);
        } else {
            egret.log(message, ...optionalParams);
        }
    } else {
        if (GameConst.isNative()) {
            egret.log("nav-sdk-lgzb:" + message);
        } else {
            egret.log(message);
        }
    }
}

function sayError(message?: any, ...optionalParams: any[]) {
    if (!DEBUG) return;
    egret.error(message, ...optionalParams);
}

function Po(x: number, y: number): egret.Point {
    return new egret.Point(x, y);
}

function Po2(x: number, y: number) {
    return { x, y }
}

function Po3(x: number, y: number, k: number) {
    return { x, y, k }
}