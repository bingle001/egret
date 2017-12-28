module AGame {
	export class App extends egret.HashObject{
		private m_pRoot;//根
        private m_pMenu;//菜单

        private m_pMapLevel: egret.DisplayObjectContainer;//地图层
        private m_pMenuLevel: egret.DisplayObjectContainer;//菜单层
        private m_pPopupLevel: egret.DisplayObjectContainer;//菜单层
        private m_pTopLevel: egret.DisplayObjectContainer;//顶层
        private m_pGuideLevel: egret.DisplayObjectContainer;//任务指引层

        public static isNative = egret.Capabilities.runtimeType != egret.RuntimeType.WEB;

		public constructor() {
			super();
        }

		public registerView(root: eui.UILayer) {

            this.m_pRoot = root;

            this.m_pMapLevel = new egret.DisplayObjectContainer();
            this.m_pMapLevel.name = "map";
            this.m_pRoot.addChild(this.m_pMapLevel);

            this.m_pMenuLevel = new egret.DisplayObjectContainer();
            this.m_pMenuLevel.name = "menu";
            this.m_pMenuLevel.height = this.stageHeight;
            this.m_pRoot.addChild(this.m_pMenuLevel);

            this.m_pPopupLevel = new egret.DisplayObjectContainer();
            this.m_pPopupLevel.name = "popUp";
            this.m_pRoot.addChild(this.m_pPopupLevel);

            this.m_pTopLevel = new egret.DisplayObjectContainer();
            this.m_pTopLevel.name = "top";
            this.m_pRoot.addChild(this.m_pTopLevel);

            this.m_pGuideLevel = new egret.DisplayObjectContainer();
            this.m_pGuideLevel.name = "guide";
            this.m_pRoot.addChild(this.m_pGuideLevel);

            // this.m_pTouchHandler = new ATouchHandler(this.canvas);
        }

        public setBattleEnv(isshow){
            this.m_pMapLevel.visible = !isshow;
            this.m_pMenuLevel.visible = !isshow;
            // this.m_pTopLevel.visible = !isshow;
            // this.m_pGuideLevel.visible = !isshow;
        }

		public get stageWidth(): number {
            return this.m_pRoot.stage.stageWidth;
        }

        public get stageHeight(): number {
            return this.m_pRoot.stage.stageHeight;
        }

		public get screenWidth(): number {
			if(App.isNative){
				return egret.MainContext.instance.stage.stageWidth;
			}
            return this.m_pRoot.stage.$screen['canvas']['clientWidth'];
        }

        public get screenHeight(): number {
			if(App.isNative){
				return egret.MainContext.instance.stage.stageHeight;
			}
			return this.m_pRoot.stage.$screen['canvas']['clientHeight'];
        }

        public get renderBuffer(){
            return this.m_pRoot.stage.$displayList.renderBuffer;
        }

        public get canvas(){
           return this.m_pRoot.stage.$screen['canvas'];
        }

        public get stage(){
            return this.m_pRoot.stage;
        }

        public removeAll(){
            this.m_pMapLevel.removeChildren();
            this.m_pMenuLevel.removeChildren();
            this.m_pPopupLevel.removeChildren();
            this.m_pTopLevel.removeChildren();
            this.m_pGuideLevel.removeChildren();
            this.m_pRoot.removeChildren();
        }

        public screenScale(height, width): number {
            var screenScale: number = this.screenWidth  /  this.screenHeight;
            var standardScale: number = width  /  height;

            var scale: number = screenScale / standardScale + 0.1;//浏览器占用差值
            var tmpScale: number = screenScale / 1.5;


            if (scale > 0.95 && scale < 1) {
                scale = tmpScale < 1 ? (scale - 0.1) : 0.95;
            } else if (scale < 0.95) {
                //                scale -= 0.1;
            }

            return scale > 1 ? 1 : scale;
        }

        public get mapLevel(): egret.DisplayObjectContainer {
            return this.m_pMapLevel;
        }

        public get menuLevel(): egret.DisplayObjectContainer {
            return this.m_pMenuLevel;
        }

        public get popUpLevel(): egret.DisplayObjectContainer {
            return this.m_pPopupLevel;
        }

        public get topLevel(): egret.DisplayObjectContainer {
            return this.m_pTopLevel;
        }

        public get guideLevel(): egret.DisplayObjectContainer {
            return this.m_pGuideLevel;
        }

        public set menu(menu){
            this.m_pMenu = menu;
        }

        public get menu(){
            return this.m_pMenu;
        }

        public get root() {
            return this.m_pRoot;
        }

        public set frameRate(frameRate){
            this.m_pRoot.stage.frameRate = frameRate;
        }

		protected static instance:App;
		
		static get Instance():App
		{
			if( !App.instance )
				App.instance = new App();

			return App.instance;
		}
	}
}