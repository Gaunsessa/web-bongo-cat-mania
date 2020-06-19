import * as PIXI from "pixi.js"

export class Bongo {
    canvas: HTMLCanvasElement;

    width: number;
    height: number;
    baseWidth: number;
    baseHeight: number;
    widthScale: number;
    heightScale: number;

    key0: string;
    key1: string;
    key2: string;
    key3: string;

    keyboardKey0: string;
    keyboardKey1: string;
    keyboardKey2: string;
    keyboardKey3: string;

    catSheetImg: PIXI.BaseTexture;
    catSheet: { main: Array<PIXI.Texture> };

    cat: { sprite: PIXI.AnimatedSprite, index: number };

    menuBackground: PIXI.Sprite;
    menuText: PIXI.Text;
    menuBG: PIXI.Sprite;

    rightArrow: PIXI.Sprite;
    leftArrow: PIXI.Sprite;

    songSelectText: PIXI.Text;
    songSelectBG: PIXI.Sprite;

    pawSheet: PIXI.BaseTexture;

    leftPaw: PIXI.Sprite;
    rightPaw: PIXI.Sprite;

    keyboardSheetImg: PIXI.BaseTexture;
    keyboardSheet: { main: Array<PIXI.Texture> };

    keyboard: PIXI.AnimatedSprite;

    renderer: PIXI.Renderer;
    stage: PIXI.Container;
    ticker: PIXI.Ticker;
    
