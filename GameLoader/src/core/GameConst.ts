/**
 * 平台登录时的一些通用变量
 */
class GameConst {
	public static VERSION = "201708081710";	//包版本号
	public static Packaged_Version = "1.0.5";  //内容版本号

	public static asynchScripts: any[] = ['main.min.js'];
	public static serverHost:string = "http://test-lgzb-platform.allrace.com";
	public static configHost:string = "http://cdn.lgzb.yaowan.com/resource/config/";

	public static isShowLogin:boolean = true;	//是否显示登录界面
	public static DEBUG = true;
	public static RES_SERVER_CNF: string = "./resource/";
	public static isLoadFNT: boolean = false;
	public static fontFamily:string = "SimHei";

	public static IsWhite:boolean = false;
	public static loginTime:number = 0;
	public static createTime:number = 0;
	public static sign:string = '';
	public static platform:string = 'test';
	public static serverId:number = 0;//服务器Id


	public static serverIp:string = '';
	public static serverPort:number = 0;

	public static CONTENT_WIDTH = 1334;
	public static CONTENT_HEIGHT = 750;


	private static testConfigHost:string = "http://192.168.16.29:8080/loginserver/config/";

	public static getServerId(){
		return GameConst.DEBUG ? 9991 : 1;
	}

	public static getConfigServer(){
		let url = "";
		if (this.DEBUG){
			url = this.testConfigHost;
		}else{
			url = this.configHost;
		}
		return url + this.serverId;
	}

	public static isNative(): boolean {
		if (egret.RuntimeType.NATIVE == egret.Capabilities.runtimeType) {
			return true;
		}
		return false;
	}

	public static deviceType():number{
		if (this.isNative()){
			if (egret.Capabilities.os == "Android"){
				return 1;
			}else if (egret.Capabilities.os == "iOS") {
				return 2;
			}
		}
		return 0;
	}

}