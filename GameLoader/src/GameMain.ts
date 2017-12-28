module AGame {
	export class GameMain {

		private static client:Client;

        private static m_bLoginSocket:boolean = false;
		private static m_bLoaded: boolean = false;
		
		// private static m_pClickAni: ClickEffectAni;

        public static clear(){
            this.client = null;
            this.m_bLoaded = false;
            this.m_bLoginSocket = false;
        }


        public static startup(stage): void {
			this.client = stage;
			debug("初始化client");
            // com_main.Bootstrap.startup(stage,this.onLoginDataComplete, this);

			AGame.R.startup(this.client);
			this.onLoginDataComplete();
        }

        private static onTouchEnd(event:egret.TouchEvent){
            // debug("Client onTouchEnd");

            //地图的点击特效还是由地图那边处理，避免移动地图时点击特效游离在地图上面不好看
            // if (egret.is(event.target, "com_main.HiveMap")) {
            //     return;
            // }
            // else if (egret.is(event.target, "com_main.CityMapRoot")) {
            //     return;
            // }

            // if (!this.m_pClickAni) {
            //     this.m_pClickAni = new ClickEffectAni();
            //     this.client.addChild(this.m_pClickAni);
            // }
            // this.m_pClickAni.x = event.stageX;
            // this.m_pClickAni.y = event.stageY;
            // this.m_pClickAni.play(true);
        }


        private static onLoginDataComplete(){
            debug("onLoginSocket");
            this.m_bLoginSocket = true;
            this.enterGame();
        }

        public static onResComplete() {
            debug("onResComplete");
            this.m_bLoaded = true;
            this.enterGame();
        }

        private static enterGame():void{
			if (!(this.m_bLoginSocket && this.m_bLoaded)) { return };
			debug("进入游戏");

			this.client.removeControl();

			let view = new MainMenu();
			AGame.R.app.menuLevel.addChild(view);
			view.startCreateScene();

            // DragonBonesData.initConfig();
            // EffectData.initConfig();
            // this.client.removeControl();
            // this.client.removeEventListener(egret.Event.RESIZE,this.onResize,this);
            // this.client.addEventListener(egret.Event.RESIZE,this.onResize,this);

            // this.client.removeEventListener(egret.TouchEvent.TOUCH_END,this.onTouchEnd,this);
            // this.client.addEventListener(egret.TouchEvent.TOUCH_END,this.onTouchEnd,this,true,99);
            // SceneManager.changeAni;
            // NpcConf.initConfig();
            // AGame.R.notifyView(MenuNav.MENU_INIT);
            // SceneManager.change(SceneType.LOBBY);
            // egret.setTimeout(function() {
            //     NativeHelper.sendEnterGame("enter");
            // },this,1000);
            // AGame.R.notifyView(MapNav.LoadMapBg);
            // PlatformUtils.sendRoleInfo();
            // if(RoleData.isNewPlayer){
            //     AGame.R.notifyView(BuildingNav.BUILD_CREATE_ROLE);//创建角色
            // }

        }

        public static onResize(event){
			debug("onResize event", event);
            // AGame.R.notifyView(GameNav.Resize);
            // UpManager.resize();
		}
		
	}
}