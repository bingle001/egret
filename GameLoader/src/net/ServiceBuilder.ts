module AGame {
	class ProtoBuilder {
		private m_pBuilder: any;

		public constructor() {
			var proto: string = RES.getRes("game_proto");
			this.m_pBuilder = dcodeIO.ProtoBuf.loadProto(proto);
		}

		public getClazz(name: string) {
			return this.m_pBuilder.build(name);
		}

		public newClazz(protocol: number, name: any) {
			var clazz: any = this.getClazz(name);
			var instance = new clazz();

			instance.protocol = protocol;
			return instance;
		}

		public decode(name: any, buffer: any) {
			var clazz = this.getClazz(name);
			if (!clazz){
				egret.error("协议解析错误",name,buffer);
				return null;
			}
			return clazz.decode(buffer);
		}

	}
	export class ServiceBuilder {
		private m_pBuilder: any = new ProtoBuilder();
		private m_pObserver: HandlerObserver = new HandlerObserver();
		private m_pProtocolMap: any = {};
		private m_pViewEvents: any = {};

		public register(protocol: number, commandClassRef: any, reqClass: string, resClass: string = null) {
			if (resClass) {
				this.m_pProtocolMap[protocol] = [commandClassRef, reqClass, resClass];
			} else {
				this.m_pProtocolMap[protocol] = [commandClassRef, reqClass];
			}
		}

		public notifyModel(protocol: number, data: any) {
			if (this.m_pProtocolMap[protocol]) {
				var model = this.getProtoModel(protocol);
				if (model && model.execute) {
					model.execute(new Notification(protocol, data));
				}
			}
		}

		public registerProxy(proxyName: any, notify: Function, target: any,other?:any): void {
			if(notify){
				var events:any[] = this.m_pViewEvents[ target.hashCode ];
				if(events && events.indexOf(proxyName) > -1)return;

				this.m_pObserver.registerObserver(proxyName, new Observer( notify, target, other));

				if( events )
					events.push( proxyName );
				else
					this.m_pViewEvents[ target.hashCode ] = [ proxyName ];
			}
		}

		public notifyProxy(notification: INotification) {
			this.m_pObserver.notifyObservers(notification);
		}

		public removeProxy(target: any): void {
			var events: any[] = this.m_pViewEvents[target.hashCode];
			if (!events) return;

			for (var i: number = 0; i < events.length; i++) {
				this.m_pObserver.removeObserver(events[i], target);
			}
			delete this.m_pViewEvents[target.hashCode];
		}

		private getProtoModel(protocol: number) {
			return this.m_pProtocolMap[protocol][0];
		}

		private getProtoByReq(protocol: number) {
			var protos: any[] = this.m_pProtocolMap[protocol];
			return this.m_pProtocolMap[protocol][1];
		}

		private getProtoByResp(protocol: number) {
			var protos: any[] = this.m_pProtocolMap[protocol];
			if (!protos) return null;
			return protos.length == 2 ? protos[1] : protos[2];
		}

		public newClazz(protocol: number) {
			return this.m_pBuilder.newClazz(protocol, this.getProtoByReq(protocol));
		}

		public decode(protocol: number, buffer: any) {
			let name = this.getProtoByResp(protocol);
			if(!name){
				egret.error("协议解析错误",protocol,buffer);
				return null;
			}
			return this.m_pBuilder.decode(name, buffer);
		}

		public decode_name(name: any, buffer: any) {
			return this.m_pBuilder.decode(name, buffer);
		}


		private static REQ_RESP_DIFF = 0;
		private static _instance: ServiceBuilder;

		public static get Instance() {
			if (!ServiceBuilder._instance) {
				ServiceBuilder._instance = new ServiceBuilder();
			}
			return ServiceBuilder._instance;
		}

		public static addProtoHandler(protocol: number, commandClassRef: any, reqClass: string, resClass: string = null) {
			ServiceBuilder.Instance.register(protocol, commandClassRef, reqClass, resClass);
		}

		public static notifyProtoHandler(protocol: number, data?: any) {
			ServiceBuilder.Instance.notifyModel(protocol - ServiceBuilder.REQ_RESP_DIFF, data);
		}

		public static notifyView(notification: INotification) {
			ServiceBuilder.Instance.notifyProxy(notification);
		}

		public static newClazz(protocol: number) {
			return ServiceBuilder.Instance.newClazz(protocol);
		}

		public static decode(protocol: number, buffer: any) {
			return ServiceBuilder.Instance.decode(protocol, buffer);
		}

		public static decode_name(name: any, buffer: any) {
			return ServiceBuilder.Instance.decode_name(name, buffer);
		}

		public static requestWithProtocol(protocol: number, notify?: Function, target?: any) {
			this.sendMessage(ServiceBuilder.Instance.newClazz(protocol), notify, target);
		}

		public static sendMessage(sendData: any, notify?: Function, target?: any,other?:any) {
			ServiceBuilder.Instance.registerProxy(sendData.protocol, notify, target,other);
			ASocket.getInstance().sendProtocol(sendData.protocol, sendData);
		}

		public static sendOnlyMessage(sendData: any, notify?: Function, target?: any,other?:Object){
			if (!other){
				other = {};
			}
			other['_isOnly'] = true;
			this.sendMessage(sendData,notify,target,other);
		}
	}
}