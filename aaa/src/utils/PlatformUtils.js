var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AGame;
(function (AGame) {
    /**
     * 平台工具
     */
    var PlatformUtils = (function () {
        function PlatformUtils() {
        }
        PlatformUtils.userLogin = function (callback, target) {
            AGame.HttpClient.serverUrl = GameConst.serverHost + "/api/user/login";
            var params = {};
            params.platform = GameConst.platform;
            params.open_id = AGame.LocalData.getOpenId();
            params.device_type = GameConst.deviceType();
            params.version = GameConst.VERSION;
            AGame.HttpClient.get(callback, target, params);
        };
        PlatformUtils.getServerList = function (callback, target) {
            AGame.HttpClient.serverUrl = GameConst.serverHost + "/api/server/lists";
            var params = {};
            params.platform = GameConst.platform;
            params.open_id = AGame.LocalData.getOpenId();
            params.device_type = GameConst.deviceType();
            params.version = GameConst.VERSION;
            AGame.HttpClient.get(callback, target, params);
        };
        PlatformUtils.sendRoleInfo = function () {
            AGame.HttpClient.serverUrl = GameConst.serverHost + "/api/user/role_info";
            var roleData = egret.getDefinitionByName("RoleData");
            var params = {};
            params.rid = roleData.accountId;
            params.open_id = AGame.LocalData.getOpenId();
            params.nickname = roleData.nickName;
            params.server_id = GameConst.serverId;
            params.version = GameConst.VERSION;
            params.platform = GameConst.platform;
            params.create_time = GameConst.platform;
            params.device_type = GameConst.deviceType();
            params.create_time = GameConst.createTime;
            params.token = GameConst.sign;
            AGame.HttpClient.get(this.callSendRolaInfo, this, params);
        };
        PlatformUtils.callSendRolaInfo = function (data) {
            debug("callSendRolaInfo", data);
        };
        return PlatformUtils;
    }());
    AGame.PlatformUtils = PlatformUtils;
    __reflect(PlatformUtils.prototype, "AGame.PlatformUtils");
})(AGame || (AGame = {}));
//# sourceMappingURL=PlatformUtils.js.map