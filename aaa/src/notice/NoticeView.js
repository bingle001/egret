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
     * 公告
     */
    var NoticeView = (function (_super) {
        __extends(NoticeView, _super);
        function NoticeView() {
            var _this = _super.call(this) || this;
            _this.skinName = _this.getSkinXml();
            return _this;
        }
        NoticeView.prototype.showNotice = function (text) {
            this.lbl_text.text = text;
        };
        NoticeView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
        };
        NoticeView.prototype.getSkinXml = function () {
            return "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<e:Skin class=\"NoticeView\" width=\"530\" height=\"330\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\" xmlns:ns1=\"*\">\n\t<e:Group width=\"100%\" height=\"100%\" x=\"0\" y=\"0\">\n\t\t<e:Image width=\"100%\" height=\"100%\" x=\"0\" y=\"0\" scaleX=\"1\" scaleY=\"1\" source=\"kCommon_dikuang_bg_png\" scale9Grid=\"18,18,46,34\"/>\n\t\t<e:Group id=\"Group_Content\" width=\"460\" height=\"80\" anchorOffsetY=\"0\" verticalCenter=\"-10\" anchorOffsetX=\"0\" horizontalCenter=\"0\">\n\t\t\t<e:Label id=\"lbl_text\" text=\"\" y=\"14\" size=\"21\" horizontalCenter=\"0\" x=\"73\" scaleX=\"1\" scaleY=\"1\" stroke=\"2\" width=\"100%\" textAlign=\"center\" verticalAlign=\"middle\"/>\n\t\t</e:Group>\n\t\t<e:Image source=\"kComon_mbhw_png\" width=\"96%\" y=\"19\" height=\"28\" scaleX=\"1\" scaleY=\"1\" x=\"10\"/>\n\t\t<e:Image width=\"96%\" y=\"7.33\" x=\"9\" source=\"kUpdate_mbhw_g1_png\" anchorOffsetY=\"0\" scaleX=\"1\" scaleY=\"1\"/>\n\t\t<e:Label id=\"lbl_title\" text=\"\u516C\u544A\" y=\"13.33\" size=\"28\" textAlign=\"center\" verticalAlign=\"middle\" height=\"26\" horizontalCenter=\"4.5\" anchorOffsetX=\"0\" stroke=\"1.4\" x=\"202\" scaleX=\"1\" scaleY=\"1\" textColor=\"0xfbd796\"/>\n\t</e:Group>\n</e:Skin>";
        };
        return NoticeView;
    }(eui.Component));
    AGame.NoticeView = NoticeView;
    __reflect(NoticeView.prototype, "AGame.NoticeView");
})(AGame || (AGame = {}));
//# sourceMappingURL=NoticeView.js.map