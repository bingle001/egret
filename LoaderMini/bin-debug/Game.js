var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Game = (function () {
    function Game() {
    }
    Game.startGame = function () {
        console.log("开始游戏");
    };
    return Game;
}());
__reflect(Game.prototype, "Game");
//# sourceMappingURL=Game.js.map