var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AGame;
(function (AGame) {
    var HttpClient = (function () {
        function HttpClient() {
        }
        HttpClient.prototype.paramsBuilder = function (data) {
            var params = [];
            if (typeof (data) == 'object') {
                var key;
                for (key in data) {
                    params.push(key + '=' + data[key]);
                }
                return params.join('&');
            }
            else if (typeof (data) == 'string') {
                return data;
            }
            return '';
        };
        HttpClient.prototype.send = function (method, callback, target, data, responseType) {
            if (responseType === void 0) { responseType = egret.HttpResponseType.TEXT; }
            this.returnFunc = callback;
            this.target = target;
            this.request = new egret.HttpRequest();
            var req = this.request;
            var params = this.paramsBuilder(data);
            var server_url = HttpClient.serverUrl;
            if (method == egret.HttpMethod.POST) {
                req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            }
            else {
                server_url += '?' + params;
                params = '';
            }
            console.log(server_url);
            req.responseType = responseType;
            req.open(server_url, method);
            req.send(data);
            req.addEventListener(egret.Event.COMPLETE, this.onGetComplete, this);
            req.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
            req.addEventListener(egret.ProgressEvent.PROGRESS, this.onGetProgress, this);
        };
        HttpClient.prototype.onGetComplete = function (event) {
            var request = event.currentTarget;
            var data = this.responseType == 'JSON' ? JSON.parse(request.response) : request.response;
            if (this.returnFunc != null) {
                this.returnFunc.call(this.target, data);
            }
            this.destory();
        };
        HttpClient.prototype.onGetIOError = function (event) {
            console.log("get error : " + event);
            this.destory();
        };
        HttpClient.prototype.onGetProgress = function (event) {
            console.log("get progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
        };
        HttpClient.prototype.destory = function () {
            var req = this.request;
            req.removeEventListener(egret.Event.COMPLETE, this.onGetComplete, this);
            req.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
            req.removeEventListener(egret.ProgressEvent.PROGRESS, this.onGetProgress, this);
            this.returnFunc = null;
            this.request = null;
        };
        HttpClient.get = function (callback, target, data, responseType) {
            if (responseType === void 0) { responseType = "JSON"; }
            var client = new HttpClient();
            client.responseType = responseType;
            client.send(egret.HttpMethod.GET, callback, target, data);
            // console.warn(data);
        };
        HttpClient.getArrayBuffer = function (callback, target, data) {
            var client = new HttpClient();
            client.responseType = egret.HttpResponseType.ARRAY_BUFFER;
            client.send(egret.HttpMethod.GET, callback, target, data, egret.HttpResponseType.ARRAY_BUFFER);
        };
        HttpClient.post = function (callback, target, data, responseType) {
            if (responseType === void 0) { responseType = "JSON"; }
            var client = new HttpClient();
            client.responseType = responseType;
            client.send(egret.HttpMethod.POST, callback, target, data);
        };
        return HttpClient;
    }());
    AGame.HttpClient = HttpClient;
    __reflect(HttpClient.prototype, "AGame.HttpClient");
})(AGame || (AGame = {}));
//# sourceMappingURL=HttpClient.js.map