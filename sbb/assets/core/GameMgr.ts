import { _decorator,sys } from 'cc';
class GameMgr {
    private static _instance: GameMgr;
    static get instance () {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new GameMgr();
        return this._instance;
    }
    public isDebugMode = true;
    public IAB_PRODUCTS = [
        {id:1,productId:'shop_chips_9.99',chips:3000000,payment:'9.99',bonus:1,flag:[]},//0
        {id:2,productId:'shop_chips_0.99',chips:210000,payment:'0.99',bonus:1,flag:[]},//1
        {id:3,productId:'shop_chips_99.99',chips:60000000,payment:'99.99',bonus:1,flag:[]},//2
        {id:4,productId:'shop_chips_49.99',chips:25000000,payment:'49.99',bonus:0,flag:[]},//3
        {id:5,productId:'shop_chips_4.99',chips:1200000,payment:'4.99',bonus:1,flag:[]}, //4
        {id:6,productId:'shop_chips_19.99',chips:12000000,payment:'19.99',bonus:1,flag:[]}//5
        
    ];
    
    //--format currency
    public isEmpty(str:string) {
        return (!str || 0 === str.length)
    }
    public validateEmail(t:string) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(t);
    }
    public checkPhoneValid(phone:string) {
        return /^[\+]?(?:[(][0-9]{1,3}[)]|(?:84|0))[0-9]{7,10}$/im.test(phone);
    }
    public nFormatter(t:number, e:number) {
        for (var i = [{
            value: 1e18,
            symbol: "E"
        }, {
            value: 1e15,
            symbol: "P"
        }, {
            value: 1e12,
            symbol: "T"
        }, {
            value: 1e9,
            symbol: "G"
        }, {
            value: 1e6,
            symbol: "M"
        }, {
            value: 1e3,
            symbol: "k"
        }], o = /\.0+$|(\.[0-9]*[1-9])0+$/, n = 0; n < i.length; n++)
            if (t >= i[n].value)
                return (t / i[n].value).toFixed(e).replace(o, "$1") + i[n].symbol;
        return t.toFixed(e).replace(o, "$1")
    }
    public numberWithCommas(n:number) {
        if (n) {
            var result = (n = parseInt(n.toString())).toString().split(".");
            return result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."),
            result.join(".")
        }
        return "0"
    }
    public getOnlyNumberInString(t) {
        var e = t.match(/\d+/g);
        return e ? e.join("") : ""
    }
    public shuffle(array: any){ 
        for (let i = array.length - 1; i > 0; i--) { 
          const j = Math.floor(Math.random() * (i + 1)); 
          [array[i], array[j]] = [array[j], array[i]]; 
        } 
        return array; 
    }
    public numberTo(obj, start, end, duration){
        clearInterval(obj.timer);
        var range = end - start;
        var minTimer = 50;
        var stepTime = Math.abs(Math.floor(duration / range));
        stepTime = Math.max(stepTime, minTimer);
        var startTime = new Date().getTime();
        var endTime = startTime + duration;
        let self = this;
        obj.timer = setInterval(function(){
            if (!!obj.node) {
                var now = new Date().getTime();
                var remaining = Math.max((endTime - now) / duration, 0);
                var value = (end - (remaining * range));
                obj.string = self.numberWithCommas(value);
                if (value == end) {
                    clearInterval(obj.timer);
                }
            }else clearInterval(obj.timer);
        }, stepTime);
    }
    
    public getRandomInt(min:number, max:number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }
        
    // public numberToTime(t:number) {
    //     t < 0 && (t = 0),
    //     t = parseInt(t);
    //     let e = parseInt(t / 60)
    //     , i = t % 60;
    //     return e < 10 && (e = "0" + e),
    //     i < 10 && (i = "0" + i),
    //     e + ":" + i
    // }
    // function numberPad(number, length) {
    //     let str = '' + number;
    //     while(str.length < length)
    //         str = '0' + str;
    //     return str;
    // }
    
    // function inputNumber(obj){
    //     var onShift = false
    //     obj.addEventListener('keydown', function(e){if (e.keyCode === 16) {e.preventDefault();onShift = true;}});
    //     obj.addEventListener('keyup',   function(e){if (e.keyCode === 16) {e.preventDefault();onShift = false;}});
    //     obj.addEventListener('keydown', function(e){
    //         if (!onShift && ((e.keyCode >= 48 && e.keyCode <= 57)  ||
    //             (e.keyCode >= 96 && e.keyCode <= 105) ||
    //             (e.keyCode >= 37 && e.keyCode <= 40) ||
    //             e.keyCode === 107 ||
    //             e.keyCode === 109 ||
    //             e.keyCode === 189 ||
    //             e.keyCode === 8 ||
    //             e.keyCode === 13)) {
    //         } else {
    //             e.preventDefault();
    //         }
    //     });
    // }
    // function numberTo(obj, start, end, duration, currency = false){
    //     clearInterval(obj.timer);
    //     var range = end - start;
    //     var minTimer = 50;
    //     var stepTime = Math.abs(Math.floor(duration / range));
    //     stepTime = Math.max(stepTime, minTimer);
    //     var startTime = new Date().getTime();
    //     var endTime = startTime + duration;
    
    //     obj.timer = setInterval(function(){
    //         if (!!obj.node) {
    //             var now = new Date().getTime();
    //             var remaining = Math.max((endTime - now) / duration, 0);
    //             var value = (end - (remaining * range))>>0;
    //             obj.string = currency ? numberWithCommas(value) : value;
    //             if (value == end) {
    //                 clearInterval(obj.timer);
    //             }
    //         }else clearInterval(obj.timer);
    //     }, stepTime);
    // }
    // function getStringDateByTime(t) {
    //     var e = new Date(t)
    //       , i = e.getHours()
    //       , o = e.getMinutes()
    //       , n = e.getDate()
    //       , s = e.getMonth() + 1;
    //     return i < 10 && (i = "0" + i),
    //     o < 10 && (o = "0" + o),
    //     n < 10 && (n = "0" + n),
    //     s < 10 && (s = "0" + s),
    //     i + ":" + o + " " + n + "/" + s + "/" + e.getFullYear()
    // }
    // function getDateByTime(t) {
    //     var e = new Date(t);
    //     return e.getDate() + "/" + (e.getMonth() + 1) + "/" + e.getFullYear()
    // }
    // function getStringHourByTime(t) {
    //     var e = new Date(t)
    //       , i = e.getHours()
    //       , o = e.getMinutes()
    //       , n = e.getSeconds();
    //     return i < 10 && (i = "0" + i),
    //     o < 10 && (o = "0" + o),
    //     n < 10 && (n = "0" + n),
    //     i + ":" + o + ":" + n
    // }
    
    // function anPhanTram(bet, so_nhan, ti_le, type = false){
    //     // so_nhan: số nhân
    //     // ti_le: tỉ lệ thuế
    //     // type: Thuế tổng, thuế gốc
    //     var vV = bet*so_nhan;
    //     var vT = !!type ? v1 : bet;
    //     return vV-Math.ceil(vT*ti_le/100);
    // }
    
    // function addZero10(i) {
    //     if (i < 10) {
    //         i = "0" + i;
    //     }
    //     return i;
    // }
    private readonly FRUIT_TUTORIAL = "FRUIT_TUTORIAL";
    private readonly FRUIT_LEVEL = "SAVE_FRUIT_LEVEL";
    saveFruitTutorial(val:number){
        sys.localStorage.setItem(this.FRUIT_TUTORIAL,`${val}`);
    }
    readFruitTutorial(){
        let val = sys.localStorage.getItem(this.FRUIT_TUTORIAL);
        if(val!=null){
            let isDone = parseInt(val);
            return isDone==1?true:false;
        }
        return false;
    }
    saveFruitLevel(val:number){
        sys.localStorage.setItem(this.FRUIT_LEVEL,`${val}`);
    }
    readFruitLevel(){
        let val = sys.localStorage.getItem(this.FRUIT_LEVEL);
        if(val!=null){
            return parseInt(val);
        }
        return 0;
    }
}

export default GameMgr;