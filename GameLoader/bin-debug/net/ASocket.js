var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AGame;
(function (AGame) {
    var ASocket = (function () {
        function ASocket() {
            this.m_bIsConnected = false;
            this.m_bIsShowClose = true;
            this.m_pSocket = new egret.WebSocket();
            this.m_pSocket.type = egret.WebSocket.TYPE_BINARY;
            this.m_pSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceive, this);
            this.m_pSocket.addEventListener(egret.Event.CONNECT, this.onConnected, this);
            this.m_pSocket.addEventListener(egret.Event.CLOSE, this.onClose, this);
            this.m_pSocket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
            this.m_pHeartbeatTimer = new egret.Timer(1000 * ASocket.TIMER, 0);
            this.m_pHeartbeatTimer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        }
        ASocket.getInstance = function () {
            if (!ASocket._instance) {
                ASocket._instance = new ASocket();
            }
            return ASocket._instance;
        };
        ASocket.prototype.onReceive = function () {
            var byteArray = new egret.ByteArray();
            this.m_pSocket.readBytes(byteArray);
            var packet = new AGame.Packet();
            packet.onReacive(byteArray);
            var data = AGame.ServiceBuilder.decode(packet.protocol, packet.buffer.buffer);
            AGame.ServiceBuilder.notifyProtoHandler(packet.protocol, data);
            // egret.log("onReceive",packet.protocol,data);
            packet.onClear();
        };
        ASocket.prototype.onConnected = function () {
            console.log("onConnected");
            this.m_bIsConnected = true;
            this.m_bIsShowClose = true;
            AGame.ServiceBuilder.notifyProtoHandler(ASocket.CONNECTED_LOGIN);
        };
        ASocket.prototype.close = function () {
            if (this.m_bIsConnected) {
                this.m_bIsShowClose = false;
            }
            this.m_pSocket.close();
            this.onClose(false);
        };
        ASocket.prototype.onClose = function (isShow) {
            if (isShow === void 0) { isShow = true; }
            this.m_bIsConnected = false;
            this.stopHeartbeat();
            AGame.ServiceBuilder.notifyProtoHandler(ASocket.CONNECTED_CLOSE);
            this.onClear();
        };
        ASocket.prototype.onClear = function () {
            if (!this.m_pSocket)
                return;
            this.m_pSocket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceive, this);
            this.m_pSocket.removeEventListener(egret.Event.CONNECT, this.onConnected, this);
            this.m_pSocket.removeEventListener(egret.Event.CLOSE, this.onClose, this);
            this.m_pSocket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
            this.m_pSocket = null;
            ASocket._instance = null;
        };
        ASocket.prototype.onError = function () {
            this.m_bIsConnected = false;
        };
        ASocket.prototype.setConnectInfo = function (ip, port) {
            this.m_pIp = ip;
            this.m_iPort = port;
        };
        ASocket.prototype.connect = function () {
            this.m_pSocket.connect(this.m_pIp, this.m_iPort);
        };
        ASocket.prototype.sendProtocol = function (protocol, sendData) {
            var packet = new AGame.Packet();
            packet.onWrite(protocol, sendData);
            this.sendBytes(packet.buffer);
            // egret.log("sendProtocol",protocol,sendData);
            packet.onClear();
        };
        ASocket.prototype.sendBytes = function (bytes) {
            this.m_pSocket.writeBytes(bytes);
            this.m_pSocket.flush();
        };
        //是否已经连接成功
        ASocket.prototype.isConnected = function () {
            return this.m_bIsConnected;
        };
        //开始发送心跳包
        ASocket.prototype.startHeartbeat = function () {
            this.onTimer();
            this.m_pHeartbeatTimer.start();
        };
        ASocket.prototype.stopHeartbeat = function () {
            this.m_pHeartbeatTimer.stop();
        };
        ASocket.prototype.onTimer = function () {
            AGame.HeartbeatQueue.timer(ASocket.TIMER);
        };
        ASocket.CONNECTED_LOGIN = 500001; //连接成功
        ASocket.CONNECTED_CLOSE = 500002; //连接关闭
        ASocket.TIMER = 30;
        return ASocket;
    }());
    AGame.ASocket = ASocket;
    __reflect(ASocket.prototype, "AGame.ASocket");
})(AGame || (AGame = {}));
//# sourceMappingURL=ASocket.js.map