module AGame {
	export class Observer implements IObserver{
		/**
		 * The notification method of the interested object.
		 * @protected
		 */
		protected notify:Function = null;

		/**
		 * The notification context of the interested object.
		 * @protected
		 */
		protected context:any = null;

		protected other:any = null;

		/**
		 * Constructs an <code>Observer</code> instance.
		 * 
		 * @param notifyMethod
		 * 		The notification method of the interested object.
		 *
		 * @param notifyContext
		 * 		The notification context of the interested object.
		 */
		public constructor( notifyMethod:Function, notifyContext:any ,notifyOther?:any)
		{
			this.setNotifyMethod( notifyMethod );
			this.setNotifyContext( notifyContext );
			this.setNotifyOther(notifyOther);
		}

		/**
		 * Get the notification method.
		 * 
		 * @return
		 * 		The notification (callback) method of the interested object.
		 */
		private getNotifyMethod():Function
		{
			return this.notify;
		}

		/**
		 * Set the notification method.
		 *
		 * The notification method should take one parameter of type <code>INotification</code>.
		 * 
		 * @param notifyMethod
		 * 		The notification (callback) method of the interested object.
		 */
		public setNotifyMethod( notifyMethod:Function ):void
		{
			this.notify = notifyMethod;
		}

		public getNotifyOther(){
			return this.other;
		}

		public setNotifyOther(notifyOther:any){
			this.other = notifyOther;
		}

		/**
		 * Get the notification context.
		 * 
		 * @return
		 * 		The notification context (<code>this</code>) of the interested object.
		 */
		private getNotifyContext():any
		{
			return this.context;
		}
			
		/**
		 * Set the notification context.
		 * 
		 * @param notifyContext
		 * 		The notification context (this) of the interested object.
		 */
		public setNotifyContext( notifyContext:any ):void
		{
			this.context = notifyContext;
		}

		/**
		 * Notify the interested object.
		 * 
		 * @param notification
		 * 		The <code>INotification</code> to pass to the interested object's notification
		 * 		method.
		 */
		public notifyObserver( notification:INotification ):void
		{
			let other = this.getNotifyOther();
			let taget = this.getNotifyContext();
			this.getNotifyMethod().call(taget, notification,other);
			if (other && other['_isOnly']){
				ServiceBuilder.Instance.removeProxy(taget);
			}
		}
	
		/**
		 * Compare an object to the notification context.
		 *
		 * @param object
		 * 		The object to compare.
		 *
		 * @return
		 * 		The object and the notification context are the same.
		 */
		 public compareNotifyContext( object:any ):boolean
		 {
		 	return object === this.context;
		 }	
	}
}