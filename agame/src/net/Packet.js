var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AGame;
(function (AGame) {
    var Packet = (function () {
        function Packet() {
            this.buffer = new egret.ByteArray();
        }
        Packet.prototype.onReacive = function (dataByte) {
            dataByte.position = 3;
            this.protocol = dataByte.readShort();
            dataByte.readBytes(this.buffer, 0, dataByte.length - 5);
        };
        Packet.prototype.onWrite = function (protocol, sendData) {
            var byteArray = new egret.ByteArray(sendData.toArrayBuffer());
            this.buffer.writeByte(Packet.HEAD);
            this.buffer.writeShort(byteArray.length + 2);
            this.buffer.writeShort(protocol);
            this.buffer.writeBytes(byteArray);
        };
        Packet.prototype.onClear = function () {
            this.buffer.clear();
        };
        Packet.HEAD = 0x7c;
        return Packet;
    }());
    AGame.Packet = Packet;
    __reflect(Packet.prototype, "AGame.Packet");
})(AGame || (AGame = {}));
//# sourceMappingURL=Packet.js.map