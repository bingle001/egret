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
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI(resMap) {
        var _this = _super.call(this) || this;
        _this.m_pResMap = resMap;
        _this.createView();
        return _this;
    }
    LoadingUI.prototype.createView = function () {
        var bg = new egret.Bitmap();
        bg.texture = this.m_pResMap[LoadingUI.Bg];
        this.addChild(bg);
        this.width = bg.width;
        this.height = bg.height;
        var barBg = new egret.Bitmap();
        barBg.texture = this.m_pResMap[LoadingUI.BarBg];
        barBg.x = 175;
        barBg.y = 600;
        this.addChild(barBg);
        this.m_pBar = new egret.Bitmap();
        this.m_pBar.texture = this.m_pResMap[LoadingUI.Bar];
        this.m_pBar.x = 177;
        this.m_pBar.y = 605;
        this.addChild(this.m_pBar);
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
    };
    LoadingUI.prototype.setProgress = function (current, total) {
        this.textField.text = "Loading..." + current + "/" + total;
        var scale = current / total;
        if (scale < 0) {
            scale = 0;
        }
        else if (scale > 1) {
            scale = 1;
        }
        this.m_pBar.scaleX = scale;
    };
    LoadingUI.Bg = "resource/loading/loading_bg.jpg";
    LoadingUI.BarBg = "resource/loading/loading_jd_di.png";
    LoadingUI.Bar = "resource/loading/loading_jd_2.png";
    return LoadingUI;
}(egret.Sprite));
__reflect(LoadingUI.prototype, "LoadingUI");
//# sourceMappingURL=LoadingUI.js.map