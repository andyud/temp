import { _decorator, AudioClip, Component, Node, Button, Animation, Prefab, SpriteFrame, instantiate, Label } from 'cc';
import { AudioMgr } from '../../../core/AudioMgr';
import { FruitItemQuest } from './FruitItemQuest';
const { ccclass, property } = _decorator;

@ccclass('FruitQuest')
export class FruitQuest extends Component {
    @property({ type: Node })
    bg: Node | null = null;
    @property({ type: Node })
    pp: Node | null = null;
    @property({ type: Node })
    btnClose: Node | null = null;
    @property({ type: Node })
    btnPlay: Node | null = null;
    @property({ type: Node })
    questList: Node | null = null;
    @property({ type: Prefab })
    pfItem: Prefab | null = null;
    @property({ type: Label })
    lbQuest: Label | null = null;
    icons = [];
    audioClip: AudioClip = null;
    callback: (cmd: number) => void;
    level = {
        MODE: 2,
        SIZE: [7, 5],
        LIMIT: [0, 16],
        COLOR_LIMIT: 4,
        STARS: [500, 1200, 2100],
        COLLECT_ITEMS: [0, 1, 2, 3],
        COLLECT_COUNT: [3, 3, 3, 3],
        GETSTARS: 3
    };
    start() {
        this.node.active = false;
        this.bg.active = false;
        this.pp.setPosition(0, -1400);
        this.btnPlay.on(Button.EventType.CLICK, this.onClick, this);
        this.btnClose.on(Button.EventType.CLICK, this.onClick, this);
    }

    init(audioClip: AudioClip, icons: any, cb: (cmd: number) => void) {
        this.audioClip = audioClip;
        this.icons = icons;
        this.callback = cb;

    }
    show(level: any) {
        this.node.active = true;
        this.bg.active = true;
        this.pp.getComponent(Animation).play('showpopup');
        this.level = level;
        this.questList.removeAllChildren();
        switch (this.level.MODE) {
            case 0://collect star
                let item = instantiate(this.pfItem);
                let idx = 8;
                let count = this.level.GETSTARS;
                item.getComponent(FruitItemQuest).init(this.icons[idx], { idx: 0, type: idx, count: count });
                this.questList.addChild(item);
                this.lbQuest.string = `Get ${this.level.GETSTARS} stars`;
                break;
            case 1:
            case 2:
                if(this.level.MODE==1){
                    this.lbQuest.string = "Collect all pets";
                } else if(this.level.MODE==2){
                    this.lbQuest.string = "Get the items";
                }
                for (let i = 0; i < this.level.COLLECT_ITEMS.length; i++) {
                    let item = instantiate(this.pfItem);
                    let idx = this.level.COLLECT_ITEMS[i];
                    let count = this.level.COLLECT_COUNT[i];
                    item.getComponent(FruitItemQuest).init(this.icons[idx], { idx: i, type: idx, count: count });
                    this.questList.addChild(item);
                }
                break;
        }
    }
    hide() {
        this.pp.getComponent(Animation).play('hidepopup');
        this.bg.active = false;
        let timeout1 = setTimeout(() => {
            clearTimeout(timeout1);
            this.node.active = false;
        }, 200);
    }
    onClick(button: Button) {
        AudioMgr.inst.playOneShot(this.audioClip);
        switch (button.node.name) {
            case 'btnClose':
                this.pp.getComponent(Animation).play('hidepopup');
                this.bg.active = false;
                let timeout1 = setTimeout(() => {
                    clearTimeout(timeout1);
                    this.node.active = false;
                    //--back to lobby
                    this.callback(1);
                }, 200);
                break;
            case 'btnPlay':
                this.pp.getComponent(Animation).play('hidepopup');
                this.bg.active = false;
                let timeout2 = setTimeout(() => {
                    clearTimeout(timeout2);
                    this.node.active = false;
                    this.callback(2);
                }, 200);
                break;
        }
    }
}

