module AGame {
    /**
     * 与native的交互
     */
    export class NativeHelper {

        public static isNative(): boolean {
            if (egret.RuntimeType.NATIVE == egret.Capabilities.runtimeType) {
                return true;
            }
            return false;
        }

        public static initExternalInterface() {
            // TypeScript 代码
            egret.ExternalInterface.addCallback("setAppOptions", function (message: string) {
                egret.log("message form native setAppOptions: " + message);//message form native : message from native
                NativeHelper.parseAppOptions(message);
            });

            this.sendCodeInit();
        }

        private static parseAppOptions(json: string) {
            let options = JSON.parse(json);
            GameConst.VERSION = options.version;
            GameConst.DEBUG = options.debug ? true : false;
        }

        private static sendCodeInit() {
            egret.ExternalInterface.call("codeInit", "");
        }

        public static sendEnterGame(str: string) {
            egret.ExternalInterface.call("enterGame", str);
        }



    }
}