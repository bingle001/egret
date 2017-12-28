var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AGame;
(function (AGame) {
    var ResLoader = (function () {
        function ResLoader() {
            this.m_pGroups = [];
            this.length = 0;
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        }
        ResLoader.prototype.destroy = function () {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            var group;
            for (var i = 0; i < this.m_pGroups.length; i++) {
                group = this.m_pGroups[i];
                group[0] = null;
                group[1] = null;
                group[2] = null;
            }
            this.m_pGroups.length = 0;
            this.length = 0;
        };
        /**
         * 加载资源组
         * @param $groupName 资源组名称
         * @param $onResourceLoadComplete 资源加载完成执行函数
         * @param $onResourceLoadProgress 资源加载进度监听函数
         * @param $onResourceLoadTarget 资源加载监听函数所属对象
         */
        ResLoader.prototype.loadGroup = function (groupName, onResourceLoadComplete, onResourceLoadProgress, target, priority) {
            this.m_pGroups[groupName] = [onResourceLoadComplete, onResourceLoadProgress, target];
            RES.loadGroup(groupName, priority);
        };
        /**
         * 同时加载多个组
         * @param $groups 自定义的组名称
         * @param $onResourceLoadComplete 资源加载完成执行函数
         * @param $onResourceLoadProgress 资源加载进度监听函数
         * @param $onResourceLoadTarget 资源加载监听函数所属对象
         */
        ResLoader.prototype.loadGroups = function (groups, onResourceLoadComplete, onResourceLoadProgress, target) {
            var item;
            for (var i = 0; i < groups.length; i++) {
                item = groups[i];
                this.length += RES.getGroupByName(item[0]).length;
                this.loadGroup(item[0], onResourceLoadComplete, onResourceLoadProgress, target, item[1]);
            }
        };
        ResLoader.prototype.onResourceLoadComplete = function (event) {
            var group = this.m_pGroups[event.groupName];
            if (group) {
                var loadComplete = group[0];
                var loadCompleteTarget = group[2];
                if (loadComplete != null)
                    loadComplete.call(loadCompleteTarget, event.groupName);
                group = null;
                delete this.m_pGroups[event.groupName];
            }
            var keys = Object.keys(this.m_pGroups);
            if (keys.length <= 0) {
                this.destroy();
            }
        };
        ResLoader.prototype.onResourceLoadError = function (event) {
            this.onResourceLoadComplete(event);
        };
        ResLoader.prototype.onResourceProgress = function (event) {
            var group = this.m_pGroups[event.groupName];
            if (group) {
                var loadProgress = group[1];
                var loadProgressTarget = group[2];
                if (loadProgress != null)
                    loadProgress.call(loadProgressTarget, event.itemsLoaded, event.itemsTotal);
            }
        };
        ResLoader.prototype.onItemLoadError = function (event) {
            console.warn("Url:" + event.resItem.url + " has failed to load");
        };
        return ResLoader;
    }());
    AGame.ResLoader = ResLoader;
    __reflect(ResLoader.prototype, "AGame.ResLoader");
    var ResUtils = (function () {
        function ResUtils() {
        }
        ResUtils.loadConfig = function (url, resourceRoot, type) {
            RES.loadConfig(url, resourceRoot, type);
        };
        ResUtils.loadGroups = function (groups, onResourceLoadComplete, onResourceLoadProgress, target) {
            var loader = new ResLoader();
            loader.loadGroups(groups, onResourceLoadComplete, onResourceLoadProgress, target);
            return loader.length;
        };
        return ResUtils;
    }());
    AGame.ResUtils = ResUtils;
    __reflect(ResUtils.prototype, "AGame.ResUtils");
})(AGame || (AGame = {}));
//# sourceMappingURL=ResUtils.js.map