module AGame {
    /**
     * 平台工具
     */
    export class PlatformUtils {

        public static userLogin(callback: Function, target: any):void{
            AGame.HttpClient.serverUrl = GameConst.serverHost + "/api/user/login";
            let params:any = {};
            params.platform =  GameConst.platform;
            params.open_id = AGame.LocalData.getOpenId();
            params.device_type =  GameConst.deviceType();
            params.version =  GameConst.VERSION;
            AGame.HttpClient.get(callback, target, params);
        }

        public static getServerList(callback: Function, target: any){
            AGame.HttpClient.serverUrl = GameConst.serverHost + "/api/server/lists";
            let params:any = {};
            params.platform =  GameConst.platform;
            params.open_id = LocalData.getOpenId();
            params.device_type =  GameConst.deviceType();
            params.version =  GameConst.VERSION;
            AGame.HttpClient.get(callback, target, params);
        }

        public static sendRoleInfo(){
            AGame.HttpClient.serverUrl = GameConst.serverHost + "/api/user/role_info";
            let roleData = egret.getDefinitionByName("RoleData");

            let params:any = {};
            params.rid =  roleData.accountId;
            params.open_id = LocalData.getOpenId();
            params.nickname = roleData.nickName;
            params.server_id = GameConst.serverId;
            params.version =  GameConst.VERSION;
            params.platform =  GameConst.platform;
            params.create_time =  GameConst.platform;
            params.device_type =  GameConst.deviceType();
            params.create_time =  GameConst.createTime;
            params.token =  GameConst.sign;
            AGame.HttpClient.get(this.callSendRolaInfo, this, params);
        }

        private static callSendRolaInfo(data:any){
            debug("callSendRolaInfo",data);
        }
    }
}