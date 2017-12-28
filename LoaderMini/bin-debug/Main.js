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
//最小加载，直接只动态加载loading组，初始化加载界面后再去加载其他
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.m_pLoadingRes = {};
        _this.isThemeLoadEnd = false;
        _this.isResourceLoadEnd = false;
        return _this;
    }
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        //注入自定义的素材解析器
        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        RES.setMaxLoadingThread(4);
        this.m_pLoadingRes = {};
        //初始化加载对象
        this.m_pLoadingRes[LoadingUI.Bg] = null;
        this.m_pLoadingRes[LoadingUI.BarBg] = null;
        this.m_pLoadingRes[LoadingUI.Bar] = null;
        this.startPreLoad();
    };
    Main.prototype.startPreLoad = function () {
        for (var url in this.m_pLoadingRes) {
            RES.getResByUrl(url, this.loadOver, this);
        }
    };
    Main.prototype.loadOver = function (data, url) {
        this.m_pLoadingRes[url] = data;
        //检测所有资源是否加载完毕
        var isAll = true;
        for (var i in this.m_pLoadingRes) {
            if (this.m_pLoadingRes[i] == null) {
                isAll = false;
                break;
            }
        }
        if (isAll) {
            console.log("loading资源加载完毕！");
            //设置加载进度界面
            this.loadingView = new LoadingUI(this.m_pLoadingRes);
            this.stage.addChild(this.loadingView);
            this.startLoading();
        }
    };
    Main.prototype.startLoading = function () {
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * 主题文件加载完成,开始预加载
     */
    Main.prototype.onThemeLoadComplete = function () {
        this.isThemeLoadEnd = true;
        this.createScene();
    };
    /**
     * preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.isResourceLoadEnd = true;
            this.createScene();
        }
    };
    Main.prototype.createScene = function () {
        if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
            this.startCreateScene();
        }
    };
    /**
     * 资源组加载出错
     */
    Main.prototype.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     */
    Main.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建场景界面
     */
    Main.prototype.startCreateScene = function () {
        Game.startGame();
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map