var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AGame;
(function (AGame) {
    /**
     * 与native的交互
     */
    var NativeHelper = (function () {
        function NativeHelper() {
        }
        NativeHelper.isNative = function () {
            if (egret.RuntimeType.NATIVE == egret.Capabilities.runtimeType) {
                return true;
            }
            return false;
        };
        NativeHelper.initExternalInterface = function () {
            // TypeScript 代码
            egret.ExternalInterface.addCallback("setAppOptions", function (message) {
                egret.log("message form native setAppOptions: " + message); //message form native : message from native
                NativeHelper.parseAppOptions(message);
            });
            this.sendCodeInit();
        };
        NativeHelper.parseAppOptions = function (json) {
            var options = JSON.parse(json);
            GameConst.VERSION = options.version;
            GameConst.DEBUG = options.debug ? true : false;
        };
        NativeHelper.sendCodeInit = function () {
            egret.ExternalInterface.call("codeInit", "");
        };
        NativeHelper.sendEnterGame = function (str) {
            egret.ExternalInterface.call("enterGame", str);
        };
        return NativeHelper;
    }());
    AGame.NativeHelper = NativeHelper;
    __reflect(NativeHelper.prototype, "AGame.NativeHelper");
})(AGame || (AGame = {}));
//# sourceMappingURL=NativeHelper.js.map