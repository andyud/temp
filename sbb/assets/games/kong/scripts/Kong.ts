import { _decorator, AudioClip, Button, Component, director, Animation, instantiate, Label, Node, Prefab, SpriteFrame, Tween, UIOpacity, UITransform, tween, EditBox, Mask, Color,sp } from 'cc';
import { GameEvent } from '../../../core/GameEvent';
import APIMgr from '../../../core/APIMgr';
import { Loading } from '../../../prefabs/loading/Loading';
import { AudioMgr } from '../../../core/AudioMgr';
import GameMgr from '../../../core/GameMgr';
import { KongReel } from './KongReel';
import { Notice } from '../../../prefabs/popups/scripts/Notice';
import { KongSpinBtn } from './KongSpinBtn';
import { KongItem } from './KongItem';
import { KongBonusItem } from './KongBonusItem';
import { KongCoinEff } from './KongCoinEff';
import { LobbyOption } from '../../../lobby/scripts/LobbyOption';
const { ccclass, property } = _decorator;
declare var io: any;

@ccclass('Kong')
export class Kong extends Component {
    @property({ type: Prefab })
    pfLoading: Prefab | null = null;
    private smallLoading: Node = null;
    @property({ type: Prefab })
    pfShop: Prefab | null = null;
    private shop: Node = null;
    @property({ type: Prefab })
    pfNotice: Prefab | null = null;
    private notice: Node = null;
    @property({ type: Node })
    jackpotNode: Node | null = null;
    @property({type:sp.Skeleton})
    skeJackpot:sp.Skeleton | null = null;
    @property({ type: Label })
    lbJackpotWinCoin: Label | null = null;
    @property({ type: Node })
    btnCloseJackpot: Node | null = null;

    @property({ type: Node })
    bonusResNode: Node | null = null;
    @property({type:sp.Skeleton})
    skeBonusRes:sp.Skeleton | null = null;
    @property({ type: Node })
    bonusPlayNode: Node | null = null;
    @property({ type: Node })
    btnCloseBonusRes: Node | null = null;
    @property({ type: Label })
    lbBonusWinCoin: Label | null = null;

    @property({ type: Node })
    freeSpinNode: Node | null = null;
    @property({type:sp.Skeleton})
    skeFreeSpin: sp.Skeleton | null = null;
    @property({type:sp.Skeleton})
    skeFreeSpinRes: sp.Skeleton | null = null;

    @property({ type: Node })
    btnCloseFreeSpin: Node | null = null;
    @property({ type: Label })
    lbFreeSpinEff: Label | null = null;
    @property({ type: Label })
    lbFreeSpinCount: Label | null = null;
    //--freespin res
    @property({ type: Node })
    freeSpinResNode: Node | null = null;
    @property({ type: Label })
    lbFreeSpinWon: Label | null = null;
    @property({ type: Node })
    btnCloseFreeSpinRes: Node | null = null;

    @property({ type: Node })
    bigWinNode: Node | null = null;
    @property({type:sp.Skeleton})
    skeBigWin: sp.Skeleton | null = null;
    @property({ type: Node })
    btnCloseBigWin: Node | null = null;
    @property({ type: Label })
    lbBigWinCoin: Label | null = null;

    @property({ type: Node })
    btnMission: Node | null = null;
    @property({ type: Node })
    btnBetMinus: Node | null = null;
    @property({ type: Node })
    btnBetPlus: Node | null = null;
    @property({ type: Label })
    lbTotalBet: Label | null = null;
    @property({ type: Label })
    lbWin: Label | null = null;
    @property({ type: Node })
    btnMaxBet: Node | null = null;
    @property({ type: Node })
    btnSpin: Node | null = null;
    @property({ type: Node })
    btnAutoSpin: Node | null = null;
    @property({ type: Node })
    btnFreeSpin: Node | null = null;
    //--bonus
    @property({ type: Node })
    bonusInfoNode: Node | null = null;
    @property({ type: Node })
    lbBonusInfo: Node | null = null;
    @property({type:sp.Skeleton})
    skeBonusStart:sp.Skeleton | null = null;
    @property({ type: Node })
    btnBonusInfo: Node | null = null;
    @property({ type: Label })
    lbBonusRemain: Label | null = null;
    @property({ type: Label })
    lbBonusReward: Label | null = null;
    @property([Node])
    arrPlayBonusItem: Node[] = []
    @property([Node])
    arrWildLong: Node[] = []
    private countBonusRemain = 0;
    private totalBonusWin = 0;

    //--top
    @property({ type: Node })
    btnBack: Node | null = null;
    private isBackPressed = false;
    @property({ type: Label })
    lbBalance: Label | null = null;
    @property({ type: Node })
    btnShop: Node | null = null;

    @property({ type: Label })
    lbLevel: Label | null = null;
    @property({ type: Node })
    levelProgress: Node | null = null;
    @property({ type: Node })
    btnMenu: Node | null = null;

    @property([Node])
    reels: Node[] = []
    @property({ type: Mask })
    reelMask: Mask | null = null;
    @property([Prefab])
    items: Prefab[] = [];
    @property([SpriteFrame])
    icons: SpriteFrame[] = []
    @property([Node])
    lines: Node[] = [];
    lineEffects = [];
    lineEffectsIdx = -1;
    @property({ type: Node })
    lbCoinEff: Node | null = null;

    @property([AudioClip])
    arrAudioClips: AudioClip[] = [];
    @property({ type: Prefab })
    pfCointEff: Prefab | null = null;
    @property({ type: Node })
    cointPos1: Node | null = null;
    @property({ type: Node })
    cointPos2: Node | null = null;
    @property({ type: Node })
    arrTensionEff: Node | null = null;

    //--debug
    @property({ type: Node })
    btnDbBigWin: Node | null = null;
    @property({ type: Node })
    btnDbBonus: Node | null = null;
    @property({ type: Node })
    btnDbFreeSpin: Node | null = null;
    @property({ type: Node })
    btnDbJackpot: Node | null = null;
    @property({ type: Node })
    btnRunDebugData: Node | null = null;
    @property({ type: Node })
    edDebugData: Node | null = null;
    @property({ type: Node })
    debugNode: Node | null = null;

    private readonly gameName = 'WildKong';
    private webSocket: WebSocket | null = null;
    private isAutoSpin = false;
    private isSpin = false;//void press spin more time
    private isFreeSpin = false;
    private iTotalWinFreeSpin = 0;

    //--update
    private countUpdate = 0;
    private isUpdateLineWin = false;
    @property({ type: Node })
    loading: Node | null = null;
    @property({ type: Node })
    loadingBar: Node | null = null;
    private percent = 0;

    //--option
    @property({type:Node})
    ppOption:Node | null = null;