    constructor() {
        this.canvas = document.getElementById('bongo') as HTMLCanvasElement;

        this.width = window.innerWidth / 2;
        this.height = window.innerHeight;

        this.baseWidth = 960;
        this.baseHeight = 976;

        this.widthScale = (window.innerWidth / 2) / this.baseWidth;
        this.heightScale = window.innerHeight / this.baseHeight;

        this.key0 = "up"
        this.key1 = "up"
        this.key2 = "up"
        this.key3 = "up"

        this.keyboardKey0 = "0";
        this.keyboardKey1 = "0";
        this.keyboardKey2 = "0";
        this.keyboardKey3 = "0";

        this.renderer = new PIXI.Renderer({
            view: this.canvas,
            width: this.width,
            height: this.height,
            resolution: window.devicePixelRatio,
            autoDensity: true
        });

        this.renderer.backgroundColor = 0xFFFFFF;

        this.stage = new PIXI.Container();
        this.ticker = new PIXI.Ticker();

        this.ticker.maxFPS = 60;

        this.catSheetImg = PIXI.BaseTexture.from("img/Sprites/cats.png");

        this.catSheet = {
            "main": [
                new PIXI.Texture(this.catSheetImg, new PIXI.Rectangle(0 * 450, 0, 450, 450)),
                new PIXI.Texture(this.catSheetImg, new PIXI.Rectangle(1 * 450, 0, 450, 450)),
                new PIXI.Texture(this.catSheetImg, new PIXI.Rectangle(2 * 450, 0, 450, 450)),
                new PIXI.Texture(this.catSheetImg, new PIXI.Rectangle(3 * 450, 0, 450, 450)),
                new PIXI.Texture(this.catSheetImg, new PIXI.Rectangle(4 * 450, 0, 450, 450)),
                new PIXI.Texture(this.catSheetImg, new PIXI.Rectangle(5 * 450, 0, 450, 450)),
                new PIXI.Texture(this.catSheetImg, new PIXI.Rectangle(6 * 450, 0, 450, 450)),
                new PIXI.Texture(this.catSheetImg, new PIXI.Rectangle(7 * 450, 0, 450, 450)),
                new PIXI.Texture(this.catSheetImg, new PIXI.Rectangle(8 * 450, 0, 450, 450)),
                new PIXI.Texture(this.catSheetImg, new PIXI.Rectangle(9 * 450, 0, 450, 450))
            ]
        };

        this.cat = { sprite: new PIXI.AnimatedSprite(this.catSheet.main), index: 0 };
        // this.cat = new PIXI.Sprite(new PIXI.Texture.from("img/Sprites/cats/cat emo.png"));
        this.cat.sprite.anchor.x = 0.5;
        this.cat.sprite.anchor.y = 0.5;
        this.cat.sprite.width = 450 * this.widthScale;
        this.cat.sprite.height = 450 * this.heightScale;
        this.cat.sprite.x = (this.baseWidth / 2) * this.widthScale;
        this.cat.sprite.y = (this.baseHeight / 2) * this.heightScale;
        this.stage.addChild(this.cat.sprite);

        this.menuBackground = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.menuBackground.alpha = 0;
        this.menuBackground.tint = 0xbdbdbd;
        this.menuBackground.width = 600 * this.widthScale;
        this.menuBackground.height = 250 * this.heightScale;
        this.menuBackground.x = (this.baseWidth / 2 - 300) * this.widthScale;
        this.menuBackground.y = (this.baseWidth / 2 + 200) * this.heightScale;
        this.stage.addChild(this.menuBackground);

        this.menuText = new PIXI.Text(' MENU ',{fontFamily : 'Arial', fontSize: 30 * this.widthScale, fill : 0xff9ba2, align : 'center'});
        this.menuText.x = (this.baseWidth / 2 - 50) * this.widthScale;
        this.menuText.y = (this.baseWidth / 2 + 180) * this.heightScale;
        this.menuText.interactive = true;
        this.menuText.on('mousedown', () => this.menuOn());
        this.menuBG = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.menuBG.tint = 0xf0f0f0;
        this.menuBG.width = this.menuText.width;
        this.menuBG.height = this.menuText.height;
        this.menuBG.x = this.menuText.x;
        this.menuBG.y = this.menuText.y;
        this.stage.addChild(this.menuBG);
        this.stage.addChild(this.menuText);

        this.rightArrow = new PIXI.Sprite(PIXI.Texture.from("img/Sprites/arrow.png"));
        this.rightArrow.tint = 0xf0f0f0;
        this.rightArrow.width = 100 * this.widthScale;
        this.rightArrow.height = 100 * this.heightScale;
        this.rightArrow.alpha = 0;
        this.rightArrow.interactive = true;
        this.rightArrow.on('mousedown', () => this.cycleCats(1));
        this.rightArrow.x = (this.baseWidth / 2 + 250) * this.widthScale;
        this.rightArrow.y = (this.baseHeight / 2 - 25) * this.heightScale;
        this.stage.addChild(this.rightArrow);

        this.leftArrow = new PIXI.Sprite(PIXI.Texture.from("img/Sprites/arrow.png"));
        this.leftArrow.tint = 0xf0f0f0;
        this.leftArrow.width = 100 * this.widthScale;
        this.leftArrow.height = 100 * this.heightScale;
        this.leftArrow.alpha = 0;
        this.leftArrow.interactive = true;
        this.leftArrow.on('mousedown', () => this.cycleCats(-1));
        this.leftArrow.scale.x *= -1;
        this.leftArrow.x = (this.baseWidth / 2 - 250) * this.widthScale;
        this.leftArrow.y = (this.baseHeight / 2 - 25) * this.heightScale;
        this.stage.addChild(this.leftArrow);

        this.songSelectText = new PIXI.Text(' SELECT SONG ',{fontFamily : 'Arial', fontSize: 30 * this.widthScale, fill : 0xff9ba2, align : 'center'});
        this.songSelectText.x = (this.baseWidth / 2 - 280) * this.widthScale;
        this.songSelectText.y = (this.baseWidth / 2 + 220) * this.heightScale;
        this.songSelectText.alpha = 0;
        // this.songSelectText.interactive = true;
        // this.songSelectText.on('mousedown', () => this.songSelect());
        this.songSelectBG = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.songSelectBG.alpha = 0;
        this.songSelectBG.tint = 0xf0f0f0;
        this.songSelectBG.width = this.songSelectText.width;
        this.songSelectBG.height = this.songSelectText.height;
        this.songSelectBG.x = this.songSelectText.x;
        this.songSelectBG.y = this.songSelectText.y;
        this.stage.addChild(this.songSelectBG);
        this.stage.addChild(this.songSelectText);

        document.getElementById("fileInput")!.style.width = `${233 * this.widthScale}px`;
        document.getElementById("fileInput")!.style.height = `${38 * this.heightScale}px`;

        //TODO ADD MENU AND DIFF SELECTION

        this.pawSheet = PIXI.BaseTexture.from("img/Sprites/paws.png");
        this.keyboardSheetImg = PIXI.BaseTexture.from("img/Sprites/keyboards.png");

        this.keyboardSheet = {
            "main": [
                new PIXI.Texture(this.keyboardSheetImg, new PIXI.Rectangle(0 * 340, 0, 340, 200)),
                new PIXI.Texture(this.keyboardSheetImg, new PIXI.Rectangle(1 * 340, 0, 340, 200)),
                new PIXI.Texture(this.keyboardSheetImg, new PIXI.Rectangle(2 * 340, 0, 340, 200)),
                new PIXI.Texture(this.keyboardSheetImg, new PIXI.Rectangle(3 * 340, 0, 340, 200)),
                new PIXI.Texture(this.keyboardSheetImg, new PIXI.Rectangle(4 * 340, 0, 340, 200)),
                new PIXI.Texture(this.keyboardSheetImg, new PIXI.Rectangle(5 * 340, 0, 340, 200)),
                new PIXI.Texture(this.keyboardSheetImg, new PIXI.Rectangle(6 * 340, 0, 340, 200)),
                new PIXI.Texture(this.keyboardSheetImg, new PIXI.Rectangle(7 * 340, 0, 340, 200)),
                new PIXI.Texture(this.keyboardSheetImg, new PIXI.Rectangle(8 * 340, 0, 340, 200)),
                new PIXI.Texture(this.keyboardSheetImg, new PIXI.Rectangle(9 * 340, 0, 340, 200)),
                new PIXI.Texture(this.keyboardSheetImg, new PIXI.Rectangle(10 * 340, 0, 340, 200)),
                new PIXI.Texture(this.keyboardSheetImg, new PIXI.Rectangle(11 * 340, 0, 340, 200)),
                new PIXI.Texture(this.keyboardSheetImg, new PIXI.Rectangle(12 * 340, 0, 340, 200)),
                new PIXI.Texture(this.keyboardSheetImg, new PIXI.Rectangle(13 * 340, 0, 340, 200)),
                new PIXI.Texture(this.keyboardSheetImg, new PIXI.Rectangle(14 * 340, 0, 340, 200)),
                new PIXI.Texture(this.keyboardSheetImg, new PIXI.Rectangle(15 * 340, 0, 340, 200))
            ]
        };

        this.keyboard = new PIXI.AnimatedSprite(this.keyboardSheet.main);
        this.keyboard.anchor.x = 0.5;
        this.keyboard.anchor.y = 0.5;
        this.keyboard.width = 340 * this.widthScale;
        this.keyboard.height = 200 * this.heightScale;
        this.keyboard.x = (this.baseWidth / 2 - 45) * this.widthScale;
        this.keyboard.y = (this.baseHeight / 2 + 75) * this.heightScale;
        this.stage.addChild(this.keyboard);

        this.leftPaw = new PIXI.Sprite(new PIXI.Texture(this.pawSheet, new PIXI.Rectangle(0, 0, 100, 100)));
        this.leftPaw.alpha = 0;
        this.leftPaw.anchor.x = 0.5;
        this.leftPaw.anchor.y = 0.5;
        this.leftPaw.width = 100 * this.widthScale;
        this.leftPaw.height = 100 * this.heightScale;
        this.leftPaw.x = (this.baseWidth / 2 - 95.1) * this.widthScale;
        this.leftPaw.y = (this.baseHeight / 2 - 22) * this.heightScale;
        this.stage.addChild(this.leftPaw);

        this.rightPaw = new PIXI.Sprite(new PIXI.Texture(this.pawSheet, new PIXI.Rectangle(100, 0, 100, 100)));
        this.rightPaw.alpha = 0;
        this.rightPaw.anchor.x = 0.5;
        this.rightPaw.anchor.y = 0.5;
        this.rightPaw.width = 100 * this.widthScale;
        this.rightPaw.height = 100 * this.heightScale;
        this.rightPaw.x = (this.baseWidth / 2 + 68) * this.widthScale;
        this.rightPaw.y = (this.baseHeight / 2 + 18) * this.heightScale;
        this.stage.addChild(this.rightPaw);

        this.ticker.add(this.animate);

        this.ticker.start();

        // window.addEventListener('resize', () => {
        //     this.width = window.innerWidth / 2;
        //     this.height = window.innerHeight;
        
        //     this.renderer.resize(this.width, this.height);
        // });

        document.addEventListener('keydown', key => {
            switch (key.keyCode) {
                case 68:
                    this.keyboardKey0 = "1";
                    this.leftPaw.alpha = 1;
                    break;
                case 70:
                    this.keyboardKey1 = "1";
                    this.leftPaw.alpha = 1;
                    break;
                case 74:
                    this.keyboardKey2 = "1";
                    this.rightPaw.alpha = 1;
                    break;
                case 75:
                    this.keyboardKey3 = "1";
                    this.rightPaw.alpha = 1;
                    break;
                default:
                    return;
            }
            
            let currentKeyboard = parseInt(`${this.keyboardKey0}${this.keyboardKey1}${this.keyboardKey2}${this.keyboardKey3}`, 2);
            
            this.keyboard.gotoAndStop(currentKeyboard);
        });
        
        document.addEventListener('keyup', key => {
            switch (key.keyCode) {
                case 68:
                    this.keyboardKey0 = "0";
                    this.leftPaw.alpha = 0;
                    break;
                case 70:
                    this.keyboardKey1 = "0";
                    this.leftPaw.alpha = 0;
                    break;
                case 74:
                    this.keyboardKey2 = "0";
                    this.rightPaw.alpha = 0;
                    break;
                case 75:
                    this.keyboardKey3 = "0";
                    this.rightPaw.alpha = 0;
                    break;
                default:
                    return;
            }
            
            let currentKeyboard = parseInt(`${this.keyboardKey0}${this.keyboardKey1}${this.keyboardKey2}${this.keyboardKey3}`, 2);
            
            this.keyboard.gotoAndStop(currentKeyboard);
        });
    }

