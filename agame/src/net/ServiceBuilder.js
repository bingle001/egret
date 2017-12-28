var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AGame;
(function (AGame) {
    var ProtoBuilder = (function () {
        function ProtoBuilder() {
            var proto = RES.getRes("game_proto");
            this.m_pBuilder = dcodeIO.ProtoBuf.loadProto(proto);
        }
        ProtoBuilder.prototype.getClazz = function (name) {
            return this.m_pBuilder.build(name);
        };
        ProtoBuilder.prototype.newClazz = function (protocol, name) {
            var clazz = this.getClazz(name);
            var instance = new clazz();
            instance.protocol = protocol;
            return instance;
        };
        ProtoBuilder.prototype.decode = function (name, buffer) {
            var clazz = this.getClazz(name);
            if (!clazz) {
                egret.error("协议解析错误", name, buffer);
                return null;
            }
            return clazz.decode(buffer);
        };
        return ProtoBuilder;
    }());
    __reflect(ProtoBuilder.prototype, "ProtoBuilder");
    var ServiceBuilder = (function () {
        function ServiceBuilder() {
            this.m_pBuilder = new ProtoBuilder();
            this.m_pObserver = new AGame.HandlerObserver();
            this.m_pProtocolMap = {};
            this.m_pViewEvents = {};
        }
        ServiceBuilder.prototype.register = function (protocol, commandClassRef, reqClass, resClass) {
            if (resClass === void 0) { resClass = null; }
            if (resClass) {
                this.m_pProtocolMap[protocol] = [commandClassRef, reqClass, resClass];
            }
            else {
                this.m_pProtocolMap[protocol] = [commandClassRef, reqClass];
            }
        };
        ServiceBuilder.prototype.notifyModel = function (protocol, data) {
            if (this.m_pProtocolMap[protocol]) {
                var model = this.getProtoModel(protocol);
                if (model && model.execute) {
                    model.execute(new AGame.Notification(protocol, data));
                }
            }
        };
        ServiceBuilder.prototype.registerProxy = function (proxyName, notify, target, other) {
            if (notify) {
                var events = this.m_pViewEvents[target.hashCode];
                if (events && events.indexOf(proxyName) > -1)
                    return;
                this.m_pObserver.registerObserver(proxyName, new AGame.Observer(notify, target, other));
                if (events)
                    events.push(proxyName);
                else
                    this.m_pViewEvents[target.hashCode] = [proxyName];
            }
        };
        ServiceBuilder.prototype.notifyProxy = function (notification) {
            this.m_pObserver.notifyObservers(notification);
        };
        ServiceBuilder.prototype.removeProxy = function (target) {
            var events = this.m_pViewEvents[target.hashCode];
            if (!events)
                return;
            for (var i = 0; i < events.length; i++) {
                this.m_pObserver.removeObserver(events[i], target);
            }
            delete this.m_pViewEvents[target.hashCode];
        };
        ServiceBuilder.prototype.getProtoModel = function (protocol) {
            return this.m_pProtocolMap[protocol][0];
        };
        ServiceBuilder.prototype.getProtoByReq = function (protocol) {
            var protos = this.m_pProtocolMap[protocol];
            return this.m_pProtocolMap[protocol][1];
        };
        ServiceBuilder.prototype.getProtoByResp = function (protocol) {
            var protos = this.m_pProtocolMap[protocol];
            if (!protos)
                return null;
            return protos.length == 2 ? protos[1] : protos[2];
        };
        ServiceBuilder.prototype.newClazz = function (protocol) {
            return this.m_pBuilder.newClazz(protocol, this.getProtoByReq(protocol));
        };
        ServiceBuilder.prototype.decode = function (protocol, buffer) {
            var name = this.getProtoByResp(protocol);
            if (!name) {
                egret.error("协议解析错误", protocol, buffer);
                return null;
            }
            return this.m_pBuilder.decode(name, buffer);
        };
        ServiceBuilder.prototype.decode_name = function (name, buffer) {
            return this.m_pBuilder.decode(name, buffer);
        };
        Object.defineProperty(ServiceBuilder, "Instance", {
            get: function () {
                if (!ServiceBuilder._instance) {
                    ServiceBuilder._instance = new ServiceBuilder();
                }
                return ServiceBuilder._instance;
            },
            enumerable: true,
            configurable: true
        });
        ServiceBuilder.addProtoHandler = function (protocol, commandClassRef, reqClass, resClass) {
            if (resClass === void 0) { resClass = null; }
            ServiceBuilder.Instance.register(protocol, commandClassRef, reqClass, resClass);
        };
        ServiceBuilder.notifyProtoHandler = function (protocol, data) {
            ServiceBuilder.Instance.notifyModel(protocol - ServiceBuilder.REQ_RESP_DIFF, data);
        };
        ServiceBuilder.notifyView = function (notification) {
            ServiceBuilder.Instance.notifyProxy(notification);
        };
        ServiceBuilder.newClazz = function (protocol) {
            return ServiceBuilder.Instance.newClazz(protocol);
        };
        ServiceBuilder.decode = function (protocol, buffer) {
            return ServiceBuilder.Instance.decode(protocol, buffer);
        };
        ServiceBuilder.decode_name = function (name, buffer) {
            return ServiceBuilder.Instance.decode_name(name, buffer);
        };
        ServiceBuilder.requestWithProtocol = function (protocol, notify, target) {
            this.sendMessage(ServiceBuilder.Instance.newClazz(protocol), notify, target);
        };
        ServiceBuilder.sendMessage = function (sendData, notify, target, other) {
            ServiceBuilder.Instance.registerProxy(sendData.protocol, notify, target, other);
            AGame.ASocket.getInstance().sendProtocol(sendData.protocol, sendData);
        };
        ServiceBuilder.sendOnlyMessage = function (sendData, notify, target, other) {
            if (!other) {
                other = {};
            }
            other['_isOnly'] = true;
            this.sendMessage(sendData, notify, target, other);
        };
        ServiceBuilder.REQ_RESP_DIFF = 0;
        return ServiceBuilder;
    }());
    AGame.ServiceBuilder = ServiceBuilder;
    __reflect(ServiceBuilder.prototype, "AGame.ServiceBuilder");
})(AGame || (AGame = {}));
//# sourceMappingURL=ServiceBuilder.js.map