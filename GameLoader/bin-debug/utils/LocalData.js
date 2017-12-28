var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AGame;
(function (AGame) {
    var LocalData = (function () {
        function LocalData() {
        }
        LocalData.setData = function (key, data) {
            egret.localStorage.setItem(key, data);
        };
        LocalData.getData = function (key) {
            var data;
            data = egret.localStorage.getItem(key);
            return data ? data : '';
        };
        LocalData.removeData = function (key) {
            egret.localStorage.removeItem(key);
        };
        LocalData.removeOpenId = function () {
            egret.localStorage.removeItem(this.OPEN_ID);
        };
        LocalData.setOpenId = function (openId) {
            this.setData(this.OPEN_ID, openId);
        };
        LocalData.setServerId = function (serverId) {
            this.setData(this.SERVER_ID, serverId);
        };
        LocalData.getOpenId = function () {
            var opend_id = this.getData(this.OPEN_ID);
            if (!opend_id) {
                opend_id = this.getRandomId();
            }
            this.setData(this.OPEN_ID, opend_id);
            return opend_id;
        };
        LocalData.getServerId = function () {
            // this.removeData(this.SERVER_ID);
            var server_id = this.getData(this.SERVER_ID) || GameConst.getServerId();
            this.setData(this.SERVER_ID, server_id);
            return server_id;
        };
        LocalData.getIsDebug = function () {
            var key = "h5sdk.isDebug";
            var isDebug = this.getData(key) || 0;
            this.setData(key, isDebug);
            return isDebug == 1;
        };
        LocalData.getRandomId = function () {
            var open_id = "Temp" + Math.floor(new Date().getTime() / 1000);
            return open_id;
        };
        LocalData.OPEN_ID = "h5sdk.openid";
        LocalData.SERVER_ID = "h5sdk.serverid";
        return LocalData;
    }());
    AGame.LocalData = LocalData;
    __reflect(LocalData.prototype, "AGame.LocalData");
})(AGame || (AGame = {}));
//# sourceMappingURL=LocalData.js.map