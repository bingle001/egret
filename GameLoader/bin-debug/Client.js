var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Client = (function (_super) {
    __extends(Client, _super);
    function Client() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.m_pLoadControl = null;
        return _this;
    }
    Client.prototype.createChildren = function () {
        AGame.NativeHelper.initExternalInterface();
        _super.prototype.createChildren.call(this);
        this.m_pLoadControl = new AGame.LoadControl(this);
        this.setDefFont();
        this.loadConfig();
    };
    Client.prototype.loadConfig = function () {
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter", assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        RES.setMaxLoadingThread(6);
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        if (GameConst.isNative()) {
            if (!console.assert) {
                console.assert = function () {
                    return true;
                };
            }
            AGame.ResUtils.loadConfig("resource/default.res.json", "resource/");
        }
        else {
            AGame.ResUtils.loadConfig(GameConst.RES_SERVER_CNF + "default.res.json" + "?v=" + GameConst.VERSION, GameConst.RES_SERVER_CNF);
        }
    };
    Client.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        this.m_pLoadControl.setComplete(LoadingEnum.ResConfig);
        this.doLoadLanuchRes();
    };
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    Client.prototype.onResourceLoadComplete = function (groupName) {
        debug("onResourceLoadComplete----------" + groupName);
        if (groupName == "lanuch") {
            this.createLoading();
            this.doLoadGameJs();
        }
        else if (groupName == "proto") {
            this.m_pLoadControl.setComplete(LoadingEnum.Proto);
        }
    };
    Client.prototype.onThemeLoadComplete = function () {
        debug("onResourceLoadComplete----------" + "Theme");
        this.m_pLoadControl.setComplete(LoadingEnum.Theme);
    };
    Client.prototype.onResourceLoadProgress = function (itemsLoaded, itemsTotal) {
        // debug("onResourceLoadProgress:",itemsLoaded, itemsTotal);
    };
    Client.prototype.doLoadLanuchRes = function () {
        AGame.ResUtils.loadGroups([['lanuch', 9], ['proto', '0']], this.onResourceLoadComplete, this.onResourceLoadProgress, this);
    };
    Client.prototype.doLoadTheme = function () {
        if (GameConst.isNative()) {
            AGame.ThemeUtils.load("resource/default.thm.json", this.stage, this.onThemeLoadComplete, this, false);
        }
        else {
            AGame.ThemeUtils.load(GameConst.RES_SERVER_CNF + "default.thm.json" + "?v=" + GameConst.VERSION, this.stage, this.onThemeLoadComplete, this, false);
        }
    };
    //加载游戏逻辑代码
    Client.prototype.doLoadGameJs = function () {
        var ent = AGame['GameMain'];
        var self = this;
        if (!ent) {
            egret_h5.loadScript(GameConst.asynchScripts, function () {
                self.doLoadTheme();
                self.m_pLoadControl.setComplete(LoadingEnum.Code);
            });
        }
        else {
            self.doLoadTheme();
            self.m_pLoadControl.setComplete(LoadingEnum.Code);
        }
    };
    Client.prototype.createLoading = function () {
        this.m_pLoadControl.createLoginView();
        if (!GameConst.isNative()) {
            var div = document.getElementById("preloading");
            if (div)
                div.style.display = "none";
        }
    };
    Client.prototype.setDefFont = function () {
        if (GameConst.isNative()) {
            if (RES.hasRes("lgzbFont_ttf")) {
                var ffs = RES.getVersionController().getVirtualUrl("resource/fonts/lgzbFont.ttf");
                GameConst.fontFamily = ffs;
            }
        }
        else if (!GameConst.isLoadFNT) {
            var os = egret.Capabilities.os;
            if ("iOS" == os) {
                GameConst.fontFamily = "Helvetica";
            }
            else if ("Android" == os) {
                GameConst.fontFamily = "Droid Sans Fallback";
            }
            else {
                GameConst.fontFamily = "SimHei";
            }
        }
        else {
            GameConst.fontFamily = "lgzbFont";
        }
        egret.TextField.default_fontFamily = GameConst.fontFamily;
    };
    Client.prototype.removeControl = function () {
        if (this.m_pLoadControl) {
            this.m_pLoadControl.clearAll();
            this.m_pLoadControl = null;
        }
    };
    Client.prototype.reloadGame = function () {
        GameConst.isShowLogin = false;
        this.m_pLoadControl = new AGame.LoadControl(this);
        this.createLoading();
        this.m_pLoadControl.setComplete(LoadingEnum.Proto);
        this.m_pLoadControl.setComplete(LoadingEnum.ResConfig);
        this.m_pLoadControl.setComplete(LoadingEnum.Code);
        this.m_pLoadControl.setComplete(LoadingEnum.Theme);
        this.m_pLoadControl.setComplete(LoadingEnum.Resource);
    };
    return Client;
}(eui.UILayer));
__reflect(Client.prototype, "Client");
//# sourceMappingURL=Client.js.map