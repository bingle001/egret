module AGame {
	export class Controller implements IController{
		protected m_name:string;
		public register(){
		}

		public execute(notification: INotification){

		}

		public getView(viewName,param?){
			var clazz = egret.getDefinitionByName(viewName);
			var ca = new clazz(param);
			return ca;
		}

	}
}