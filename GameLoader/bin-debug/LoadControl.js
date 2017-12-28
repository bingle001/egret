/**
 * Created by yaowan on 2016/11/29.
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var LoadingEnum;
(function (LoadingEnum) {
    LoadingEnum[LoadingEnum["ResConfig"] = 1] = "ResConfig";
    LoadingEnum[LoadingEnum["Proto"] = 2] = "Proto";
    LoadingEnum[LoadingEnum["Code"] = 3] = "Code";
    LoadingEnum[LoadingEnum["Theme"] = 4] = "Theme";
    LoadingEnum[LoadingEnum["Resource"] = 5] = "Resource";
    LoadingEnum[LoadingEnum["UserLogin"] = 6] = "UserLogin";
})(LoadingEnum || (LoadingEnum = {}));
;
var AGame;
(function (AGame) {
    var LoadControl = (function () {
        function LoadControl(main) {
            this.m_bIsGameCodeStartUp = false;
            this.m_pMain = main;
            this.m_iStartTime = new Date().getTime();
            LoadControl.IS_LOADING = true;
            this.initGameStartConf();
        }
        LoadControl.prototype.initGameStartConf = function () {
            this.m_pLoadCfg = [];
            this.m_pLoadCfg[LoadingEnum.ResConfig] = 0;
            this.m_pLoadCfg[LoadingEnum.Proto] = 0;
            this.m_pLoadCfg[LoadingEnum.Code] = 0;
            this.m_pLoadCfg[LoadingEnum.Theme] = 0;
            this.m_pLoadCfg[LoadingEnum.Resource] = 0;
            this.m_pLoadCfg[LoadingEnum.UserLogin] = 0;
        };
        /**
         * 加载游戏
         */
        LoadControl.prototype.createLoginView = function () {
            //设置加载进度界面
            this.m_pLoadView = new AGame.LoadingUI(this);
            this.m_pLoadView.viewWidth = this.m_pMain.stage.stageWidth;
            this.m_pLoadView.width = this.m_pMain.stage.stageWidth;
            this.m_pMain.addChild(this.m_pLoadView);
            this.m_pLoadView.showView();
            // this.loadResource();
        };
        LoadControl.prototype.setComplete = function (type) {
            if (!this.m_pLoadCfg) {
                return;
            }
            this.m_pLoadCfg[type] = 1;
            debug("setComplete", type, LoadingEnum[type]);
            debug("耗时:" + type + ":" + (new Date().getTime() - this.m_iStartTime));
            if (type == LoadingEnum.Proto && !GameConst.isShowLogin) {
                this.userLogin();
            }
            if (!this.m_bIsGameCodeStartUp) {
                if (this.m_pLoadCfg[LoadingEnum.UserLogin] && this.m_pLoadCfg[LoadingEnum.Code] && this.m_pLoadCfg[LoadingEnum.Proto] && this.m_pLoadCfg[LoadingEnum.Theme]) {
                    this.m_bIsGameCodeStartUp = true;
                    this.onGameCodeStartUp();
                    this.doLoadResource();
                }
            }
            var flag = true;
            for (var i in this.m_pLoadCfg) {
                if (this.m_pLoadCfg[i] == 0) {
                    flag = false;
                }
            }
            flag && this.doEnterGame();
        };
        LoadControl.prototype.userLogin = function () {
            AGame.PlatformUtils.userLogin(this.onCallUserInfo, this);
        };
        LoadControl.prototype.onCallUserInfo = function (data) {
            debug("onCallUserInfo", data);
            if (data.code == 0) {
                GameConst.sign = data.token;
                GameConst.serverId = data.servers.last_login_sid == 0 ? data.servers.rate_sid : data.servers.last_login_sid;
                var rate_sid = data.servers.rate_sid;
                var rate_info = null;
                GameConst.IsWhite = data.servers.is_white == 1;
                var isHaveLast = false;
                for (var i = 0; i < data.servers.server_list.length; i++) {
                    var sInfo = data.servers.server_list[i];
                    if (sInfo.id == GameConst.serverId) {
                        isHaveLast = true;
                        GameConst.serverIp = sInfo.host;
                        GameConst.serverPort = sInfo.port;
                        if (this.checkServerIsUpdate(sInfo)) {
                            return;
                        }
                    }
                    else if (sInfo.id == rate_sid) {
                        rate_info = sInfo;
                    }
                }
                if (!isHaveLast) {
                    GameConst.serverId = rate_info.id;
                    GameConst.serverIp = rate_info.host;
                    GameConst.serverPort = rate_info.port;
                }
                this.doSelectServer();
            }
            else {
                debug("登录失败");
            }
        };
        LoadControl.prototype.doSelectServer = function () {
            var localId = AGame.LocalData.getServerId();
            if (GameConst.serverId != localId) {
                AGame.PlatformUtils.getServerList(this.onCallServerList, this);
            }
            else {
                this.setComplete(LoadingEnum.UserLogin);
            }
        };
        LoadControl.prototype.onCallServerList = function (data) {
            debug("onCallServerList", data);
            var localId = Number(AGame.LocalData.getServerId());
            var lastId = GameConst.serverId;
            var localServer;
            var lastServer;
            for (var i = 0; i < data.server_list.length; i++) {
                var info = data.server_list[i];
                if (info.id == localId) {
                    localServer = info;
                }
                else if (info.id == lastId) {
                    lastServer = info;
                }
            }
            var serverInfo = localServer || lastServer;
            GameConst.serverId = serverInfo.id;
            GameConst.serverIp = serverInfo.host;
            GameConst.serverPort = serverInfo.port;
            AGame.LocalData.setServerId(GameConst.serverId);
            if (this.checkServerIsUpdate(serverInfo)) {
                return;
            }
            this.setComplete(LoadingEnum.UserLogin);
        };
        LoadControl.prototype.checkServerIsUpdate = function (serverInfo) {
            if (serverInfo.is_update != 0) {
                var noticeView = new AGame.NoticeView();
                noticeView.showNotice(serverInfo.is_update_msg);
                noticeView.x = this.m_pMain.width / 2;
                noticeView.y = this.m_pMain.height / 2;
                this.m_pMain.addChild(noticeView);
                return true;
            }
            return false;
        };
        LoadControl.prototype.onGameCodeStartUp = function () {
            var ent = AGame['GameMain'];
            ent['startup'](this.m_pMain);
        };
        LoadControl.prototype.doEnterGame = function () {
            var ent = AGame['GameMain'];
            // ent['onResComplete'](this.m_pMain);
            ent['onResComplete']();
        };
        /**
         * 加载资源
         */
        LoadControl.prototype.doLoadResource = function () {
            var delayedList = [
                ['common', 0],
                ['main', 1],
                // ['map', 1],
                ['map_base', 1],
                ['json', 1],
            ];
            AGame.ResUtils.loadGroups(delayedList, this.onResourceLoadComplete, this.onResourceLoadProgress, this);
        };
        LoadControl.prototype.onResourceLoadComplete = function (groupName) {
            if (groupName == 'common') {
                this.setComplete(LoadingEnum.Resource);
            }
        };
        LoadControl.prototype.onResourceLoadProgress = function (itemsLoaded, itemsTotal) {
            // debug("onResourceLoadProgress:",itemsLoaded, itemsTotal);
        };
        LoadControl.prototype.clearAll = function () {
            LoadControl.IS_LOADING = false;
            if (this.m_pLoadView) {
                this.m_pLoadView.onDestroy();
                this.m_pLoadView = null;
            }
            this.m_bIsGameCodeStartUp = false;
            this.m_pMain = null;
            this.m_pLoadCfg = [];
            this.m_pLoadCfg = null;
        };
        return LoadControl;
    }());
    AGame.LoadControl = LoadControl;
    __reflect(LoadControl.prototype, "AGame.LoadControl");
})(AGame || (AGame = {}));
//# sourceMappingURL=LoadControl.js.map