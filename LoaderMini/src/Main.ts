//最小加载，直接只动态加载loading组，初始化加载界面后再去加载其他
class Main extends eui.UILayer {

    private m_pLoadingRes:any = {};

    /**
     * 加载进度界面
     */
    private loadingView: LoadingUI;
    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

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
    }

    private startPreLoad(): void{
        for (let url in this.m_pLoadingRes) {
            RES.getResByUrl(url, this.loadOver, this);
        }
    }

    private loadOver(data, url): void{
        this.m_pLoadingRes[url] = data;

        //检测所有资源是否加载完毕
        let isAll: boolean = true;
        for (let i in this.m_pLoadingRes) {
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
    }





    private startLoading(): void{
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        let theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }
    private isThemeLoadEnd: boolean = false;
    /**
     * 主题文件加载完成,开始预加载
     */
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
        this.createScene();
    }
    private isResourceLoadEnd: boolean = false;
    /**
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.isResourceLoadEnd = true;
            this.createScene();
        }
    }
    private createScene() {
        if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
            this.startCreateScene();
        }
    }
    /**
     * 资源组加载出错
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }
    /**
     * 资源组加载出错
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    
    /**
     * 创建场景界面
     */
    protected startCreateScene(): void {
        Game.startGame();
    }
    
}