    private loginRes = {
        "pid": "loginRes",
        "betOptions": [100],
        "maxBetLevel": 0,
        "balance": 1000222,
        "mission": [],
        "lineBet": 100,//The bet that the user currently choosesm
        "jackpotPool": [],
        "extendData": {},
        "restoreData": {
            "freeSpinData": [],
            "bank": []
        },
        "reelInfo": {
            "normal": [
                [
                    "5,9,0,10,6,7,8,2,4,10,5,7,9,10,6,2,7,9,10,7,2,0,6,7,2,7,2,6,8,7,10,10,11",
                    "5,1,9,2,10,6,4,10,5,0,2,10,6,2,10,8,0,2,10,6,2,10,11",
                    "10,1,2,5,8,9,2,10,10,0,7,5,10,8,7,10,2,0,7,10,4,2,7,2,7,10,8,7,5,11",
                    "10,1,2,5,8,4,10,10,6,2,8,10,0,10,2,10,6,7,5,10,0,2,9,6,5,11",
                    "7,1,9,7,2,9,10,4,8,5,2,7,5,10,0,8,6,0,10,7,5,9,10,10,11"
                ],
            ],
            "freeSpin": [
                [
                    "6,8,9,10,6,10,7,10,2,8,10,5,7,9,10,6,10,2,7,10,9,10,7,6",
                    "10,10,9,2,10,6,10,5,10,2,10,6,10,8,2,10,5,10,6,2,7,10",
                    "10,9,10,6,8,5,8,10,5,10,2,6,7,10,5,6,5,9",
                    "10,2,6,8,5,5,10,6,2,6,8,10,5,2,10,6,7,10,7,9",
                    "5,10,8,6,10,9,7,2,9,10,8,5,10,7,9,8,10"
                ],
            ]
        },
        "level": {
            "level": 1,
            "exp": 0,
            "maxExp": 20000,
            "nextReward": 0
        },
        "stack": [],
        "reelLevel": 0
    };
    private spinRes = {
        "winType": "",
        "linebet": 100,
        "prevBalance": 997722,
        "totalWinBalance": 0,
        "bonusPayout": [
            {
                "balance": 100,
                "bonusType": 'bonus',
                "extendData": [50, 10, 60],
                "matchCount": 3,
                "symbolName": 'bonus'
            }
        ],
        "pick": {},
        "reelList": [8, 15, 29, 8, 16],
        "mission": [],
        "level": {
            "level": 1,
            "isLevelUp": false,
            "exp": 5000,
            "maxExp": 20000,
            "balance": 0,
            "nextReward": 0
        },
        "balance": 995722,
        "spinType": "spin",
        "jackpotPool": [7500050],
        "reelWindow": [
            [
                "K",
                "coin",
                "J"
            ],
            [
                "J",
                "A",
                "Scatter"
            ],
            [
                "hoof",
                "Jackpot",
                "J"
            ],
            [
                "J",
                "pistol",
                "K"
            ],
            [
                "A",
                "pistol",
                "Scatter"
            ]
        ],
        "lineKeys": [ //index of item
            [2, 4, 10],
            [10, 8, 0],
            [5, 11, 10],
            [10, 6, 2],
            [8, 6, 0]
        ],
        "reelLevel": 0,
        "bank": [0, 0],
        "freeSpin": {
            "count": 0,
            "start": false,
            "remain": 0,
            "play": false,
            "nextSpinType": "spin",
            "wins": 0,
            "resepin": { "total": 0, "remain": 0 }
        },
        "payoutList": [
            {
                "winSymbol": "J",
                "pay": 500,
                "lineNum": 24,
                "matchCount": 4,
                "symbolType": 0,
                "multiple": 1,
                "dividend": 5,
                "winPosition": [2, 3, 8, 9]
            }
        ],
        "scatterList": {
            "Scatter": [5, 14]
        },
        "bonusList": {
            "coin": [1],
            "Scatter": [5, 14]
        },
        "lockedPosition": {},
        "nextJackpotPool": [],
        "pid": "spinRes"
    };
    private errorMessage = { "message": "Spin Transaction - not Login:", "code": 1, "data": "{}", "currentPid": "spin" };
    private serverMatrix = [
        [0, 3, 6, 9, 12],
        [1, 4, 7, 10, 13],
        [2, 5, 8, 11, 14]
        //reel  0, 1, 2,  3, 4
        //2x1,0x2
    ]
    private lineMatrix = [
        [1, 1, 1, 1, 1],//0
        [2, 2, 2, 2, 2],//1
        [0, 0, 0, 0, 0],//2
        [2, 1, 0, 1, 2],//3
        [0, 1, 2, 1, 0],//4
        [1, 0, 0, 0, 1],//5
        [1, 2, 2, 2, 1],//6
        [2, 2, 1, 0, 0],//7
        [0, 0, 1, 2, 2],//8
        [0, 1, 1, 1, 2],//9
        [2, 1, 1, 1, 0],//10
        [1, 0, 1, 2, 1],//11   
        [1, 2, 1, 0, 1],//12
        [2, 1, 2, 1, 2],//13
        [0, 1, 0, 1, 0],//14
        [1, 1, 2, 1, 1],//15
        [1, 1, 0, 1, 1],//16
        [2, 0, 2, 0, 2],//17
        [0, 2, 0, 2, 0],//18
        [0, 2, 1, 2, 0]//19
    ];
    private totalLines = this.lineMatrix.length;
    private ICON_MAPPING = {
        ship:0,
        dragon:1,
        scatter:2,
        j:3,
        air:4,
        q:5,
        a:6,
        k:7,
        coin:8,
        jackpot:9,
        wild:10
    }
    //----------------------------------------------------------------------------------------------------
    private kongConfig = {
        reelsSpeed: 0.015,//per symbol
        showResultDelay: 2500,
        showResultNotDelay: 500,
    }
    private lastTimeUpdate = new Date().getTime();
    //1. init ---------------------------------------------------------------------------------------------
    start() {
        if (GameMgr.instance.isDebugMode) {
            this.debugNode.active = true;
        } else {
            this.debugNode.active = false;
        }
        this.webSocket = null;
        APIMgr.instance.setCurrentGame(this.gameName);
        GameEvent.AddEventListener('START_CONNECT', (data: any) => {
            if (this.gameName === APIMgr.instance.currentGame.gameName) {
                this.lbBalance.string = GameMgr.instance.numberWithCommas(APIMgr.instance.signinRes.balance);
                this.lbLevel.string = `lv: ${APIMgr.instance.signinRes.level}`;
                this.lbTotalBet.string = GameMgr.instance.numberWithCommas(this.loginRes.lineBet * this.totalLines);
                this.lbWin.string = '0';
                this.connect(data.url);
            }
        })
        //loading
        if (this.loading != null) {
            this.percent = 0;
            this.loading.active = true;
        }
        if (this.notice == null) {
            this.notice = instantiate(this.pfNotice);
            this.node.addChild(this.notice);
            this.notice.getComponent(UITransform).setContentSize(this.node.getComponent(UITransform).width, this.node.getComponent(UITransform).height);
            this.notice.getComponent(Notice).hide();
        }
        if (this.smallLoading==null){
            this.smallLoading = instantiate(this.pfLoading);
            this.node.addChild(this.smallLoading);
            this.smallLoading.getComponent(UITransform).setContentSize(this.node.getComponent(UITransform).width, this.node.getComponent(UITransform).height);
            this.smallLoading.getComponent(Loading).hide();
        }
        if (this.shop == null) {
            this.shop = instantiate(this.pfShop);
            this.node.addChild(this.shop);
            this.shop.setPosition(0, 0);
            this.shop.active = false;
        }
        //button
        this.btnCloseJackpot.on(Button.EventType.CLICK, this.onCloseEnd, this);
        this.jackpotNode.active = false;
        this.btnCloseBonusRes.on(Button.EventType.CLICK, this.onCloseEnd, this);
        this.bonusResNode.active = false;
        this.bonusPlayNode.active = false;
        this.btnBonusInfo.on(Button.EventType.CLICK, this.onClick, this);
        this.bonusInfoNode.active = false;

        this.btnCloseFreeSpin.on(Button.EventType.CLICK, this.onCloseEnd, this);
        this.freeSpinNode.active = false;
        this.btnCloseFreeSpin.active = false;
        this.btnCloseBigWin.on(Button.EventType.CLICK, this.onCloseEnd, this);
        this.bigWinNode.active = false;
        this.btnCloseFreeSpinRes.on(Button.EventType.CLICK, this.onCloseEnd, this);
        this.freeSpinResNode.active = false;

        //--
        this.btnBack.on(Button.EventType.CLICK, this.onClick, this);
        this.btnBetMinus.on(Button.EventType.CLICK, this.onClick, this);
        this.btnBetPlus.on(Button.EventType.CLICK, this.onClick, this);
        this.btnMaxBet.on(Button.EventType.CLICK, this.onClick, this);
        this.btnSpin.on(Button.EventType.CLICK, this.onClick, this);
        this.btnFreeSpin.on(Button.EventType.CLICK, this.onClick, this);
        this.btnSpin.getComponent(KongSpinBtn).init((val) => {
            if (val == 0) {
            } else if (val == 1) {
                if (!this.isAutoSpin) {
                    this.spin(false, []);
                }
            } else if (val == 2) {
                if (!this.isAutoSpin) {
                    this.setAutoSpin(true);
                    this.preSpin();
                }
            }
        });
        this.btnAutoSpin.on(Button.EventType.CLICK, this.onCloseEnd, this);
        //--debug
        this.btnDbBigWin.on(Button.EventType.CLICK, this.onClick, this);
        this.btnDbBonus.on(Button.EventType.CLICK, this.onClick, this);
        this.btnDbFreeSpin.on(Button.EventType.CLICK, this.onClick, this);
        this.btnDbJackpot.on(Button.EventType.CLICK, this.onClick, this);
        this.btnRunDebugData.on(Button.EventType.CLICK, this.onClick, this);
        this.btnShop.on(Button.EventType.CLICK, this.onClick, this);
        this.btnMenu.on(Button.EventType.CLICK, this.onClick, this);

        //--set temp reels
        let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        arr = GameMgr.instance.shuffle(arr);
        for (let i = 0; i < this.reels.length; i++) {
            arr = GameMgr.instance.shuffle(arr);
            this.reels[i].getComponent(KongReel).init(arr, this.items);
            this.reels[i].getComponent(KongReel).setReelCallback(this.endSpin.bind(this));
        }
        //--bonus
        for (let i = 0; i < this.arrPlayBonusItem.length; i++) {
            this.arrPlayBonusItem[i].getComponent(KongBonusItem).init((idx: number) => {
                if (this.countBonusRemain <= 0) return;
                AudioMgr.inst.playOneShot(this.arrAudioClips[24]);
                //count to end
                let val = this.spinRes.bonusPayout[0].extendData[this.spinRes.bonusPayout[0].matchCount - this.countBonusRemain];
                this.countBonusRemain--;
		        this.lbBonusRemain.string = `${this.countBonusRemain}`;

                let currVal = 0;
                if(val.toString().indexOf('x')>=0){
                    let multiply = val.toString().replace('x','');
                    currVal = this.totalBonusWin*parseInt(multiply) - this.totalBonusWin;
                    this.totalBonusWin = this.totalBonusWin * parseInt(multiply);
                    this.arrPlayBonusItem[idx].getComponent(KongBonusItem).setValue2(`x${multiply}`,'#77FF42');
                } else {
                    currVal = val * this.loginRes.lineBet;
                    this.arrPlayBonusItem[idx].getComponent(KongBonusItem).setValue(currVal, '+','#77FF42');
                    this.totalBonusWin += currVal;
                }
                GameMgr.instance.numberTo(this.lbBonusReward, this.totalBonusWin - currVal, this.totalBonusWin, 500);
                if (this.countBonusRemain == 0) { //--disable touch
                    for (let k = 0; k < this.arrPlayBonusItem.length; k++) {
                        this.arrPlayBonusItem[k].getComponent(KongBonusItem).setTouchEnable(false);
                    }
                }

                if (this.countBonusRemain > 0) {
                    for (let k = 0; k < this.arrPlayBonusItem.length; k++) {
                        this.arrPlayBonusItem[k].getComponent(KongBonusItem).setTouchEnable(true);
                    }
                } else if (this.countBonusRemain == 0) {
                    const timeout1 = setTimeout(() => {
                        clearTimeout(timeout1);
                        //open all remain bonus
                        let arrTemp = [1,10,20,30,50,100,500,'x1','x2','x3'];
                        if(this.spinRes.bonusPayout[0].matchCount==4){
                            arrTemp = [1,10,20,30,50,100,500,'x2','x3','x4'];
                        } else if(this.spinRes.bonusPayout[0].matchCount==5){
                            arrTemp = [1,10,20,30,50,100,500,'x3','x4','x5'];
                        }
                        arrTemp = GameMgr.instance.shuffle(arrTemp);
                        for (let ii = 0; ii < this.arrPlayBonusItem.length; ii++) {
                            let bonusItem = this.arrPlayBonusItem[ii].getComponent(KongBonusItem)
                            if (bonusItem.lb.node.active) {
                                continue;
                            }
                            if(arrTemp[ii].toString().indexOf('x')>=0){
                                this.arrPlayBonusItem[ii].getComponent(KongBonusItem).setValue2(arrTemp[ii].toString(),'#ffffff');
                            } else {
                                let currVal2 = parseInt(arrTemp[ii].toString()) * this.loginRes.lineBet;
                                this.arrPlayBonusItem[ii].getComponent(KongBonusItem).setValue(currVal2,'','#ffffff');
                            }
                        }
                        const timeout13 = setTimeout(() => {
                            clearTimeout(timeout13);
                            this.countBonusRemain = -1;
                            this.bonusPlayNode.active = false;
                            this.bonusResNode.active = true;
                            this.skeBonusRes.setAnimation(0,'start',false);
                            GameMgr.instance.numberTo(this.lbBonusWinCoin, 0, this.spinRes.bonusPayout[0].balance, 2000);
                            AudioMgr.inst.bgmBonus.stop();
                            AudioMgr.inst.playOneShot(this.arrAudioClips[17]);
                            let timeout12 = setTimeout(() => {
                                clearTimeout(timeout12);
                                AudioMgr.inst.playOneShot(this.arrAudioClips[26]);
                                this.skeBonusRes.setAnimation(0,'idle',false);
                            }, 2000)
                        }, 3000)
                    }, 500);//delay 1.5s
                }
            }, i);
        }
        //--init sound
        // AudioMgr.inst.setAudioSouce('spin', this.arrAudioClips[21]);
        AudioMgr.inst.setAudioSouce('freespin', this.arrAudioClips[23]);
        AudioMgr.inst.setAudioSouce('bonus', this.arrAudioClips[22]);
        AudioMgr.inst.setAudioSouce('coin', this.arrAudioClips[2]);
        AudioMgr.inst.setAudioSouce('tension', this.arrAudioClips[3]);

        //--get jackpot pool
        GameEvent.AddEventListener("updatebalance", (balance: number) => {
            GameMgr.instance.numberTo(this.lbBalance, 0, balance, 1000);
        });

        //--menu option
        this.ppOption.getComponent(LobbyOption).init(this.arrAudioClips[1]);
    }
    setMaskEnable(isEnable: boolean) {
        this.reelMask.enabled = isEnable;
        for (let i = 0; i < this.reels.length; i++) {
            let reel = this.reels[i];
            let len = reel.children.length;
            for (let j = len-4; j >=0; j--) {
                reel.children[j].getComponent(UIOpacity).opacity = isEnable ? 255 : 1;
            }
        }
    }
    //2. network -------------------------------------------------------------------------------------------
    private disconnect() {
        let wsk = this.webSocket;
        if (wsk) {
            wsk.onopen = null;
            wsk.onmessage = null;
            wsk.onerror = null;
            wsk.onclose = null;
            wsk.close();
        }
    }
    private connect(url: string) {
        const self = this;
        // this.webSocket = new WebSocket(`wss://slotk0w9ukeg.777invegas.com:8202`);
        this.webSocket = new WebSocket(`ws${url.replace('http', '')}`);
        // this.webSocket.binaryType = 'blob';
        this.webSocket.onopen = function (evt) {
            console.log('WebSocket: onopen!');
            self.wsLogin();
        };
        this.webSocket.onmessage = function (evt) {
            console.log(`WebSocket: onmessage: ${evt.data}`);
            if (evt && evt.data) {
                if (evt.data.indexOf('error') >= 0) {
                    self.errorMessage = JSON.parse(evt.data).data;
                    self.notice.getComponent(Notice).show({ title: 'Notice', content: self.errorMessage.message }, () => { self.loadNewScene('lobby') });
                } else {
                    const res = APIMgr.instance.decodeData(evt.data);
                    const json = JSON.parse(res);
                    if (json != null) {
                        self.messageHandler(json);
                    }
                    console.log(`WebSocket: res=${res}!`)
                }
            } else {
                self.notice.getComponent(Notice).show({ title: 'Notice', content: 'Connect server error' }, () => { self.loadNewScene('lobby') });
            }

            // respLabel.string = binaryStr;
            // websocketLabel.string = 'WebSocket: onmessage'
        };

        this.webSocket.onerror = function (evt) {
            console.log('WebSocket: onerror');
        };

        this.webSocket.onclose = function (evt) {
            console.log('WebSocket: onclose');
            // After close, it's no longer possible to use it again,
            // if you want to send another request, you need to create a new websocket instance
            self.webSocket = null;
        };
    }
    sendMessgage(data: string) {
        console.log(`WebSocket: sent: ${data}`);
        if (!this.webSocket) { return; }
        if (this.webSocket.readyState === WebSocket.OPEN) {
            this.webSocket.send(data);
        }
    }
    wsLogin() {
        const data = {
            pid: "login",
            token: APIMgr.instance.signinRes.authorization,
            gameId: APIMgr.instance.currentGame.id
        };
        this.sendMessgage(JSON.stringify(data));
    }
    wsSpin() {
        let data = {
            pid: "spin",
            lineBet: this.loginRes.lineBet
        }
        const str = APIMgr.instance.encodeData(JSON.stringify(data));
        this.sendMessgage(str);
    }
    hideLoading() {
        this.loading.active = false;
    }
    wsSpinDebug(arr: any) {
        let data = {
            pid: "spinDebug",
            lineBet: this.loginRes.lineBet,
            line: arr
        }
        const str = APIMgr.instance.encodeData(JSON.stringify(data));
        this.sendMessgage(str);
    }
    messageHandler(data: any) {
        console.log(JSON.stringify(data));
        switch (data.pid) {
            case "loginRes":
                this.loginRes = data;
                this.spinRes.balance = this.loginRes.balance;
                this.lbBalance.string = GameMgr.instance.numberWithCommas(this.loginRes.balance);
                this.lbLevel.string = `lv: ${this.loginRes.level.level}`;
                let maxWidth = this.levelProgress.parent.getComponent(UITransform).width; //<=>100
                if(this.loginRes.level.maxExp<this.loginRes.level.exp){
                    this.loginRes.level.maxExp = this.loginRes.level.exp;
                }
                this.levelProgress.getComponent(UITransform).width = (this.loginRes.level.exp/this.loginRes.level.maxExp)*maxWidth;
                this.lbTotalBet.string = GameMgr.instance.numberWithCommas(this.loginRes.lineBet * 20);
                //clear & add new
                if (this.loginRes && this.loginRes.reelInfo && this.loginRes.reelInfo.normal && this.loginRes.reelInfo.normal.length > 0) {
                    let arr = this.loginRes.reelInfo.normal[0];
                    for (let i = 0; i < arr.length; i++) {
                        this.reels[i].removeAllChildren();
                        let arrStr = arr[i].split(',');
                        let arrTemp = [];
                        for (let j = 0; j < arrStr.length; j++) {
                            arrTemp.push(parseInt(arrStr[j]));
                        }
                        arrTemp = arrTemp.concat(arrTemp);
                        arrTemp = arrTemp.concat(arrTemp);
                        arrTemp = arrTemp.concat(arrTemp);
                        arrTemp = arrTemp.concat(arrTemp);
                        arrTemp = arrTemp.slice(0, 60 + i * 30);//45,60,75,100,125
                        console.log(`reels[${i}]: ${arrTemp.length}`);
                        this.reels[i].getComponent(KongReel).init(GameMgr.instance.shuffle(arrTemp), this.items);
                    }
                }
                break;
            case "spinRes":
                this.spinRes = data;
                this.setMaskEnable(true);
                //run reels
                let self = this;
                //--check reels tension -> add more item and expend times
                let counts = [0, 0, 0, 0];//scatter, coin, jackpot, wild
                let lineId = -1;
                for (let i = 0; i < 4; i++) {
                    let line = this.spinRes.lineKeys[i];
                    for (let j = 0; j < line.length; j++) {
                        if (line[j] == this.ICON_MAPPING.scatter) {
                            counts[0]++;
                            if (counts[0] == 2 && lineId == -1) {
                                lineId = i;
                            }
                        } else if (line[j] == this.ICON_MAPPING.coin) {
                            counts[1]++;
                            if (counts[1] == 2 && lineId == -1) {
                                lineId = i;
                            }
                        } else if (line[j] == this.ICON_MAPPING.jackpot) {
                            counts[2]++;
                            if (counts[2] == 2 && lineId == -1) {
                                lineId = i;
                            }
                        } else if (line[j] == this.ICON_MAPPING.wild) {
                            counts[3]++;
                            if (counts[3] == 2 && lineId == -1) {
                                lineId = i;
                            }
                        }
                    }
                }
                let reelsRunTime = [];
                for (let i = 0; i < this.reels.length; i++) {
                    let speed = this.reels[i].children.length * this.kongConfig.reelsSpeed;
                    reelsRunTime.push(speed);
                }
                const extraTime = 0.5;
                if (lineId != -1) {
                    if (lineId == 3) {
                        reelsRunTime[4] += extraTime * 3;
                    } else if (lineId == 2) {
                        reelsRunTime[3] += extraTime * 2;
                        reelsRunTime[4] += extraTime * 3;
                    } else if (lineId == 1) {
                        reelsRunTime[2] += extraTime * 1;
                        reelsRunTime[3] += extraTime * 2;
                        reelsRunTime[4] += extraTime * 3;
                    }
                }
                //--prepare reel data

                //--add result
                if (this.spinRes && this.spinRes.lineKeys && this.spinRes.lineKeys.length > 0) {
                    for (let i = 0; i < this.spinRes.lineKeys.length; i++) {
                        let arr = this.spinRes.lineKeys[i];
                        for (let j = 0; j < arr.length; j++) {
                            const texId = arr[j]
                            const tex = this.icons[texId];
                            this.reels[i].children[j].getComponent(KongItem).setTexture(tex, texId);
                        }
                    }
                }
                Promise.all(self.reels.map(function (reel, index) {
                    reel.getComponent(KongReel).spin(index, reelsRunTime[index]);//1s
                }))
                break;
            case "spinDebug":
                this.spinRes = data;
                break;
            case "error":
                this.errorMessage = data.data;
                this.notice.getComponent(Notice).show({ title: 'Notice', content: this.errorMessage.message }, () => { this.preSpin() });
                this.lbWin.string = '0';
                this.lbBalance.string = GameMgr.instance.numberWithCommas(this.spinRes.balance);
                break;
        }
        this.loading.active = false;
    }
    //3. action ---------------------------------------------------------------------------------
    onCloseEnd(button: Button) {
        AudioMgr.inst.playOneShot(this.arrAudioClips[1]);
        switch (button.node.name) {
            case 'btnCloseJackpot':
                this.showEndFreeSpin();
                this.jackpotNode.active = false;
                this.playCoinEffect();
                this.preSpin();
                break;
            case 'btnCloseBonusRes':
                this.skeBonusRes.setAnimation(0,'close',false);
                let timeout18 = setTimeout(()=>{
                    clearTimeout(timeout18);
                    this.bonusResNode.active = false;
                },1500);
                this.showWinResult(false);
                break;
            case 'btnCloseBigWin':
                this.showEndFreeSpin();
                this.bigWinNode.active = false;
                this.playCoinEffect();
                this.preSpin();
                break;
            case 'btnCloseFreeSpinRes':
                this.freeSpinResNode.active = false;
                this.btnFreeSpin.active = false;
                AudioMgr.inst.playSpin();
                this.setAutoSpin(false);
                this.preSpin();
                break;
            case 'btnAutoSpin':
                this.setAutoSpin(false);
                this.preSpin();
                break;
            case 'btnCloseFreeSpin':
                this.freeSpinNode.active = false;
                this.btnCloseFreeSpin.active = false;
                this.setAutoSpin(true);
                this.preSpin();
                break;
        }

    }
    onClick(button: Button) {
        AudioMgr.inst.playOneShot(this.arrAudioClips[1]);
        switch (button.node.name) {
            case 'btnDbBigWin':
                this.spin(true, [9, 2, 2, 2, 8]);
                break;
            case 'btnDbBonus':
                this.spin(true, [9, 7, 22, 7, 8]);
                break;
            case 'btnDbFreeSpin':
                this.spin(true, [3, 10, 20, 12, 14])//13, 15]);
                break;
            case 'btnDbJackpot':
                this.spin(true, [31, 25, 32, 26, 25]);
                break;
            case 'btnFreeSpin':
                this.spin(false, []);
                break;
            case 'btnShop':
                this.shop.active = true;
                break;
            case 'btnBack':
                this.smallLoading.getComponent(Loading).show();
                this.isBackPressed = true;
                this.disconnect();
                APIMgr.instance.signinRes.balance = this.spinRes.balance;
                let timeout15 = setTimeout(() => {
                    clearTimeout(timeout15);
                    this.loadNewScene('lobby');
                }, this.kongConfig.showResultDelay);
                break;
            case 'btnBetMinus':
                this.setBettingLine(false);
                break;
            case 'btnBetPlus':
                this.setBettingLine(true);
                break;
            case 'btnMaxBet':
                this.loginRes.lineBet = this.loginRes.betOptions[this.loginRes.betOptions.length - 1];
                this.lbTotalBet.string = GameMgr.instance.numberWithCommas(this.loginRes.lineBet * this.totalLines);
                break;
            case 'btnRunDebugData':
                let strData = this.edDebugData.getComponent(EditBox).string;
                if (strData == null || strData.length < 1) {
                    return;
                }
                let dataTemp = []
                let arrStr = strData.split(',');
                for (let j = 0; j < arrStr.length; j++) {
                    dataTemp.push(parseInt(arrStr[j]));
                }
                this.spin(true, dataTemp);
                break;
            case 'btnBonusInfo':
                this.skeBonusStart.setAnimation(0,'close',false);
                this.lbBonusInfo.active = false;
                let timeout19 = setTimeout(()=>{
                    clearTimeout(timeout19);
                    this.bonusInfoNode.active = false;
                    this.bonusPlayNode.active = true;
                    this.countBonusRemain = this.spinRes.bonusPayout[0].matchCount;
                    this.totalBonusWin = 0;
                    this.lbBonusRemain.string = `${this.countBonusRemain}`;
                    this.lbBonusReward.string = `${this.totalBonusWin}`;
                    for (let i = 0; i < this.arrPlayBonusItem.length; i++) {
                        this.arrPlayBonusItem[i].getComponent(KongBonusItem).reset();
                    }
                    if (this.isFreeSpin) {
                        AudioMgr.inst.bgmFreeSpin.volume = 0.3;
                    } else {
                        AudioMgr.inst.bgmSpin.volume = 0.3;
                    }
                    AudioMgr.inst.playBonus();
                },1000);
                break;
            case 'btnMenu':
                this.ppOption.active = true;
                this.ppOption.getComponent(LobbyOption).bg.active = true;
                this.ppOption.getComponent(LobbyOption).show();
                break;
        }
    }
    setButtonInteractable(isDisable: boolean) {
        this.btnSpin.getComponent(Button).interactable = isDisable;
    }
    setBettingLine(isPlus: boolean) {
        let currentIndex = -1;
        for (let i = 0; i < this.loginRes.betOptions.length; i++) {
            if (this.loginRes.betOptions[i] == this.loginRes.lineBet) {
                currentIndex = i;
                break;
            }
        }
        if (currentIndex == -1) return;
        if (isPlus) {
            currentIndex++;
            if (currentIndex >= this.loginRes.betOptions.length) {
                currentIndex = this.loginRes.betOptions.length - 1;
            }
        } else {
            currentIndex--;
            if (currentIndex <= 0) {
                currentIndex = 0;
            }
        }
        this.lbTotalBet.string = GameMgr.instance.numberWithCommas(this.loginRes.betOptions[currentIndex] * this.totalLines);
        this.loginRes.lineBet = this.loginRes.betOptions[currentIndex];
    }

