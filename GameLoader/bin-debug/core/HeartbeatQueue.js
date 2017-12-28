var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AGame;
(function (AGame) {
    var ATimerEvent = (function () {
        function ATimerEvent() {
            this.m_pDelay = 0;
            this.m_pTimerComFunc = null;
            this.m_pSendDelay = 0;
        }
        ATimerEvent.prototype.timer = function (delay) {
            this.m_pSendDelay += delay;
            if (this.m_pSendDelay >= this.m_pDelay) {
                this.m_pSendDelay -= this.m_pDelay;
                if (this.m_pTimerComFunc)
                    this.m_pTimerComFunc.call(this.m_pTargert);
            }
        };
        ATimerEvent.create = function (delay, timerComFunc, targert) {
            if (delay === void 0) { delay = 300; }
            var timer = new ATimerEvent();
            timer.m_pDelay = delay;
            timer.m_pTimerComFunc = timerComFunc;
            timer.m_pTargert = targert;
            return timer;
        };
        return ATimerEvent;
    }());
    AGame.ATimerEvent = ATimerEvent;
    __reflect(ATimerEvent.prototype, "AGame.ATimerEvent");
    /**
     * 调用心跳包频率倍数的定时器
     */
    var HeartbeatQueue = (function () {
        function HeartbeatQueue() {
        }
        HeartbeatQueue.timer = function (delay) {
            // console.log("TimerQueue:timer:",this.m_pQueue.length);
            for (var i = 0; i < this.m_pQueue.length; i++) {
                var event_1 = this.m_pQueue[i];
                event_1.timer(delay);
            }
        };
        HeartbeatQueue.clear = function () {
            this.m_pQueue = [];
        };
        HeartbeatQueue.isExistKey = function (name) {
            for (var i = 0; i < this.m_pQueue.length; i++) {
                var time_event = this.m_pQueue[i];
                if (time_event.name == name) {
                    return true;
                }
            }
            return false;
        };
        HeartbeatQueue.removeTimerEventByName = function (name) {
            for (var i = 0; i < this.m_pQueue.length; i++) {
                var time_event = this.m_pQueue[i];
                if (time_event.name == name) {
                    this.m_pQueue.splice(i, 1);
                    break;
                }
            }
        };
        HeartbeatQueue.create = function (delay, timerComFunc, targert, name) {
            var time_event = ATimerEvent.create(delay, timerComFunc, targert);
            time_event.name = name;
            this.m_pQueue.push(time_event);
        };
        HeartbeatQueue.m_pQueue = [];
        return HeartbeatQueue;
    }());
    AGame.HeartbeatQueue = HeartbeatQueue;
    __reflect(HeartbeatQueue.prototype, "AGame.HeartbeatQueue");
})(AGame || (AGame = {}));
//# sourceMappingURL=HeartbeatQueue.js.map