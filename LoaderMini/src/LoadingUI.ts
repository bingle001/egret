class LoadingUI extends egret.Sprite {

    public static Bg: string = "resource/loading/loading_bg.jpg";
    public static BarBg: string = "resource/loading/loading_jd_di.png";
    public static Bar: string = "resource/loading/loading_jd_2.png";

    private m_pResMap;

    public constructor(resMap) {
        super();
        this.m_pResMap = resMap;
        this.createView();
    }

    private textField: egret.TextField;
    private m_pBar: egret.Bitmap;

    private createView(): void {
        let bg = new egret.Bitmap();
        bg.texture = this.m_pResMap[LoadingUI.Bg];
        this.addChild(bg);

        this.width = bg.width;
        this.height = bg.height;

        let barBg = new egret.Bitmap();
        barBg.texture = this.m_pResMap[LoadingUI.BarBg];
        barBg.x = 175;
        barBg.y = 600;
        this.addChild(barBg);

        this.m_pBar = new egret.Bitmap();
        this.m_pBar.texture = this.m_pResMap[LoadingUI.Bar];
        this.m_pBar.x = 177;
        this.m_pBar.y = 605;
        this.addChild(this.m_pBar);

        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
    }

    public setProgress(current:number, total:number):void {
        this.textField.text = `Loading...${current}/${total}`;

        let scale: number = current / total;
        if (scale < 0) {
            scale = 0;
        }
        else if (scale > 1) {
            scale = 1;
        }
        this.m_pBar.scaleX = scale;
    }
}
