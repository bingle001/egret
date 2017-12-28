var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AGame;
(function (AGame) {
    var Observer = (function () {
        /**
         * Constructs an <code>Observer</code> instance.
         *
         * @param notifyMethod
         * 		The notification method of the interested object.
         *
         * @param notifyContext
         * 		The notification context of the interested object.
         */
        function Observer(notifyMethod, notifyContext, notifyOther) {
            /**
             * The notification method of the interested object.
             * @protected
             */
            this.notify = null;
            /**
             * The notification context of the interested object.
             * @protected
             */
            this.context = null;
            this.other = null;
            this.setNotifyMethod(notifyMethod);
            this.setNotifyContext(notifyContext);
            this.setNotifyOther(notifyOther);
        }
        /**
         * Get the notification method.
         *
         * @return
         * 		The notification (callback) method of the interested object.
         */
        Observer.prototype.getNotifyMethod = function () {
            return this.notify;
        };
        /**
         * Set the notification method.
         *
         * The notification method should take one parameter of type <code>INotification</code>.
         *
         * @param notifyMethod
         * 		The notification (callback) method of the interested object.
         */
        Observer.prototype.setNotifyMethod = function (notifyMethod) {
            this.notify = notifyMethod;
        };
        Observer.prototype.getNotifyOther = function () {
            return this.other;
        };
        Observer.prototype.setNotifyOther = function (notifyOther) {
            this.other = notifyOther;
        };
        /**
         * Get the notification context.
         *
         * @return
         * 		The notification context (<code>this</code>) of the interested object.
         */
        Observer.prototype.getNotifyContext = function () {
            return this.context;
        };
        /**
         * Set the notification context.
         *
         * @param notifyContext
         * 		The notification context (this) of the interested object.
         */
        Observer.prototype.setNotifyContext = function (notifyContext) {
            this.context = notifyContext;
        };
        /**
         * Notify the interested object.
         *
         * @param notification
         * 		The <code>INotification</code> to pass to the interested object's notification
         * 		method.
         */
        Observer.prototype.notifyObserver = function (notification) {
            var other = this.getNotifyOther();
            var taget = this.getNotifyContext();
            this.getNotifyMethod().call(taget, notification, other);
            if (other && other['_isOnly']) {
                AGame.ServiceBuilder.Instance.removeProxy(taget);
            }
        };
        /**
         * Compare an object to the notification context.
         *
         * @param object
         * 		The object to compare.
         *
         * @return
         * 		The object and the notification context are the same.
         */
        Observer.prototype.compareNotifyContext = function (object) {
            return object === this.context;
        };
        return Observer;
    }());
    AGame.Observer = Observer;
    __reflect(Observer.prototype, "AGame.Observer", ["AGame.IObserver"]);
})(AGame || (AGame = {}));
//# sourceMappingURL=Observer.js.map