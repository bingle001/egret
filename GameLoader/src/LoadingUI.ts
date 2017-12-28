module AGame {

    export class LoadingUI extends eui.Component {

        private m_pProgressGroup: eui.Group;
        private m_pProgressImg: eui.Image;
        private m_pProgressStar: eui.Image;
        private m_pEdition: eui.Label;

        public m_pAccount:eui.EditableText;
        public m_pPwd:eui.EditableText;
        public btn_login:eui.Group;
        public Group_Login:eui.Group;

        private m_timerHandle: number;
        private m_pStopLoader: boolean = false;

        private m_pLoadControl: LoadControl;//保存LoadControl对象
        private m_pLoadRes: boolean = false;

        public viewWidth: number = 0;

        public constructor(obj) {
            super();
            this.skinName = this.getSkinXml();
            this.m_pLoadControl = obj;
        }

        private stopLoader() {
            clearTimeout(this.m_timerHandle);
            this.m_pStopLoader = true;
        }

        $onRemoveFromStage(isclear = true): void {
            this.stopLoader();
            super.$onRemoveFromStage();
            this.setSkin(null);
        }

        public onDestroy(): void {
            this.stopLoader();
            this.btn_login.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onUserLogin,this);
            this.parent.removeChild(this);
        }



        protected childrenCreated(): void {
            super.childrenCreated();
            this.width = this.viewWidth;
            this.m_pPwd.displayAsPassword = true;
            this.m_pEdition.text = "Ver." + GameConst.Packaged_Version;
            this.setProgress(0, 0);
            this.m_pAccount.text = LocalData.getOpenId();
            this.btn_login.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onUserLogin,this);
        }

        public showView(){
            if (GameConst.isShowLogin){
                egret.setTimeout(function() {
                    NativeHelper.sendEnterGame("enter");
                },this,1000);
                this.m_pProgressGroup.visible = false;
                this.Group_Login.visible = true;
            }else{
                this.Group_Login.visible = false;
                this.simulationLoad(500);
            }
        }

        private onUserLogin(){
            let openId = this.m_pAccount.text;
            let pwd = this.m_pPwd.text;
            if (openId == ""){
                CMessageTip.AddMessageError(this,"请输入账号");
                return;
            }

            // if (pwd != "666"){
            //     CMessageTip.AddMessageError(this,"密码错误");
            //     return;
            // }

            this.Group_Login.visible = false;
            this.simulationLoad(500);
            LocalData.setOpenId(openId);
            this.m_pLoadControl.userLogin();
        }

        /**
         * 设置进度条
         */
        public setProgress(current, total) {
            if (current == 0) {
                this.m_pProgressImg.width = 0;
            } else {
                if (current > total) current = total;
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

        }

        /**
         * 模拟负载
         */
        public simulationLoad(loadCount: number, timeout: number = 5, callback?: Function, target?: any): void {

            this.m_pProgressGroup.visible = true;
            this.stopLoader();

            this.m_pStopLoader = false;

            var oThis = this;
            var loadIndex: number = 0;
            var simulation: Function = function () {

                oThis.setProgress(loadIndex, loadCount);

                if (oThis.m_pStopLoader) {
                    return;
                }
                if (loadIndex++ < loadCount) {
                    this.m_timerHandle = setTimeout(simulation, timeout);
                } else {
                    oThis.setProgress(0, 500);
                    oThis.m_pStopLoader = false;
                    oThis.simulationLoad(500);
                }
            }
            this.m_timerHandle = setTimeout(simulation, timeout);
        }

        /**
         * 显示login
         */
        public showLogin() {
            this.showProgress(false);
            this.stopLoader();
        }

        public showProgress(visible: boolean = true): void {
            this.m_pProgressGroup.visible = visible;
        }


        private getSkinXml(){
            return `<?xml version='1.0' encoding='utf-8'?>
<e:Skin class="LoginSkin" width="1334" height="750" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing"  xmlns:ns1="*">
	<e:Image xmlns:com_main="com_main.*" horizontalCenter="0" verticalCenter="0" width="100%" height="100%" source="loading_bg_jpg"/>
	<e:Group id="m_pProgressGroup" horizontalCenter="0" y="618" width="981" height="43">
		<e:Image xmlns:com_main="com_main.*" source="loading_jd_di_png" horizontalCenter="0" verticalCenter="0"/>
		<e:Group id="m_pProgressImg" width="500" height="22" verticalCenter="0" scrollEnabled="true" anchorOffsetX="0" left="9">
			<e:Image scaleX="1" scaleY="1" source="loading_jd_2_png" x="0" y="0"/>
		</e:Group>
		<e:Image id="m_pProgressStar" x="500" source="loading_jd_1_png" verticalCenter="0.5" anchorOffsetX="0"/>
	</e:Group>
	<e:Label xmlns:ns1="*" id="m_pTip1" text="抵制不良游戏，拒绝盗版游戏，注意自我保护，谨防受骗上当" size="22" y="678.28" stroke="1" textColor="0xe6ddcf" horizontalCenter="0"/>
	<e:Label xmlns:ns1="*" id="m_pTip2" size="22" text="适度游戏益脑，沉迷游戏伤身，合理安排时间，享受健康生活" y="709" stroke="1" textColor="0xe6ddcf" horizontalCenter="0"/>
	<e:Label id="m_pEdition" text="Ver.20170415" size="22" textColor="0xc9c6b8" width="150" textAlign="right" y="709" right="10"/>
	<e:Image width="20" height="20" x="76" y="360"/>
	<e:Group id="Group_Login" width="984" height="390" anchorOffsetX="0" horizontalCenter="0" verticalCenter="0" visible="false">
		<e:Image horizontalCenter="0" verticalCenter="0" source="loading_di_png"/>
		<e:Image x="222" y="106.42" source="loading_acc_png"/>
		<e:Image x="373" y="94.48" source="loading_input_bg_png"/>
		<e:EditableText id="m_pAccount" width="366" height="60" text="" x="393" y="106.36" size="56" textColor="0xf1f1f1" maxChars="15"/>
		<e:Image x="223.43" y="167.94" source="loading_pwd_png" visible="false"/>
		<e:Image x="373" y="156.06" source="loading_input_bg_png" visible="false"/>
		<e:EditableText id="m_pPwd" width="366" height="60" text="" x="393" y="167.88" size="56" textColor="0xF1F1F1" maxChars="15" inputType="password" visible="false"/>
		<e:Group id="btn_login" width="383" height="104" y="256.45" horizontalCenter="0.5">
			<e:Image scaleX="1" scaleY="1" horizontalCenter="0" verticalCenter="0" source="loading_btn_png"/>
			<e:Label text="进入游戏" size="56" horizontalCenter="0" verticalCenter="0" textColor="0xcfddfd"/>
		</e:Group>
	</e:Group>
</e:Skin>`;
        }
    }
}