module AGame {
	export class LocalData {
		
		private static OPEN_ID: string = "h5sdk.openid";
		private static SERVER_ID: string = "h5sdk.serverid";

		public static setData(key: string, data: any): void {
			egret.localStorage.setItem(key, data);
		}

		public static getData(key: string): any {
			var data: any;
			data = egret.localStorage.getItem(key);
			return data ? data : '';
		}

		public static removeData(key: string) {
			egret.localStorage.removeItem(key);
		}

		public static removeOpenId() {
			egret.localStorage.removeItem(this.OPEN_ID);
		}

		public static setOpenId(openId: any): void {
			this.setData(this.OPEN_ID, openId);
		}

		public static setServerId(serverId: any): void {
			this.setData(this.SERVER_ID, serverId);
		}

		public static getOpenId(): any {
			var opend_id = this.getData(this.OPEN_ID)
			if (!opend_id) {
				opend_id = this.getRandomId();
			}
			this.setData(this.OPEN_ID, opend_id);
			return opend_id;
		}

		public static getServerId(): any {
			// this.removeData(this.SERVER_ID);
			var server_id = this.getData(this.SERVER_ID) || GameConst.getServerId();
			this.setData(this.SERVER_ID, server_id);
			return server_id;
		}

		public static getIsDebug() {
			let key = "h5sdk.isDebug"
			var isDebug = this.getData(key) || 0;
			this.setData(key, isDebug);
			return isDebug == 1;
		}

		private static getRandomId() {
			let open_id = "Temp" + Math.floor(new Date().getTime() / 1000);
			return open_id;
		}
	}
}