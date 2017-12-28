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
    /**
     * 飘字信息
     */
    var CUIMsg = (function (_super) {
        __extends(CUIMsg, _super);
        function CUIMsg(type, initData) {
            if (type === void 0) { type = 1; }
            var _this = _super.call(this) || this;
            _this.isActive = true;
            _this.isMoving = false;
            _this.nWaitingTime = 0;
            _this.nMoveTotalTime = 2800;
            _this.nDisplayTime = 80;
            _this.m_pSkinType = 1;
            _this.m_pSkinType = type;
            _this.m_pSkinData = initData;
            _this.skinName = _this.getSkinXml();
            return _this;
        }
        CUIMsg.prototype.getSkinXml = function () {
            return "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<e:Skin class=\"MessageTips1\" width=\"233\" height=\"50\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:com_main=\"com_main.*\" xmlns:ns1=\"*\" xmlns:w=\"http://ns.egret.com/wing\">\n\t<e:Group width=\"100%\" height=\"100%\" x=\"0\" y=\"0\" touchChildren=\"false\" touchEnabled=\"false\">\n\t\t<e:Label id=\"Lbl_text1\" text=\"Label\" textColor=\"0xe8dfc8\" size=\"25\" stroke=\"2\" strokeColor=\"0x242222\" verticalCenter=\"0\" horizontalCenter=\"0\"/>\n\t</e:Group>\n</e:Skin>";
        };
        CUIMsg.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.touchEnabled = false;
            this.touchChildren = false;
            this.setLblInfo();
            this.setData();
        };
        CUIMsg.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            egret.Tween.removeTweens(this);
        };
        CUIMsg.prototype.setData = function () {
            this.Lbl_text1.textColor = this.m_pSkinData.lbl1_color ? this.m_pSkinData.lbl1_color : this.Lbl_text1.textColor;
            this.Lbl_text1.text = this.m_pSkinData.lbl1_msg;
        };
        CUIMsg.prototype.setLblInfo = function (yPos) {
            if (yPos === void 0) { yPos = CMessageTip.MSG_START_Y; }
            this.y = yPos + this.height / 2;
            this.alpha = 0;
            this.verticalCenter = 0;
            this.horizontalCenter = 0;
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
        };
        CUIMsg.prototype.startTween = function (yPos, distance, duration) {
            if (yPos === void 0) { yPos = CMessageTip.MSG_START_Y; }
            if (distance === void 0) { distance = CUIMsg.tweenDist; }
            if (duration === void 0) { duration = CUIMsg.tweenDuration; }
            this.alpha = 0;
            this.visible = true;
            this.m_pAction = egret.Tween.get(this);
            this.m_pAction.to({ alpha: 1 }, 300, egret.Ease.backInOut)
                .wait(100)
                .to({ y: this.y - distance }, duration)
                .wait(100)
                .to({ scaleY: 0.5, alpha: 0 }, 400, egret.Ease.backOut).call(this.tweenComplete, this);
        };
        CUIMsg.prototype.tweenComplete = function () {
            if (this.parent)
                this.parent.removeChild(this);
            this.isActive = false;
            this.m_pAction = null;
            CMessageTip.clearQueue();
        };
        CUIMsg.prototype.resetTween = function (y, prop) {
            if (prop === void 0) { prop = 1; }
            egret.Tween.removeTweens(this);
            this.m_pAction = egret.Tween.get(this);
            this.y = y;
            this.alpha = 1;
            this.scaleX = 1;
            this.scaleY = 1;
            var dist = CUIMsg.tweenDist * prop;
            var duration = CUIMsg.tweenDuration * prop;
            this.m_pAction = egret.Tween.get(this);
            this.m_pAction.to({ y: this.y - dist }, duration)
                .wait(100)
                .to({ scaleY: 0.4, alpha: 0 }, 400).call(this.tweenComplete, this);
        };
        CUIMsg.prototype.stopTween = function () {
            egret.Tween.removeTweens(this);
        };
        CUIMsg.tweenDist = 40;
        CUIMsg.tweenDuration = 1200;
        return CUIMsg;
    }(eui.Component));
    AGame.CUIMsg = CUIMsg;
    __reflect(CUIMsg.prototype, "AGame.CUIMsg");
    var CMessageTip = (function () {
        function CMessageTip() {
        }
        //删除最后一个
        CMessageTip.clearLast = function () {
            var list = this.m_pQueue;
            list.pop();
        };
        CMessageTip.clearQueue = function () {
            var label;
            var list = this.m_pQueue;
            for (var i = list.length - 1; i >= 0; i--) {
                label = list[i];
                if (!label.isActive)
                    list.splice(i, 1);
            }
        };
        CMessageTip.needsLayout = function () {
            this.clearQueue();
            var label;
            var list = this.m_pQueue;
            if (list.length > this.MAX_COUNT) {
                for (var i = 0; i < list.length - this.MAX_COUNT; i++) {
                    label = list[i];
                    label.stopTween();
                    label.parent.removeChild(label);
                    list.splice(0, 1);
                }
            }
            if (list.length > 0) {
                var yPos;
                for (var i = 0; i < list.length - 1; i++) {
                    var prop = (i + 1) / list.length;
                    label = list[i];
                    yPos = this.MSG_START_Y - (list.length - 1 - i) * label.height + label.height - 10;
                    label.resetTween(yPos, prop);
                }
            }
        };
        CMessageTip.message = function (stage, type, skinData) {
            if (type === void 0) { type = 1; }
            if (skinData === void 0) { skinData = null; }
            var label = new AGame.CUIMsg(type, skinData);
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
        };
        /**
         * 提示信息 - 直接输入字符串
         */
        CMessageTip.AddMessageInfo = function (stage, message_1, color_1) {
            if (color_1 === void 0) { color_1 = this.ERR_COLOR; }
            var skinData = { lbl1_msg: message_1, lbl1_color: color_1 };
            this.message(stage, 1, skinData);
        };
        /**
         * 提示错误信息 - 直接输入字符串
         */
        CMessageTip.AddMessageError = function (stage, message_1, color_1) {
            if (color_1 === void 0) { color_1 = this.ERR_COLOR; }
            var skinData = { lbl1_msg: message_1, lbl1_color: color_1 };
            this.message(stage, 1, skinData);
        };
        CMessageTip.INFO_COLOR = 0xEBFFFF;
        CMessageTip.ERR_COLOR = 0xF73e26;
        CMessageTip.MAX_COUNT = 4;
        CMessageTip.MSG_START_Y = 320;
        //public static MSG_START_Y:number = 500;
        CMessageTip.m_pQueue = [];
        CMessageTip.m_pTempList = [];
        return CMessageTip;
    }());
    AGame.CMessageTip = CMessageTip;
    __reflect(CMessageTip.prototype, "AGame.CMessageTip");
})(AGame || (AGame = {}));
//# sourceMappingURL=MessageTip.js.map