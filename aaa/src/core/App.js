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
var AGame;
(function (AGame) {
    var App = (function (_super) {
        __extends(App, _super);
        function App() {
            return _super.call(this) || this;
        }
        App.prototype.registerView = function (root) {
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
        };
        App.prototype.setBattleEnv = function (isshow) {
            this.m_pMapLevel.visible = !isshow;
            this.m_pMenuLevel.visible = !isshow;
            // this.m_pTopLevel.visible = !isshow;
            // this.m_pGuideLevel.visible = !isshow;
        };
        Object.defineProperty(App.prototype, "stageWidth", {
            get: function () {
                return this.m_pRoot.stage.stageWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "stageHeight", {
            get: function () {
                return this.m_pRoot.stage.stageHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "screenWidth", {
            get: function () {
                if (App.isNative) {
                    return egret.MainContext.instance.stage.stageWidth;
                }
                return this.m_pRoot.stage.$screen['canvas']['clientWidth'];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "screenHeight", {
            get: function () {
                if (App.isNative) {
                    return egret.MainContext.instance.stage.stageHeight;
                }
                return this.m_pRoot.stage.$screen['canvas']['clientHeight'];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "renderBuffer", {
            get: function () {
                return this.m_pRoot.stage.$displayList.renderBuffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "canvas", {
            get: function () {
                return this.m_pRoot.stage.$screen['canvas'];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "stage", {
            get: function () {
                return this.m_pRoot.stage;
            },
            enumerable: true,
            configurable: true
        });
        App.prototype.removeAll = function () {
            this.m_pMapLevel.removeChildren();
            this.m_pMenuLevel.removeChildren();
            this.m_pPopupLevel.removeChildren();
            this.m_pTopLevel.removeChildren();
            this.m_pGuideLevel.removeChildren();
            this.m_pRoot.removeChildren();
        };
        App.prototype.screenScale = function (height, width) {
            var screenScale = this.screenWidth / this.screenHeight;
            var standardScale = width / height;
            var scale = screenScale / standardScale + 0.1; //浏览器占用差值
            var tmpScale = screenScale / 1.5;
            if (scale > 0.95 && scale < 1) {
                scale = tmpScale < 1 ? (scale - 0.1) : 0.95;
            }
            else if (scale < 0.95) {
                //                scale -= 0.1;
            }
            return scale > 1 ? 1 : scale;
        };
        Object.defineProperty(App.prototype, "mapLevel", {
            get: function () {
                return this.m_pMapLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "menuLevel", {
            get: function () {
                return this.m_pMenuLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "popUpLevel", {
            get: function () {
                return this.m_pPopupLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "topLevel", {
            get: function () {
                return this.m_pTopLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "guideLevel", {
            get: function () {
                return this.m_pGuideLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "menu", {
            get: function () {
                return this.m_pMenu;
            },
            set: function (menu) {
                this.m_pMenu = menu;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "root", {
            get: function () {
                return this.m_pRoot;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "frameRate", {
            set: function (frameRate) {
                this.m_pRoot.stage.frameRate = frameRate;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App, "Instance", {
            get: function () {
                if (!App.instance)
                    App.instance = new App();
                return App.instance;
            },
            enumerable: true,
            configurable: true
        });
        App.isNative = egret.Capabilities.runtimeType != egret.RuntimeType.WEB;
        return App;
    }(egret.HashObject));
    AGame.App = App;
    __reflect(App.prototype, "AGame.App");
})(AGame || (AGame = {}));
//# sourceMappingURL=App.js.map