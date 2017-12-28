var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AGame;
(function (AGame) {
    var Controller = (function () {
        function Controller() {
        }
        Controller.prototype.register = function () {
        };
        Controller.prototype.execute = function (notification) {
        };
        Controller.prototype.getView = function (viewName, param) {
            var clazz = egret.getDefinitionByName(viewName);
            var ca = new clazz(param);
            return ca;
        };
        return Controller;
    }());
    AGame.Controller = Controller;
    __reflect(Controller.prototype, "AGame.Controller", ["AGame.IController"]);
})(AGame || (AGame = {}));
//# sourceMappingURL=Controller.js.map