    menuOn() {
        this.rightArrow.alpha = 1;
        this.rightArrow.interactive = true;
        this.leftArrow.alpha = 1;
        this.leftArrow.interactive = true;

        this.menuBackground.alpha = 1;
        this.songSelectText.alpha = 1;
        this.songSelectBG.alpha = 1;

        document.getElementById('fileInput')!.style.display = "block";
        
        this.menuText.removeAllListeners();
        this.menuText.on('mousedown', () => this.menuOff());
    }

    menuOff() {
        this.rightArrow.alpha = 0;
        this.rightArrow.interactive = false;
        this.leftArrow.alpha = 0;
        this.leftArrow.interactive = false;

        this.menuBackground.alpha = 0;
        this.songSelectText.alpha = 0;
        this.songSelectBG.alpha = 0;

        document.getElementById('fileInput')!.style.display = "none";

        this.menuText.removeAllListeners();
        this.menuText.on('mousedown', () => this.menuOn());
    }

    cycleCats(amt: number) {
        if (this.cat.index === 0 && amt === -1) {
            this.cat.index = Object.keys(this.catSheet.main).length;
        } else if (this.cat.index === Object.keys(this.catSheet.main).length && amt === 1) {
            this.cat.index = 0;
        } else {
            this.cat.index += amt;
        }

        this.cat.sprite.gotoAndStop(this.cat.index);
    }

    animate = () => {
        this.renderer.render(this.stage);
    }
}