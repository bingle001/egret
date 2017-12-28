/**
 * Created by yaowan on 2016/11/29.
 */

enum LoadingEnum {
    ResConfig = 1, //资源配置
    Proto = 2, //协议文件
    Code = 3, //代码文件
    Theme = 4, //加载皮肤
    Resource = 5, //记载资源
    UserLogin = 6, //用户登录
};


module AGame {
    export class LoadControl {
        private m_pLoadView: LoadingUI;
        private m_pMain: Client;
        private m_pLoadCfg;
        private m_iStartTime;
        private static IS_LOADING: boolean;
        private m_bIsGameCodeStartUp:boolean = false;

        public constructor(main) {
            this.m_pMain = main;
            this.m_iStartTime = new Date().getTime();
            LoadControl.IS_LOADING = true;
            this.initGameStartConf();
        }

        private initGameStartConf(){
            this.m_pLoadCfg = [];
            this.m_pLoadCfg[LoadingEnum.ResConfig] = 0;
            this.m_pLoadCfg[LoadingEnum.Proto] = 0;
            this.m_pLoadCfg[LoadingEnum.Code] = 0;
            this.m_pLoadCfg[LoadingEnum.Theme] = 0;
            this.m_pLoadCfg[LoadingEnum.Resource] = 0;
            this.m_pLoadCfg[LoadingEnum.UserLogin] = 0;
        }

        /**
         * 加载游戏
         */
        public createLoginView() {
            //设置加载进度界面
            this.m_pLoadView = new LoadingUI(this);
            this.m_pLoadView.viewWidth = this.m_pMain.stage.stageWidth;
            this.m_pLoadView.width = this.m_pMain.stage.stageWidth;
            this.m_pMain.addChild(this.m_pLoadView);
            this.m_pLoadView.showView();
            // this.loadResource();
        }


        public setComplete(type) {
            if (!this.m_pLoadCfg) {
                return;
            }
            this.m_pLoadCfg[type] = 1;
            debug("setComplete",type,LoadingEnum[type]);
            debug("耗时:" + type + ":" + (new Date().getTime() - this.m_iStartTime));

            if (type == LoadingEnum.Proto && !GameConst.isShowLogin){
                this.userLogin();
            }

            if (!this.m_bIsGameCodeStartUp){
                if (this.m_pLoadCfg[LoadingEnum.UserLogin] && this.m_pLoadCfg[LoadingEnum.Code] && this.m_pLoadCfg[LoadingEnum.Proto] && this.m_pLoadCfg[LoadingEnum.Theme]){
                    this.m_bIsGameCodeStartUp = true;
                    this.onGameCodeStartUp();
                    this.doLoadResource();
                }
            }

            let flag = true;
            for (let i in this.m_pLoadCfg) {
                if (this.m_pLoadCfg[i] == 0) {
                    flag = false;
                }
            }

            flag && this.doEnterGame();
        }

        public userLogin(){
            PlatformUtils.userLogin(this.onCallUserInfo,this);
        }

        private onCallUserInfo(data: any){
            debug("onCallUserInfo",data)
            if (data.code == 0){
                GameConst.sign = data.token;
                GameConst.serverId = data.servers.last_login_sid == 0 ? data.servers.rate_sid : data.servers.last_login_sid;
                let rate_sid = data.servers.rate_sid;
                let rate_info = null;
                GameConst.IsWhite = data.servers.is_white == 1;
                let isHaveLast = false;
                for (let i = 0; i < data.servers.server_list.length;i++){
                    let sInfo = data.servers.server_list[i];
                    if (sInfo.id == GameConst.serverId){
                        isHaveLast = true;
                        GameConst.serverIp = sInfo.host;
                        GameConst.serverPort = sInfo.port;
                        if (this.checkServerIsUpdate(sInfo)){
                            return;
                        }
                    }else if (sInfo.id == rate_sid){
                        rate_info = sInfo;
                    }
                }

                if (!isHaveLast){
                    GameConst.serverId = rate_info.id;
                    GameConst.serverIp = rate_info.host;
                    GameConst.serverPort = rate_info.port;
                }
                this.doSelectServer();
            }else{
                debug("登录失败");
            }
        }

        private doSelectServer(){
            let localId = LocalData.getServerId();
            if (GameConst.serverId != localId){
                PlatformUtils.getServerList(this.onCallServerList,this);
            }else{
                this.setComplete(LoadingEnum.UserLogin)
            }
        }

        private onCallServerList(data: any){
            debug("onCallServerList",data)
            let localId = Number(LocalData.getServerId());
            let lastId = GameConst.serverId;
            let localServer;
            let lastServer;
            for (let i = 0 ; i < data.server_list.length;i++){
                let info = data.server_list[i];
                if (info.id == localId){
                    localServer = info;
                }else if (info.id == lastId){
                    lastServer = info;
                }
            }
            let serverInfo = localServer || lastServer;
            GameConst.serverId = serverInfo.id;
            GameConst.serverIp = serverInfo.host;
            GameConst.serverPort = serverInfo.port;
            LocalData.setServerId(GameConst.serverId);
            if (this.checkServerIsUpdate(serverInfo)){
                return;
            }
            this.setComplete(LoadingEnum.UserLogin)
        }

        public checkServerIsUpdate(serverInfo){
            if (serverInfo.is_update != 0){
                let noticeView = new NoticeView();
                noticeView.showNotice(serverInfo.is_update_msg);
                noticeView.x = this.m_pMain.width / 2 ;
                noticeView.y = this.m_pMain.height / 2;
                this.m_pMain.addChild(noticeView);
                return true;
            }
            return false;
        }

        private onGameCodeStartUp(){
            let ent = AGame['GameMain'];
            ent['startup'](this.m_pMain);
        }

        private doEnterGame(){
            let ent = AGame['GameMain'];
            // ent['onResComplete'](this.m_pMain);
            ent['onResComplete']();
        }

        /**
         * 加载资源
         */
        public doLoadResource() {
            var delayedList = [
                ['common', 0],
                ['main', 1],
                // ['map', 1],
                ['map_base', 1],
                ['json', 1],
                // ['hive_map', 1],
            ];
            AGame.ResUtils.loadGroups(delayedList, this.onResourceLoadComplete, this.onResourceLoadProgress, this);
        }

        private onResourceLoadComplete(groupName: any): void {
            if (groupName == 'common') {
                this.setComplete(LoadingEnum.Resource);
            }
        }

        private onResourceLoadProgress(itemsLoaded, itemsTotal): void {
            // debug("onResourceLoadProgress:",itemsLoaded, itemsTotal);
        }

        public clearAll() {
            LoadControl.IS_LOADING = false;
            if (this.m_pLoadView) {
                this.m_pLoadView.onDestroy();
                this.m_pLoadView = null;
            }
            this.m_bIsGameCodeStartUp = false;
            this.m_pMain = null;
            this.m_pLoadCfg = [];
            this.m_pLoadCfg = null;
        }
    }
}