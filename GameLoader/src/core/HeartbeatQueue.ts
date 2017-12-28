module AGame {

    export class ATimerEvent {
        private m_pDelay:number = 0;
        private m_pTargert:any;
        private m_pTimerComFunc:Function = null;
        private m_pSendDelay:number = 0;
        public name:string;

        public constructor() {
        }

        public timer(delay:number):void{
            this.m_pSendDelay += delay;
            if(this.m_pSendDelay >= this.m_pDelay){
                this.m_pSendDelay -= this.m_pDelay;
                if(this.m_pTimerComFunc) this.m_pTimerComFunc.call(this.m_pTargert);
            }
        }

        public static create(delay: number = 300,timerComFunc?: Function,targert?: any): ATimerEvent{
            let timer: ATimerEvent = new ATimerEvent();
            timer.m_pDelay = delay;
            timer.m_pTimerComFunc = timerComFunc;
            timer.m_pTargert = targert;
            return timer;
        }
    }


    /**
     * 调用心跳包频率倍数的定时器
     */
    export class HeartbeatQueue {
        public static m_pQueue:ATimerEvent[] = [];


        public static timer(delay: number): void {
            // console.log("TimerQueue:timer:",this.m_pQueue.length);
            for(let i: number = 0;i < this.m_pQueue.length; i++){
                let event: ATimerEvent = this.m_pQueue[i];
                event.timer(delay);
            }
        }

        public static clear():void{
            this.m_pQueue = [];
        }

        public static isExistKey(name){
            for (let i = 0 ; i < this.m_pQueue.length;i++){
                let time_event =<ATimerEvent> this.m_pQueue[i];
                if (time_event.name == name){
                    return true;
                }
            }
            return false;
        }

        public static removeTimerEventByName(name){
            for (let i = 0 ; i < this.m_pQueue.length;i++){
                let time_event =<ATimerEvent> this.m_pQueue[i];
                if (time_event.name == name){
                    this.m_pQueue.splice(i, 1);
                    break;
                }
            }
        }

        public static create(delay,timerComFunc?: Function,targert?: any,name?:string){
            let time_event = ATimerEvent.create(delay,timerComFunc,targert);
            time_event.name = name;
            this.m_pQueue.push(time_event);
        }
    }
}