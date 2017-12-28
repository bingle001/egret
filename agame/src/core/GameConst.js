var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 平台登录时的一些通用变量
 */
var GameConst = (function () {
    function GameConst() {
    }
    GameConst.getServerId = function () {
        return GameConst.DEBUG ? 9991 : 1;
    };
    GameConst.getConfigServer = function () {
        var url = "";
        if (this.DEBUG) {
            url = this.testConfigHost;
        }
        else {
            url = this.configHost;
        }
        return url + this.serverId;
    };
    GameConst.isNative = function () {
        if (egret.RuntimeType.NATIVE == egret.Capabilities.runtimeType) {
            return true;
        }
        return false;
    };
    GameConst.deviceType = function () {
        if (this.isNative()) {
            if (egret.Capabilities.os == "Android") {
                return 1;
            }
            else if (egret.Capabilities.os == "iOS") {
                return 2;
            }
        }
        return 0;
    };
    GameConst.VERSION = "201708081710"; //包版本号
    GameConst.Packaged_Version = "1.0.5"; //内容版本号
    GameConst.asynchScripts = ['main.min.js'];
    GameConst.serverHost = "http://test-lgzb-platform.allrace.com";
    GameConst.configHost = "http://cdn.lgzb.yaowan.com/resource/config/";
    GameConst.isShowLogin = true; //是否显示登录界面
    GameConst.DEBUG = true;
    GameConst.RES_SERVER_CNF = "./resource/";
    GameConst.isLoadFNT = false;
    GameConst.fontFamily = "SimHei";
    GameConst.IsWhite = false;
    GameConst.loginTime = 0;
    GameConst.createTime = 0;
    GameConst.sign = '';
    GameConst.platform = 'test';
    GameConst.serverId = 0; //服务器Id
    GameConst.serverIp = '';
    GameConst.serverPort = 0;
    GameConst.CONTENT_WIDTH = 1334;
    GameConst.CONTENT_HEIGHT = 750;
    GameConst.testConfigHost = "http://192.168.16.29:8080/loginserver/config/";
    return GameConst;
}());
__reflect(GameConst.prototype, "GameConst");
//# sourceMappingURL=GameConst.js.map