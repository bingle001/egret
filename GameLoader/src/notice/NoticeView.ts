module AGame {
    /**
     * 公告
     */
    export class NoticeView extends eui.Component {

        public Group_Content:eui.Group;
        public lbl_text:eui.Label;
        public lbl_title:eui.Label;

        public constructor() {
            super();
            this.skinName = this.getSkinXml();
        }

        public showNotice(text:string){
            this.lbl_text.text = text;
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
        }

        private getSkinXml(){
            return `<?xml version="1.0" encoding="utf-8"?>
<e:Skin class="NoticeView" width="530" height="330" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing" xmlns:ns1="*">
	<e:Group width="100%" height="100%" x="0" y="0">
		<e:Image width="100%" height="100%" x="0" y="0" scaleX="1" scaleY="1" source="kCommon_dikuang_bg_png" scale9Grid="18,18,46,34"/>
		<e:Group id="Group_Content" width="460" height="80" anchorOffsetY="0" verticalCenter="-10" anchorOffsetX="0" horizontalCenter="0">
			<e:Label id="lbl_text" text="" y="14" size="21" horizontalCenter="0" x="73" scaleX="1" scaleY="1" stroke="2" width="100%" textAlign="center" verticalAlign="middle"/>
		</e:Group>
		<e:Image source="kComon_mbhw_png" width="96%" y="19" height="28" scaleX="1" scaleY="1" x="10"/>
		<e:Image width="96%" y="7.33" x="9" source="kUpdate_mbhw_g1_png" anchorOffsetY="0" scaleX="1" scaleY="1"/>
		<e:Label id="lbl_title" text="公告" y="13.33" size="28" textAlign="center" verticalAlign="middle" height="26" horizontalCenter="4.5" anchorOffsetX="0" stroke="1.4" x="202" scaleX="1" scaleY="1" textColor="0xfbd796"/>
	</e:Group>
</e:Skin>`;
        }
    }
}