    setAutoSpin(isAuto: boolean) {
        this.isAutoSpin = isAuto;
        this.btnSpin.active = !isAuto;
        this.btnAutoSpin.active = isAuto;
    }

    onNoticeClose(data: string = "") {

    }

    updateLineWinEffect() {
        if (this.isUpdateLineWin) {
            let timeout2 = setTimeout(() => {//hide 500 -> show 500*2
                clearTimeout(timeout2);
                if (this.isBackPressed) {
                    return;
                }
                for (let i = 0; i < this.lineEffects.length; i++) {
                    this.lineEffects[i].active = false;
                }
            }, 500);

            let timeOut3 = setTimeout(() => {
                clearTimeout(timeOut3);
                if (this.isBackPressed) {
                    return;
                }
                if (this.lineEffectsIdx < this.lineEffects.length) {
                    this.lineEffects[this.lineEffectsIdx].active = true;
                    this.lineEffectsIdx++;
                    if (this.lineEffectsIdx >= this.lineEffects.length) {
                        this.lineEffectsIdx = 0;
                    }
                    this.updateLineWinEffect();
                }
            }, 1000)
        }
    }


    //4. core gameplay ----------------------------------------------------------------------------------------------
    preSpin() {
        //active button spin
        this.isSpin = false;
        this.setButtonInteractable(true);
        //
        if (this.isAutoSpin) {
            if (this.isFreeSpin && this.spinRes.freeSpin.remain == 0) return;//skip for freespin
            const timeOut4 = setTimeout(() => {
                clearTimeout(timeOut4);
                // this.freeSpinNode.active = false;
                // this.bigWinNode.active = false;
                // this.bonusResNode.active = false;
                // this.jackpotNode.active = false;
                this.spin(false, []);
            }, this.spinRes.totalWinBalance > 0 ? this.kongConfig.showResultDelay : 0)
        }
    }
    spin(isDebug: boolean = false, data: any) {
        //check balance
        if (this.spinRes.balance < (this.loginRes.lineBet * this.totalLines)) {//check balance
            this.notice.getComponent(Notice).show({ title: 'Notice', content: 'Insufficient chip, please buy more!' }, (data) => {
                this.shop.active = true;
            });
            if (this.isAutoSpin) {
                this.setAutoSpin(false);
            }
            return;
        }
        //--end check balance

        //start spin
        if (this.isFreeSpin) {
            AudioMgr.inst.playFreeSpin();
        } else {
            AudioMgr.inst.playSpin();
        }

        //1--clear result
        //line effect
        this.isUpdateLineWin = false;
        for (let i = 0; i < this.lineEffects.length; i++) {
            this.lineEffects[i].active = false;
        }
        for (let i = 0; i < this.reels.length; i++) {
            for (let j = 0; j < this.reels[i].children.length; j++) {
                this.reels[i].children[j].getComponent(KongItem).stopZoomAnim();
            }
        }
        this.lineEffects = [];

        //hide wildlong
        for(let i=0;i<this.arrWildLong.length;i++){
            this.arrWildLong[i].active = false;
        }

        //hide line
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].active = false;
        }

        //eff
        this.lbCoinEff.getComponent(UIOpacity).opacity = 0;

        //2. update balance
        if (!this.isFreeSpin) {
            let newBalance = this.spinRes.balance - this.loginRes.lineBet * this.totalLines;
            this.lbBalance.string = GameMgr.instance.numberWithCommas(newBalance);
        } else {
            this.lbFreeSpinCount.string = `${this.spinRes.freeSpin.remain}`;
        }

        //spin
        if (!this.isSpin) {
            this.isSpin = true;
            if (isDebug) {
                this.wsSpinDebug(data);
            } else {
                this.wsSpin();
            }
            this.setButtonInteractable(false);
        }
    }
    endSpin(idx: number) {
        //--check the last reel
        let countScatter = 0;
        let countWanted = 0;
        for (let i = 0; i < this.spinRes.lineKeys[idx].length; i++) {
            if (this.spinRes.lineKeys[idx][i] == this.ICON_MAPPING.scatter) {
                countScatter++;
            } else if (this.spinRes.lineKeys[idx][i] == this.ICON_MAPPING.coin) {
                countWanted++;
            }
        }
        if (countScatter >= 1) {
            if (idx == 0) {
                AudioMgr.inst.playOneShot(this.arrAudioClips[5]);
            } else if (idx == 1) {
                AudioMgr.inst.playOneShot(this.arrAudioClips[6]);
            } else if (idx == 2) {
                AudioMgr.inst.playOneShot(this.arrAudioClips[7]);
            } else if (idx == 3) {
                AudioMgr.inst.playOneShot(this.arrAudioClips[8]);
            } else if (idx == 4) {
                AudioMgr.inst.playOneShot(this.arrAudioClips[9]);
            }
        } else if (countWanted >= 1) {
            AudioMgr.inst.playOneShot(this.arrAudioClips[10]);
        } else {
            AudioMgr.inst.playOneShot(this.arrAudioClips[4]);//reel stop sound
        }


        //--check icon scatter and wanted -> reels tension
        this.arrTensionEff.children[0].active = false;
        this.arrTensionEff.children[1].active = false;
        this.arrTensionEff.children[2].active = false;
        if (idx >= 1 && idx < 4) {//start check from reel 2
            let counts = [0, 0, 0, 0];
            for (let i = 0; i <= idx; i++) {
                let line = this.spinRes.lineKeys[i];
                for (let j = 0; j < line.length; j++) {
                    if (line[j] == this.ICON_MAPPING.scatter) {
                        counts[0]++;
                    } else if (line[j] == this.ICON_MAPPING.coin) {
                        counts[1]++;
                    } else if (line[j] == this.ICON_MAPPING.jackpot) {
                        counts[2]++;
                    } else if (line[j] == this.ICON_MAPPING.wild) {
                        counts[3]++;
                    }
                }
            }
            if (counts[0] >= 2 || counts[1] >= 2 || counts[2] >= 2 || counts[3] >= 2) {//reels tension
                AudioMgr.inst.playTension();
                if (idx == 1) {
                    this.arrTensionEff.children[0].active = true;
                } else if (idx == 2) {
                    this.arrTensionEff.children[1].active = true;
                } else if (idx == 3) {
                    this.arrTensionEff.children[2].active = true;
                }
            }
        }

        if (idx < 4) {
            return;
        }
        //1. set icon result (effect same icon -> move -> it not changed)
        //end sound
        AudioMgr.inst.bgmTension.stop();
        if (this.spinRes.totalWinBalance > 0) {
            if (this.isFreeSpin) {
                AudioMgr.inst.bgmFreeSpin.volume = 0.3;
            } else {
                AudioMgr.inst.bgmSpin.volume = 0.3;
            }
        } else {//restart sound
            if (this.isFreeSpin) {
                AudioMgr.inst.playFreeSpin();
            } else {
                AudioMgr.inst.playSpin();
            }
        }
        //set icon win animation --
        if (this.spinRes && this.spinRes.lineKeys && this.spinRes.lineKeys.length > 0) {
            for (let i = 0; i < this.spinRes.lineKeys.length; i++) {
                let arr = this.spinRes.lineKeys[i];
                let startIdx = this.reels[i].children.length - 3;
                for (let j = 0; j < arr.length; j++) {
                    const texId = arr[j]
                    const tex = this.icons[texId];
                    this.reels[i].children[startIdx + j].getComponent(KongItem).setTexture(tex, texId);
                    if (texId == this.ICON_MAPPING.scatter && this.spinRes.freeSpin && this.spinRes.freeSpin.remain && this.spinRes.freeSpin.remain == this.spinRes.freeSpin.count) {//scatter
                        this.reels[i].children[startIdx + j].getComponent(KongItem).runScatter(this.items);
                    } else if (texId == this.ICON_MAPPING.coin && this.spinRes.bonusPayout && this.spinRes.bonusPayout.length > 0 && this.spinRes.bonusPayout[0].extendData) {//bonus
                        this.reels[i].children[startIdx + j].getComponent(KongItem).runWanted(this.items);
                    } else if (texId == this.ICON_MAPPING.jackpot && this.spinRes.winType == 'Jackpot') {//jackpot
                        this.reels[i].children[startIdx + j].getComponent(KongItem).runJackpot(this.items);
                    }
                }
                this.reels[i].setPosition(this.reels[i].getPosition().x, 17);
            }

        } else {
            console.error('result error')
        }
        //--
        this.setMaskEnable(false);
        //line win
        this.lineEffects = [];
        for (let i = 0; i < this.spinRes.payoutList.length; i++) {
            const lineIdx = this.spinRes.payoutList[i].lineNum;
            const line = this.lines[lineIdx];
            this.lineEffects.push(line);
            line.active = true;
            //--
            let coord = this.spinRes.payoutList[i].winPosition;
            for (let kk = 0; kk < coord.length; kk++) {
                let val1 = coord[kk];
                for (let ii = 0; ii < this.serverMatrix.length; ii++) {
                    let row = this.serverMatrix[ii];
                    for (let jj = 0; jj < row.length; jj++) {
                        let startCol = this.reels[jj].children.length - 3;
                        let val2 = row[jj];
                        if (val1 == val2) {
                            this.reels[jj].children[startCol+ii].getComponent(KongItem).zoomAnim();
                            //console.log(`anim [${jj},${2 - ii} val: ${val1}]`)
                            let texId = this.reels[jj].children[startCol+ii].getComponent(KongItem).idx;
                            if (texId == this.ICON_MAPPING.wild) {//wild
                                if(this.isFreeSpin){
                                    //this.reels[jj].children[startCol+ii].getComponent(KongItem).runWildLong(this.items);
                                    if(jj>0){
                                        this.arrWildLong[jj-1].active = true;
                                        //stop all zoom anim on this reels
                                        for(let ll = 0;ll<this.reels[jj].children.length;ll++){
                                            this.reels[jj].children[ll].getComponent(KongItem).stopZoomAnim();
                                        }
                                    }
                                } else {
                                    this.reels[jj].children[startCol+ii].getComponent(KongItem).runWild(this.items);
                                }
                                
                            }
                        }
                    }
                }
            }
        }
        //--run effect
        if (this.lineEffects.length > 0) {
            this.lineEffectsIdx = 0;
            this.isUpdateLineWin = true;
            this.updateLineWinEffect();
        }

        // bigwin | win + bonus -> show bonus first -> bigwin later -> end bonus
        // bigwin | win + free  -> show bigwin first -> free spin later -> end free spin
        // auto spin| -> time
        let wintype = this.getWinType();
        if (wintype == 'bonus') {
            let timeout5 = setTimeout(() => {
                clearTimeout(timeout5);
                this.bonusInfoNode.active = true;
                this.lbBonusInfo.active = false;
                this.skeBonusStart.setAnimation(0,'start',false);
                let timeout16 = setTimeout(()=>{
                    clearTimeout(timeout16);
                    if(this.lbBonusInfo){
                        this.lbBonusInfo.active = true;
                        this.skeBonusStart.setAnimation(0,'idle',false);
                    }
                },1000);
                this.lbBonusInfo.children[0].active = false;
                this.lbBonusInfo.children[1].active = false;
                this.lbBonusInfo.children[2].active = false;
                if (this.spinRes.bonusPayout[0].matchCount == 3) {
                    this.lbBonusInfo.children[0].active = true;
                } else if (this.spinRes.bonusPayout[0].matchCount == 4) {
                    this.lbBonusInfo.children[1].active = true;
                } else {
                    this.lbBonusInfo.children[2].active = true;
                }
                AudioMgr.inst.playOneShot(this.arrAudioClips[15]);
            }, this.kongConfig.showResultDelay);
        } else {//normal
            this.showWinResult(true);
        }
    }
    showWinResult(isDelay: boolean) {
        if (this.isFreeSpin) {
            this.iTotalWinFreeSpin += this.spinRes.totalWinBalance;
            this.lbFreeSpinCount.string = `${this.spinRes.freeSpin.remain}`;
        }
        switch (this.spinRes.winType) {
            case 'Jackpot':
                AudioMgr.inst.playOneShot(this.arrAudioClips[27]);
                let timeout6 = setTimeout(() => {
                    clearTimeout(timeout6);
                    this.jackpotNode.active = true;
                    this.skeJackpot.setAnimation(0,'animation',false);
                    GameMgr.instance.numberTo(this.lbJackpotWinCoin, 0, this.spinRes.totalWinBalance, 2000);
                    AudioMgr.inst.playOneShot(this.arrAudioClips[13]);
                }, isDelay ? this.kongConfig.showResultDelay : this.kongConfig.showResultNotDelay);
                break;
            case 'Big Win':
            case 'Ultra':
            case 'Mega Win':
            case 'Super Win':
                let timeout7 = setTimeout(() => {
                    clearTimeout(timeout7);
                    this.bigWinNode.active = true;
                    this.skeBigWin.setAnimation(0,'big_win',false);
                    GameMgr.instance.numberTo(this.lbBigWinCoin, 0, this.spinRes.totalWinBalance, 2000);
                    AudioMgr.inst.playOneShot(this.arrAudioClips[12]);
                }, isDelay ? this.kongConfig.showResultDelay : this.kongConfig.showResultNotDelay);
                break;
            default:
                //freespin
                if (this.spinRes.freeSpin && this.spinRes.freeSpin.remain && this.spinRes.freeSpin.remain > 0) {
                    if(this.isFreeSpin==false  && this.spinRes.totalWinBalance > 0){
                        GameMgr.instance.numberTo(this.lbWin,0,this.spinRes.totalWinBalance,1000);
                        this.playCoinEffect();
                    }
                    let timeout8 = setTimeout(() => {
                        clearTimeout(timeout8);
                        this.lbFreeSpinCount.string = `${this.spinRes.freeSpin.remain}`;
                        if (this.isFreeSpin == false) {
                            this.isFreeSpin = true;
                            this.iTotalWinFreeSpin = 0;
                            this.freeSpinNode.active = true;
                            let timeout17 = setTimeout(()=>{
                                clearTimeout(timeout17);
                                this.btnCloseFreeSpin.active = true;
                            },1000)
                            this.skeFreeSpin.setAnimation(0,'start',false);
                            this.lbFreeSpinEff.string = `${this.spinRes.freeSpin.remain}`;
                            this.btnFreeSpin.active = true;
                            this.btnSpin.active = false;
                            this.btnAutoSpin.active = false;
                            AudioMgr.inst.playOneShot(this.arrAudioClips[14]);
                        } else {
                            this.playCoinEffect();
                            this.preSpin();
                        }
                    }, (isDelay && this.spinRes.totalWinBalance > 0) ? (this.kongConfig.showResultDelay+1000) : this.kongConfig.showResultNotDelay);
                } else {//normal
                    if (this.spinRes.totalWinBalance > 0) {
                        AudioMgr.inst.playOneShot(this.arrAudioClips[11]);//normal win
                    }
                    this.playCoinEffect();
                    this.preSpin();
                }
                this.showEndFreeSpin();
                break;
        }

    }
    showEndFreeSpin() {
        if (this.isFreeSpin && this.spinRes.freeSpin.remain == 0) { //end free spin
            AudioMgr.inst.bgmFreeSpin.stop();
            let timeout9 = setTimeout(() => {
                clearTimeout(timeout9);
                this.isFreeSpin = false;
                this.freeSpinResNode.active = true;
                this.skeFreeSpinRes.setAnimation(0,'start',false);
                GameMgr.instance.numberTo(this.lbFreeSpinWon, 0, this.iTotalWinFreeSpin, 2000);
                AudioMgr.inst.playOneShot(this.arrAudioClips[16]);
            }, this.kongConfig.showResultDelay);
        }
    }
    getWinType() {
        if (this.spinRes.bonusPayout && this.spinRes.bonusPayout.length > 0 && this.spinRes.bonusPayout[0].bonusType=='bonus') {
            return 'bonus';
        } else if (this.spinRes.freeSpin && this.spinRes.freeSpin.remain && this.spinRes.freeSpin.remain > 0) {
            return 'freespin';
        } else if (this.spinRes.winType.length > 0) {
            return 'special';
        }
        return 'normal';
    }
    playCoinEffect() {
        if (this.spinRes.totalWinBalance > 0) {
            if (this.isFreeSpin) {
                let startVal = this.iTotalWinFreeSpin - this.spinRes.totalWinBalance;
                GameMgr.instance.numberTo(this.lbWin, startVal, this.iTotalWinFreeSpin, 500);
            } else {
                GameMgr.instance.numberTo(this.lbWin, 0, this.spinRes.totalWinBalance, 1000);
            }

            //--coin effect move
            let ef = Math.floor(Math.random() * 5) + 3;
            let startPos = this.cointPos1.position; //.parent.parent.position;
            let endPos = this.cointPos2.position; //.parent.parent.parent.position;
            let timeout10 = setTimeout(() => {
                clearTimeout(timeout10);
                for (let i = 0; i < ef; i++) {
                    var coint = instantiate(this.pfCointEff);
                    this.node.parent.addChild(coint);
                    coint.getComponent(KongCoinEff).init(startPos, endPos);
                }
                AudioMgr.inst.playCoin();
            }, 1000)

            let timeout11 = setTimeout(() => {
                clearTimeout(timeout11)
                this.lbBalance.string = GameMgr.instance.numberWithCommas(this.spinRes.balance);
                AudioMgr.inst.bgmCoin.stop();
                if (this.freeSpinResNode.active == true) {
                } else {
                    if (this.isFreeSpin) {
                        AudioMgr.inst.playFreeSpin();
                    } else {
                        AudioMgr.inst.playSpin();
                    }
                }
            }, 2000)
        }
        //coin effect old
        // if (this.spinRes.totalWinBalance > 0) {
        //     this.lbCoinEff.getComponent(Label).string = `+${totalWin}`;
        //     this.lbCoinEff.getComponent(Animation).play();
        // }
    }
    private updateProgress() {
        if (this.loadingBar && this.loadingBar.parent) {
            let w = this.loadingBar.parent.getComponent(UITransform).width;
            let progress = (this.percent / 100) * w;
            this.loadingBar.getComponent(UITransform).width = progress;
            if (progress > w * 0.99) {
                progress = w * 0.99;
            }
        } else {
            this.percent = 0;
        }
    }
    update(deltaTime: number) {
        if (this.percent < 100) {
            this.percent++;
            this.updateProgress()
        }
    }
    loadNewScene(sceneName:string){
        AudioMgr.inst.stop();
        this.removeListener();
        director.loadScene(sceneName);
    }
    removeListener() {
        GameEvent.RemoveEventListener("updatebalance");
    }
}