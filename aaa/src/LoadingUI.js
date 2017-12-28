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
    var LoadingUI = (function (_super) {
        __extends(LoadingUI, _super);
        function LoadingUI(obj) {
            var _this = _super.call(this) || this;
            _this.m_pStopLoader = false;
            _this.m_pLoadRes = false;
            _this.viewWidth = 0;
            _this.skinName = _this.getSkinXml();
            _this.m_pLoadControl = obj;
            return _this;
        }
        LoadingUI.prototype.stopLoader = function () {
            clearTimeout(this.m_timerHandle);
            this.m_pStopLoader = true;
        };
        LoadingUI.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.stopLoader();
            _super.prototype.$onRemoveFromStage.call(this);
            this.setSkin(null);
        };
        LoadingUI.prototype.onDestroy = function () {
            this.stopLoader();
            this.btn_login.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUserLogin, this);
            this.parent.removeChild(this);
        };
        LoadingUI.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.width = this.viewWidth;
            this.m_pPwd.displayAsPassword = true;
            this.m_pEdition.text = "Ver." + GameConst.Packaged_Version;
            this.setProgress(0, 0);
            this.m_pAccount.text = AGame.LocalData.getOpenId();
            this.btn_login.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUserLogin, this);
        };
        LoadingUI.prototype.showView = function () {
            if (GameConst.isShowLogin) {
                egret.setTimeout(function () {
                    AGame.NativeHelper.sendEnterGame("enter");
                }, this, 1000);
                this.m_pProgressGroup.visible = false;
                this.Group_Login.visible = true;
            }
            else {
                this.Group_Login.visible = false;
                this.simulationLoad(500);
            }
        };
        LoadingUI.prototype.onUserLogin = function () {
            var openId = this.m_pAccount.text;
            var pwd = this.m_pPwd.text;
            if (openId == "") {
                AGame.CMessageTip.AddMessageError(this, "请输入账号");
                return;
            }
            // if (pwd != "666"){
            //     CMessageTip.AddMessageError(this,"密码错误");
            //     return;
            // }
            this.Group_Login.visible = false;
            this.simulationLoad(500);
            AGame.LocalData.setOpenId(openId);
            this.m_pLoadControl.userLogin();
        };
        /**
         * 设置进度条
         */
        LoadingUI.prototype.setProgress = function (current, total) {
            if (current == 0) {
                this.m_pProgressImg.width = 0;
            }
            else {
                if (current > total)
                    current = total;
                var percent = current / total;
                if (this.m_pProgressGroup) {
                    this.m_pProgressImg.width = this.m_pProgressGroup.width * percent;
                }
            }
            if (total * 0.5 <= current && total != 0 && this.m_pLoadRes == false) {
                this.m_pLoadRes = true;
            }
            if (this.m_pProgressImg) {
                this.m_pProgressStar.x = this.m_pProgressImg.width - 6;
                this.m_pProgressStar.visible = this.m_pProgressStar.x >= 10;
                this.m_pProgressImg.visible = this.m_pProgressStar.x <= 960;
                if (this.m_pProgressStar.x > 960) {
                    this.m_pProgressStar.visible = false;
                }
            }
        };
        /**
         * 模拟负载
         */
        LoadingUI.prototype.simulationLoad = function (loadCount, timeout, callback, target) {
            if (timeout === void 0) { timeout = 5; }
            this.m_pProgressGroup.visible = true;
            this.stopLoader();
            this.m_pStopLoader = false;
            var oThis = this;
            var loadIndex = 0;
            var simulation = function () {
                oThis.setProgress(loadIndex, loadCount);
                if (oThis.m_pStopLoader) {
                    return;
                }
                if (loadIndex++ < loadCount) {
                    this.m_timerHandle = setTimeout(simulation, timeout);
                }
                else {
                    oThis.setProgress(0, 500);
                    oThis.m_pStopLoader = false;
                    oThis.simulationLoad(500);
                }
            };
            this.m_timerHandle = setTimeout(simulation, timeout);
        };
        /**
         * 显示login
         */
        LoadingUI.prototype.showLogin = function () {
            this.showProgress(false);
            this.stopLoader();
        };
        LoadingUI.prototype.showProgress = function (visible) {
            if (visible === void 0) { visible = true; }
            this.m_pProgressGroup.visible = visible;
        };
        LoadingUI.prototype.getSkinXml = function () {
            return "<?xml version='1.0' encoding='utf-8'?>\n<e:Skin class=\"LoginSkin\" width=\"1334\" height=\"750\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\"  xmlns:ns1=\"*\">\n\t<e:Image xmlns:com_main=\"com_main.*\" horizontalCenter=\"0\" verticalCenter=\"0\" width=\"100%\" height=\"100%\" source=\"loading_bg_jpg\"/>\n\t<e:Group id=\"m_pProgressGroup\" horizontalCenter=\"0\" y=\"618\" width=\"981\" height=\"43\">\n\t\t<e:Image xmlns:com_main=\"com_main.*\" source=\"loading_jd_di_png\" horizontalCenter=\"0\" verticalCenter=\"0\"/>\n\t\t<e:Group id=\"m_pProgressImg\" width=\"500\" height=\"22\" verticalCenter=\"0\" scrollEnabled=\"true\" anchorOffsetX=\"0\" left=\"9\">\n\t\t\t<e:Image scaleX=\"1\" scaleY=\"1\" source=\"loading_jd_2_png\" x=\"0\" y=\"0\"/>\n\t\t</e:Group>\n\t\t<e:Image id=\"m_pProgressStar\" x=\"500\" source=\"loading_jd_1_png\" verticalCenter=\"0.5\" anchorOffsetX=\"0\"/>\n\t</e:Group>\n\t<e:Label xmlns:ns1=\"*\" id=\"m_pTip1\" text=\"\u62B5\u5236\u4E0D\u826F\u6E38\u620F\uFF0C\u62D2\u7EDD\u76D7\u7248\u6E38\u620F\uFF0C\u6CE8\u610F\u81EA\u6211\u4FDD\u62A4\uFF0C\u8C28\u9632\u53D7\u9A97\u4E0A\u5F53\" size=\"22\" y=\"678.28\" stroke=\"1\" textColor=\"0xe6ddcf\" horizontalCenter=\"0\"/>\n\t<e:Label xmlns:ns1=\"*\" id=\"m_pTip2\" size=\"22\" text=\"\u9002\u5EA6\u6E38\u620F\u76CA\u8111\uFF0C\u6C89\u8FF7\u6E38\u620F\u4F24\u8EAB\uFF0C\u5408\u7406\u5B89\u6392\u65F6\u95F4\uFF0C\u4EAB\u53D7\u5065\u5EB7\u751F\u6D3B\" y=\"709\" stroke=\"1\" textColor=\"0xe6ddcf\" horizontalCenter=\"0\"/>\n\t<e:Label id=\"m_pEdition\" text=\"Ver.20170415\" size=\"22\" textColor=\"0xc9c6b8\" width=\"150\" textAlign=\"right\" y=\"709\" right=\"10\"/>\n\t<e:Image width=\"20\" height=\"20\" x=\"76\" y=\"360\"/>\n\t<e:Group id=\"Group_Login\" width=\"984\" height=\"390\" anchorOffsetX=\"0\" horizontalCenter=\"0\" verticalCenter=\"0\" visible=\"false\">\n\t\t<e:Image horizontalCenter=\"0\" verticalCenter=\"0\" source=\"loading_di_png\"/>\n\t\t<e:Image x=\"222\" y=\"106.42\" source=\"loading_acc_png\"/>\n\t\t<e:Image x=\"373\" y=\"94.48\" source=\"loading_input_bg_png\"/>\n\t\t<e:EditableText id=\"m_pAccount\" width=\"366\" height=\"60\" text=\"\" x=\"393\" y=\"106.36\" size=\"56\" textColor=\"0xf1f1f1\" maxChars=\"15\"/>\n\t\t<e:Image x=\"223.43\" y=\"167.94\" source=\"loading_pwd_png\" visible=\"false\"/>\n\t\t<e:Image x=\"373\" y=\"156.06\" source=\"loading_input_bg_png\" visible=\"false\"/>\n\t\t<e:EditableText id=\"m_pPwd\" width=\"366\" height=\"60\" text=\"\" x=\"393\" y=\"167.88\" size=\"56\" textColor=\"0xF1F1F1\" maxChars=\"15\" inputType=\"password\" visible=\"false\"/>\n\t\t<e:Group id=\"btn_login\" width=\"383\" height=\"104\" y=\"256.45\" horizontalCenter=\"0.5\">\n\t\t\t<e:Image scaleX=\"1\" scaleY=\"1\" horizontalCenter=\"0\" verticalCenter=\"0\" source=\"loading_btn_png\"/>\n\t\t\t<e:Label text=\"\u8FDB\u5165\u6E38\u620F\" size=\"56\" horizontalCenter=\"0\" verticalCenter=\"0\" textColor=\"0xcfddfd\"/>\n\t\t</e:Group>\n\t</e:Group>\n</e:Skin>";
        };
        return LoadingUI;
    }(eui.Component));
    AGame.LoadingUI = LoadingUI;
    __reflect(LoadingUI.prototype, "AGame.LoadingUI");
})(AGame || (AGame = {}));
//# sourceMappingURL=LoadingUI.js.map