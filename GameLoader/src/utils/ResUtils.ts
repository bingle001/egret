module AGame {
	export class ResLoader{
		
		private m_pGroups:any[] = [];
		public length:number = 0;

		public constructor() {
			RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        	RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        	RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        	RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
		}

		public destroy(){
			RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        	RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        	RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        	RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);

			var group;
			for(var i:number = 0; i < this.m_pGroups.length; i++){
				group = this.m_pGroups[i];
				group[0] = null;
				group[1] = null;
				group[2] = null;
			}

			this.m_pGroups.length = 0;
			this.length = 0;
		}

		/**
		 * 加载资源组
		 * @param $groupName 资源组名称
		 * @param $onResourceLoadComplete 资源加载完成执行函数
		 * @param $onResourceLoadProgress 资源加载进度监听函数
		 * @param $onResourceLoadTarget 资源加载监听函数所属对象
		 */
		public loadGroup(groupName:string, onResourceLoadComplete:Function, onResourceLoadProgress:Function, target:any, priority?: number):void{
			this.m_pGroups[groupName] = [onResourceLoadComplete, onResourceLoadProgress, target];
			RES.loadGroup(groupName, priority);
		}

		/**
		 * 同时加载多个组
		 * @param $groups 自定义的组名称
		 * @param $onResourceLoadComplete 资源加载完成执行函数
		 * @param $onResourceLoadProgress 资源加载进度监听函数
		 * @param $onResourceLoadTarget 资源加载监听函数所属对象
		 */
		public loadGroups(groups:Array<any>, onResourceLoadComplete:Function, onResourceLoadProgress:Function, target:any):void{
			var item;
			for (var i = 0; i < groups.length; i++) {
				item = groups[i];
				this.length += RES.getGroupByName(item[0]).length;
				this.loadGroup(item[0], onResourceLoadComplete, onResourceLoadProgress, target, item[1]);
			}
		}

		private onResourceLoadComplete(event: RES.ResourceEvent): void {
			var group = this.m_pGroups[event.groupName];
			if(group){
				var loadComplete:Function = group[0];
				var loadCompleteTarget:any = group[2];
				if(loadComplete != null)
					loadComplete.call(loadCompleteTarget, event.groupName);
	
				group = null;
				delete this.m_pGroups[event.groupName];
			}

			var keys = Object.keys(this.m_pGroups);

			if(keys.length <= 0 ){
				this.destroy();
			}
		}

		private onResourceLoadError(event: RES.ResourceEvent): void {
			this.onResourceLoadComplete(event);
		}

		private onResourceProgress(event: RES.ResourceEvent): void {
			var group = this.m_pGroups[event.groupName];
			if(group){
				var loadProgress:Function = group[1];
				var loadProgressTarget:any = group[2];
				if(loadProgress != null)
					loadProgress.call(loadProgressTarget, event.itemsLoaded, event.itemsTotal);
			}
		}

		private onItemLoadError(event: RES.ResourceEvent): void {
			console.warn("Url:" + event.resItem.url + " has failed to load");
		}
	}
	
	export class ResUtils {
		public static loadConfig(url: string, resourceRoot?: string, type?: string): void{
			RES.loadConfig(url, resourceRoot, type);
		}
		
		public static loadGroups(groups:Array<any>, onResourceLoadComplete:Function, onResourceLoadProgress:Function, target:any):number{
			var loader = new ResLoader();
			loader.loadGroups(groups, onResourceLoadComplete, onResourceLoadProgress, target);

			return loader.length;
		}
	}
}