class Client extends eui.UILayer {

    private m_pLoadControl: AGame.LoadControl = null;

    protected createChildren(): void {
        AGame.NativeHelper.initExternalInterface();

        super.createChildren();
        this.m_pLoadControl = new AGame.LoadControl(this);
        this.setDefFont();
        this.loadConfig();
    }

    private loadConfig(): void {
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter", assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        RES.setMaxLoadingThread(6);
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);

        if (GameConst.isNative()) {
            if (!console.assert){
                console.assert = function () {
                    return true;
                }
            }
            AGame.ResUtils.loadConfig("resource/default.res.json", "resource/");
        } else {
            AGame.ResUtils.loadConfig(GameConst.RES_SERVER_CNF + "default.res.json" + "?v=" + GameConst.VERSION, GameConst.RES_SERVER_CNF);
        }
    }

    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        this.m_pLoadControl.setComplete(LoadingEnum.ResConfig);
        this.doLoadLanuchRes();
    }

    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(groupName: string): void {
        debug("onResourceLoadComplete----------" + groupName);
        if (groupName == "lanuch") {
            this.createLoading();
            this.doLoadGameJs();
        }else if (groupName == "proto"){
            this.m_pLoadControl.setComplete(LoadingEnum.Proto);
        }
    }

    private onThemeLoadComplete(): void {
        debug("onResourceLoadComplete----------" + "Theme");
        this.m_pLoadControl.setComplete(LoadingEnum.Theme);
    }

    private onResourceLoadProgress(itemsLoaded, itemsTotal):void {
        // debug("onResourceLoadProgress:",itemsLoaded, itemsTotal);
    }

    private doLoadLanuchRes(){
        AGame.ResUtils.loadGroups([['lanuch',9],['proto','0']], this.onResourceLoadComplete, this.onResourceLoadProgress, this);
    }

    private doLoadTheme(){
        if(GameConst.isNative()){
            AGame.ThemeUtils.load("resource/default.thm.json", this.stage, this.onThemeLoadComplete, this, false);
        }else{
            AGame.ThemeUtils.load(GameConst.RES_SERVER_CNF + "default.thm.json" + "?v=" + GameConst.VERSION, this.stage, this.onThemeLoadComplete, this, false);
        }
    }


    //加载游戏逻辑代码
    public doLoadGameJs(): void {
        let ent = AGame['GameMain'];
        let self = this;
        if (!ent) {
            egret_h5.loadScript(GameConst.asynchScripts, function () {
                self.doLoadTheme();
               self.m_pLoadControl.setComplete(LoadingEnum.Code);
            });
        } else {
            self.doLoadTheme();
            self.m_pLoadControl.setComplete(LoadingEnum.Code);
        }
    }

    private createLoading(){
        this.m_pLoadControl.createLoginView();
        if (!GameConst.isNative()) {
            let div = document.getElementById("preloading");
            if (div) div.style.display = "none";
        }
    }

    private setDefFont(): void {
        if (GameConst.isNative()) {
            if (RES.hasRes("lgzbFont_ttf")) {
                var ffs = RES.getVersionController().getVirtualUrl("resource/fonts/lgzbFont.ttf");
                GameConst.fontFamily = ffs;
            }
        } else if (!GameConst.isLoadFNT) {
            let os = egret.Capabilities.os;
            if ("iOS" == os) {
                GameConst.fontFamily = "Helvetica";
            }
            else if ("Android" == os) {
                GameConst.fontFamily = "Droid Sans Fallback";
            } else {
                GameConst.fontFamily = "SimHei";
            }
        } else {
            GameConst.fontFamily = "lgzbFont";
        }
        egret.TextField.default_fontFamily = GameConst.fontFamily;
    }

    public removeControl() {
        if (this.m_pLoadControl) {
            this.m_pLoadControl.clearAll();
            this.m_pLoadControl = null;
        }
    }

    public reloadGame(){
        GameConst.isShowLogin = false;
        this.m_pLoadControl = new AGame.LoadControl(this);
        this.createLoading();
        this.m_pLoadControl.setComplete(LoadingEnum.Proto);
        this.m_pLoadControl.setComplete(LoadingEnum.ResConfig);
        this.m_pLoadControl.setComplete(LoadingEnum.Code);
        this.m_pLoadControl.setComplete(LoadingEnum.Theme);
        this.m_pLoadControl.setComplete(LoadingEnum.Resource);
    }
}