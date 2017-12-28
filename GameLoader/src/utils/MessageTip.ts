module AGame {
    /**
     * 飘字信息
     */
    export class CUIMsg extends eui.Component {
        public Lbl_text1: eui.Label;
        public Lbl_text2: eui.Label;
        private Img1_icon: eui.Image;
        private Group_main: eui.Group;
        public static tweenDist: number = 40;
        public static tweenDuration: number = 1200;

        public isActive: boolean = true;
        public isMoving: boolean = false;
        public nWaitingTime: number = 0;
        public nMoveTotalTime: number = 2800;
        public nDisplayTime: number = 80;

        private m_pAction: egret.Tween;
        private m_pYMultiple: number;
        private m_pSkinType = 1;
        private m_pSkinData;

        public constructor(type = 1, initData?) {
            super();
            this.m_pSkinType = type;
            this.m_pSkinData = initData;
            this.skinName = this.getSkinXml();
        }

        private getSkinXml() {
            return `<?xml version="1.0" encoding="utf-8"?>
<e:Skin class="MessageTips1" width="233" height="50" xmlns:e="http://ns.egret.com/eui" xmlns:com_main="com_main.*" xmlns:ns1="*" xmlns:w="http://ns.egret.com/wing">
	<e:Group width="100%" height="100%" x="0" y="0" touchChildren="false" touchEnabled="false">
		<e:Label id="Lbl_text1" text="Label" textColor="0xe8dfc8" size="25" stroke="2" strokeColor="0x242222" verticalCenter="0" horizontalCenter="0"/>
	</e:Group>
</e:Skin>`;
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.touchEnabled = false;
            this.touchChildren = false;
            this.setLblInfo();
            this.setData();
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            egret.Tween.removeTweens(this);
        }

        public setData(): void {
            this.Lbl_text1.textColor = this.m_pSkinData.lbl1_color ? this.m_pSkinData.lbl1_color : this.Lbl_text1.textColor;
            this.Lbl_text1.text = this.m_pSkinData.lbl1_msg;
        }

        public setLblInfo(yPos: number = CMessageTip.MSG_START_Y) {
            this.y = yPos + this.height / 2;
            this.alpha = 0;
            this.verticalCenter = 0;
            this.horizontalCenter = 0;
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
        }

        public startTween(yPos: number = CMessageTip.MSG_START_Y, distance = CUIMsg.tweenDist, duration = CUIMsg.tweenDuration): void {
            this.alpha = 0;
            this.visible = true;
            this.m_pAction = egret.Tween.get(this);
            this.m_pAction.to({alpha: 1}, 300, egret.Ease.backInOut)
                .wait(100)
                .to({y: this.y - distance}, duration)
                .wait(100)
                .to({scaleY: 0.5, alpha: 0}, 400, egret.Ease.backOut).call(this.tweenComplete, this);
        }

        private tweenComplete(): void {
            if (this.parent)this.parent.removeChild(this);
            this.isActive = false;
            this.m_pAction = null;

            CMessageTip.clearQueue();
        }

        public resetTween(y: number, prop: number = 1): void {
            egret.Tween.removeTweens(this);
            this.m_pAction = egret.Tween.get(this);

            this.y = y;
            this.alpha = 1;
            this.scaleX = 1;
            this.scaleY = 1;

            var dist: number = CUIMsg.tweenDist * prop;
            var duration: number = CUIMsg.tweenDuration * prop;

            this.m_pAction = egret.Tween.get(this);
            this.m_pAction.to({y: this.y - dist}, duration)
                .wait(100)
                .to({scaleY: 0.4, alpha: 0}, 400).call(this.tweenComplete, this);

        }

        public stopTween(): void {
            egret.Tween.removeTweens(this);
        }

    }

    export class CMessageTip {

        public static INFO_COLOR = 0xEBFFFF;
        public static ERR_COLOR = 0xF73e26;
        private static MAX_COUNT: number = 4;
        public static MSG_START_Y: number = 320;
        //public static MSG_START_Y:number = 500;
        public static m_pQueue: CUIMsg[] = [];
        private static m_pTempList: CUIMsg[] = [];
        private static m_pFirstClickTime;
        private static m_pNextClickTime;
        private static m_pClickTime: number;//点击的次数

        private static stage:egret.DisplayObjectContainer;

        //删除最后一个
        public static clearLast() {
            var list: CUIMsg[] = this.m_pQueue;
            list.pop();
        }

        public static clearQueue(): void {
            var label: CUIMsg;
            var list: CUIMsg[] = this.m_pQueue;
            for (var i: number = list.length - 1; i >= 0; i--) {
                label = list[i];
                if (!label.isActive) list.splice(i, 1);
            }
        }

        private static needsLayout(): void {
            this.clearQueue();

            var label: CUIMsg;
            var list: CUIMsg[] = this.m_pQueue;
            if (list.length > this.MAX_COUNT) {
                for (var i: number = 0; i < list.length - this.MAX_COUNT; i++) {
                    label = list[i];
                    label.stopTween();
                    label.parent.removeChild(label);
                    list.splice(0, 1);
                }
            }
            if (list.length > 0) {
                var yPos: number;
                for (var i: number = 0; i < list.length - 1; i++) {
                    var prop: number = (i + 1) / list.length;
                    label = list[i];
                    yPos = this.MSG_START_Y - (list.length - 1 - i) * label.height + label.height - 10;
                    label.resetTween(yPos, prop);
                }
            }
        }

        private static message(stage:egret.DisplayObjectContainer,type = 1, skinData = null): void {
            var label: CUIMsg = new AGame.CUIMsg(type, skinData);
            label.visible = false;
            this.m_pQueue.push(label);
            stage.addChild(label);
            label.x = stage.width / 2;

            this.stage = stage;

            this.needsLayout();
            if (type == 1 || type == 3 || type == 4 || type == 5) {
                label.startTween(this.MSG_START_Y);
            }
            else if (type == 2) {
                label.startTween(this.MSG_START_Y, 40, 1000);
            }
        }

        /**
         * 提示信息 - 直接输入字符串
         */
        public static AddMessageInfo(stage:egret.DisplayObjectContainer,message_1: string, color_1 = this.ERR_COLOR): void {
            let skinData = {lbl1_msg: message_1, lbl1_color: color_1};
            this.message(stage,1, skinData);
        }

        /**
         * 提示错误信息 - 直接输入字符串
         */
        public static AddMessageError(stage:egret.DisplayObjectContainer,message_1: string, color_1 = this.ERR_COLOR): void {

            let skinData = {lbl1_msg: message_1, lbl1_color: color_1};
            this.message(stage,1, skinData);
        }
    }
}