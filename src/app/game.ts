import * as PIXI from "pixi.js";

export class Game {
    canvas: HTMLCanvasElement;
    honk_sound: HTMLAudioElement;
    hit_normal: HTMLAudioElement;
    hit_soft: HTMLAudioElement;

    width: number;
    height: number;
    baseWidth: number;
    baseHeight: number;
    widthScale: number;
    heightScale: number;

    speed: number;
    baseSpeed: number;
    speedScale: number;

    combo: number;
    score: number;

    key0: string;
    key1: string;
    key2: string;
    key3: string;

    backdrop: PIXI.Graphics;

    line0: PIXI.Graphics;
    line1: PIXI.Graphics;
    line2: PIXI.Graphics;

    edge0: PIXI.Graphics;
    edge1: PIXI.Graphics;

    comboMeter: PIXI.Text;
    comboLabel: PIXI.Text;

    hitBoxes: Array<PIXI.Graphics>;

    hitBox0: PIXI.Graphics;
    hitBox1: PIXI.Graphics;
    hitBox2: PIXI.Graphics;
    hitBox3: PIXI.Graphics;
    barLine: PIXI.Graphics;

    tiles: Array<{ sprite: PIXI.Sprite, collom: number, type: string, hit: boolean }>;
    holds: Array<{ sprite: PIXI.Sprite, collom: number, type: string, hit: boolean }>;

    renderer: PIXI.Renderer;
    stage: PIXI.Container;
    ticker: PIXI.Ticker;

    constructor() {
        this.canvas = document.getElementById('game')! as HTMLCanvasElement;
        this.honk_sound = document.getElementById('Honk')! as HTMLAudioElement;
        this.hit_normal = document.getElementById('HitNormal')! as HTMLAudioElement;
        this.hit_soft = document.getElementById('HitSoft')! as HTMLAudioElement;

        this.width = window.innerWidth / 2;
        this.height = window.innerHeight;

        this.baseWidth = 960;
        this.baseHeight = 976;

        this.widthScale = (window.innerWidth / 2) / this.baseWidth;
        this.heightScale = window.innerHeight / this.baseHeight;

        this.baseSpeed = 12;
        this.speed = 12; // TODO MAKE LIKE YOU KNOW SPEED BPM SCALING
        this.speedScale = this.baseSpeed / this.speed;
        if (this.speedScale === 1) this.speedScale = 0;
        console.log(this.speedScale);

        this.combo = 0;
        this.score = 0;

        this.key0 = "up"
        this.key1 = "up"
        this.key2 = "up"
        this.key3 = "up"

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

        this.ticker.maxFPS = 165;

        this.backdrop = new PIXI.Graphics();
        this.backdrop.beginFill(0xd9d9d9);
        this.backdrop.drawRect((this.baseWidth / 2 - 270) * this.widthScale, 0, 550 * this.widthScale, this.renderer.screen.height);
        this.backdrop.endFill();
        this.stage.addChild(this.backdrop);

        this.line0 = new PIXI.Graphics();
        this.line0.beginFill(0xd5d5d5);
        this.line0.drawRect((this.baseWidth / 2 - 137.5) * this.widthScale, 0, 10 * this.widthScale, this.renderer.screen.height);
        this.line0.endFill();
        this.stage.addChild(this.line0);

        this.line1 = new PIXI.Graphics();
        this.line1.beginFill(0xd5d5d5);
        this.line1.drawRect((this.baseWidth / 2) * this.widthScale, 0, 10 * this.widthScale, this.renderer.screen.height);
        this.line1.endFill();
        this.stage.addChild(this.line1);

        this.line2 = new PIXI.Graphics();
        this.line2.beginFill(0xd5d5d5);
        this.line2.drawRect((this.baseWidth / 2 + 137.5) * this.widthScale, 0, 10 * this.widthScale, this.renderer.screen.height);
        this.line2.endFill();
        this.stage.addChild(this.line2);

        this.edge0 = new PIXI.Graphics();
        this.edge0.beginFill(0xd5d5d5);
        this.edge0.drawRect((this.baseWidth / 2 - 270) * this.widthScale, 0, 5 * this.widthScale, this.renderer.screen.height);
        this.edge0.endFill();
        this.stage.addChild(this.edge0);

        this.edge1 = new PIXI.Graphics();
        this.edge1.beginFill(0xd5d5d5);
        this.edge1.drawRect((this.baseWidth / 2 + 280) * this.widthScale, 0, -5 * this.widthScale, this.renderer.screen.height);
        this.edge1.endFill();
        this.stage.addChild(this.edge1);

        this.comboMeter = new PIXI.Text('0',{fontFamily : 'Arial', fontSize: 70 * this.widthScale, fill : 0xff9ba2, align : 'center'});
        this.comboMeter.x = (this.baseWidth / 2 - 400) * this.widthScale;
        this.comboMeter.y = (this.baseWidth / 2 + 150) * this.heightScale;
        this.stage.addChild(this.comboMeter);

        this.comboLabel = new PIXI.Text('COMBO',{fontFamily : 'Arial', fontSize: 30 * this.widthScale, fill : 0xff9ba2, align : 'center'});
        this.comboLabel.x = (this.baseWidth / 2 - 438) * this.widthScale;
        this.comboLabel.y = (this.baseWidth / 2 + 220) * this.heightScale;
        this.stage.addChild(this.comboLabel);

        this.hitBoxes = [];

        this.hitBox0 = new PIXI.Graphics();
        this.hitBox0.alpha = 0.85;
        this.hitBox0.beginFill(0xff9ba2);
        this.hitBox0.drawRect((this.baseWidth / 2 - 270) * this.widthScale, (this.baseHeight - 72) * this.heightScale, 137.5 * this.widthScale, 96 * this.heightScale);
        this.hitBox0.endFill();
        this.stage.addChild(this.hitBox0);
        this.hitBoxes.push(this.hitBox0);

        this.hitBox1 = new PIXI.Graphics();
        this.hitBox1.alpha = 0.70;
        this.hitBox1.beginFill(0xff9ba2);
        this.hitBox1.drawRect((this.baseWidth / 2 - 132.5) * this.widthScale, (this.baseHeight - 72) * this.heightScale, 137.5 * this.widthScale, 96 * this.heightScale);
        this.hitBox1.endFill();
        this.stage.addChild(this.hitBox1);
        this.hitBoxes.push(this.hitBox1);

        this.hitBox2 = new PIXI.Graphics();
        this.hitBox2.alpha = 0.70;
        this.hitBox2.beginFill(0xff9ba2);
        this.hitBox2.drawRect((this.baseWidth / 2 + 5) * this.widthScale, (this.baseHeight - 72) * this.heightScale, 137.5 * this.widthScale, 96 * this.heightScale);
        this.hitBox2.endFill();
        this.stage.addChild(this.hitBox2);
        this.hitBoxes.push(this.hitBox2);

        this.hitBox3 = new PIXI.Graphics();
        this.hitBox3.alpha = 0.85;
        this.hitBox3.beginFill(0xff9ba2);
        this.hitBox3.drawRect((this.baseWidth / 2 + 142.5) * this.widthScale, (this.baseHeight - 72) * this.heightScale, 137.5 * this.widthScale, 96 * this.heightScale);
        this.hitBox3.endFill();
        this.stage.addChild(this.hitBox3);
        this.hitBoxes.push(this.hitBox3);

        this.barLine = new PIXI.Graphics();
        this.barLine.beginFill(0xff9ba2);
        this.barLine.drawRect((this.baseWidth / 2 - 270) * this.widthScale, (this.baseHeight - 32) * this.heightScale, 550 * this.widthScale, 32 * this.heightScale);
        this.barLine.endFill();
        this.stage.addChild(this.barLine);
        
        this.tiles = [];
        this.holds = [];
        
        this.ticker.add(this.animate);

        this.ticker.start();

        // window.addEventListener('resize', () => {
        //     this.width = window.innerWidth / 2;
        //     this.height = window.innerHeight;

        //     widthScale = (window.innerWidth / 2) / this.baseWidth;
        //     heightScale = window.innerHeight / this.baseHeight;
        
        //     this.renderer.resize(this.width, this.height);
        // });
        
        document.addEventListener('keydown', key => {
            switch (key.keyCode) {
                case 68:
                    if (this.key0 === "up") {
                        this.key0 = "down";
                        return this.keyDown(0);
                    }
                    return;
                case 70:
                    if (this.key1 === "up") {
                        this.key1 = "down";
                        return this.keyDown(1);
                    }
                    return;
                case 74:
                    if (this.key2 === "up") {
                        this.key2 = "down";
                        return this.keyDown(2);
                    }
                    return;
                case 75:
                    if (this.key3 === "up") {
                        this.key3 = "down";
                        return this.keyDown(3);
                    }
                    return;
                default:
                    return;
            }
        });
        
        document.addEventListener('keyup', key => {
            switch (key.keyCode) {
                case 68:
                    this.key0 = "up";
                    return this.keyUp(0);
                case 70:
                    this.key1 = "up";
                    return this.keyUp(1);
                case 74:
                    this.key2 = "up";
                    return this.keyUp(2);
                case 75:
                    this.key3 = "up";
                    return this.keyUp(3);
                default:
                    return;
            }
        });

        setInterval(() => {
            let removedTiles = [];
            let removedHolds = [];

            let catted = this.tiles.concat(this.holds);
            for (let i in catted) {
                if (catted[i].type === "hold") {
                    if (catted[i].sprite.y - 30 > this.renderer.screen.height && catted[i].hit === false) {
                        catted[i].hit = true;
                        this.removeCombo();
                    }

                    if (catted[i].sprite.height <= 30) {
                        removedHolds.push(catted[i]);
                        this.stage.removeChild(this.stage.children[this.stage.children.indexOf(catted[i].sprite)]);
                        this.addCombo();
                        break;
                    }

                    if (catted[i].sprite.y > this.renderer.screen.height - 72) {
                        switch (catted[i].collom) {
                            case 0:
                                if (this.key0 === "down") {
                                    catted[i].sprite.height -= this.speed;
                                    catted[i].sprite.tint = 0xffb0b5;
                                } else {
                                    catted[i].sprite.y += this.speed;
                                    catted[i].sprite.tint = 0xff9ba2;
                                }
                                break; 
                            case 1:
                                if (this.key1 === "down") {
                                    catted[i].sprite.height -= this.speed;
                                    catted[i].sprite.tint = 0xffb0b5;
                                } else {
                                    catted[i].sprite.y += this.speed;
                                    catted[i].sprite.tint = 0xff9ba2;
                                }
                                break; 
                            case 2:
                                if (this.key2 === "down") {
                                    catted[i].sprite.height -= this.speed;
                                    catted[i].sprite.tint = 0xffb0b5;
                                } else {
                                    catted[i].sprite.y += this.speed;
                                    catted[i].sprite.tint = 0xff9ba2;
                                }
                                break; 
                            case 3:
                                if (this.key3 === "down") {
                                    catted[i].sprite.height -= this.speed;
                                    catted[i].sprite.tint = 0xffb0b5;
                                } else {
                                    catted[i].sprite.y += this.speed;
                                    catted[i].sprite.tint = 0xff9ba2;
                                }
                                break;
                            default:
                                catted[i].sprite.y += this.speed;
                                break;
                        }
                    } else {
                        catted[i].sprite.y += this.speed;
                    }

                    if (catted[i].sprite.y - catted[i].sprite.height > this.renderer.screen.height) {
                        this.stage.removeChild(this.stage.children[this.stage.children.indexOf(catted[i].sprite)]);
                        removedHolds.push(catted[i]);
                        this.removeCombo();
                    }
                } else {
                    catted[i].sprite.y += this.speed;
                    if (catted[i].sprite.y - 30 > this.renderer.screen.height) {
                        this.stage.removeChild(this.stage.children[this.stage.children.indexOf(catted[i].sprite)]);
                        removedTiles.push(catted[i]);
                        this.removeCombo();
                    }
                }
                
            }

            for (let i in removedTiles) {
                this.tiles.splice(this.tiles.indexOf(removedTiles[i]), 1);
            }

            for (let i in removedHolds) {
                this.holds.splice(this.holds.indexOf(removedHolds[i]), 1);
            }
        }, 10);

        // setInterval(() => {
        //     let removedTiles = [];

        //     for (var i in this.tiles) {
        //         this.tiles[i].y += this.speed;
        //         if (this.tiles[i].y - 30 > this.renderer.screen.height) {
        //             this.stage.removeChild(this.stage.children[this.stage.children.indexOf(this.tiles[i])]);
        //             removedTiles.push(this.tiles[i]);
        //             if (document.getElementById('score').innerText != "0") this.honk_sound.cloneNode().play();
        //             document.getElementById('score').innerText = "0";
        //         }
        //     }

        //     for (var i in removedTiles) {
        //         this.tiles.splice(this.tiles.indexOf(removedTiles[i]), 1);
        //     }
        // }, 10);

        // setInterval(() => {
        //     let removedHolds = [];

        //     for (var i in this.holds) {
        //         this.holds[i].y += this.speed;
        //         if (this.holds[i].y - 30 > this.renderer.screen.height) {
        //             // this.stage.removeChild(this.stage.children[this.stage.children.indexOf(this.holds[i])]);
        //             // removedHolds.push(this.holds[i]);
        //         }
        //     }

        //     // for (var i in removedHolds) {
        //     //     this.holds.splice(this.holds.indexOf(removedHolds[i]), 1);
        //     // }
        // }, 10);
    }

    addCombo() {
        this.combo += 1;
        this.comboMeter.text = this.combo.toString();

        this.comboMeter.tint = 0xf8ff70;
        this.comboMeter.filters = [new PIXI.filters.BlurFilter(2)];

        setTimeout(() => {
            this.comboMeter.tint = 0xffffff;
            this.comboMeter.filters = [];
        }, 200);
    }

    removeCombo() {
        if (this.combo >= 20) {
            (this.honk_sound.cloneNode() as HTMLAudioElement).play();
            this.combo = 0;
            this.comboMeter.text = this.combo.toString();

            this.comboMeter.tint = 0xf72020;
            this.comboMeter.filters = [new PIXI.filters.BlurFilter(2)];

            setTimeout(() => {
                this.comboMeter.tint = 0xffffff;
                this.comboMeter.filters = [];
            }, 200);
        } else {
            this.combo = 0;
            this.comboMeter.text = this.combo.toString();
        }
    }

    drawTile(pos: number) {
        // const tile = new PIXI.Sprite(PIXI.Texture.from("img/tile.png"));
        const tile: { sprite: PIXI.Sprite, collom: number, type: string, hit: boolean } = { sprite: new PIXI.Sprite(PIXI.Texture.WHITE), collom: -1, type: "tile", hit: false};
        tile.sprite.tint = 0xff9ba2;
        tile.sprite.anchor.x = 0.5;
        tile.sprite.anchor.y = 1;
        tile.sprite.width = 127.5 * this.widthScale;
        tile.sprite.height = 30 * this.heightScale;
        tile.type = "tile";
    
        switch(pos) {
            case 0:
                tile.sprite.x = (this.baseWidth / 2 - 212.5 + 11.25) * this.widthScale;
                tile.sprite.y = 0;
                tile.collom = 0;
                break;
            case 1:
                tile.sprite.x = (this.baseWidth / 2 - 75 + 11.25) * this.widthScale;
                tile.sprite.y = 0;
                tile.collom = 1;
                break;
            case 2:
                tile.sprite.x = (this.baseWidth / 2 + 62.5 + 11.25) * this.widthScale;
                tile.sprite.y = 0;
                tile.collom = 2;
                break;
            case 3:
                tile.sprite.x = (this.baseWidth / 2 + 200 + 11.25) * this.widthScale;
                tile.sprite.y = 0;
                tile.collom = 3;
                break;
            default:
                break;
        }
    
        this.stage.addChild(tile.sprite);
        return tile;
    }

    drawHold(pos: number, length: number) {
        const hold: { sprite: PIXI.Sprite, collom: number, type: string, hit: boolean } = { sprite: new PIXI.Sprite(PIXI.Texture.WHITE), collom: -1, type: "hold", hit: false };
        hold.sprite.tint = 0xff9ba2;
        hold.sprite.anchor.x = 0.5;
        hold.sprite.anchor.y = 1;
        hold.sprite.width = 127.5 * this.widthScale;
        hold.sprite.height = length;   //TODO HOLD LENGTH NOT WORKING SUPER WELL WITH SCALE
    
        switch(pos) {
            case 0:
                hold.sprite.x = (this.baseWidth / 2 - 212.5 + 11.25) * this.widthScale;
                hold.sprite.y = 0;
                hold.collom = 0;
                break;
            case 1:
                hold.sprite.x = (this.baseWidth / 2 - 75 + 11.25) * this.widthScale;
                hold.sprite.y = 0;
                hold.collom = 1;
                break;
            case 2:
                hold.sprite.x = (this.baseWidth / 2 + 62.5 + 11.25) * this.widthScale;
                hold.sprite.y = 0;
                hold.collom = 2;
                break;
            case 3:
                hold.sprite.x = (this.baseWidth / 2 + 200 + 11.25) * this.widthScale;
                hold.sprite.y = 0;
                hold.collom = 3;
                break;
            default:
                break;
        }
    
        this.stage.addChild(hold.sprite);
        return hold;
    }

    keyDown(collom: number) {
        this.hitBoxes[collom].clear();
        this.hitBoxes[collom].beginFill(0xe88f95);
        switch(collom) {
            case 0:
                this.hitBoxes[collom].drawRect((this.baseWidth / 2 - 270) * this.widthScale, (this.baseHeight - 72) * this.heightScale, 137.5 * this.widthScale, 96 * this.heightScale);
                break;
            case 1:
                this.hitBoxes[collom].drawRect((this.baseWidth / 2 - 132.5) * this.widthScale, (this.baseHeight - 72) * this.heightScale, 137.5 * this.widthScale, 96 * this.heightScale);
                break;
            case 2:
                this.hitBoxes[collom].drawRect((this.baseWidth / 2 + 5) * this.widthScale, (this.baseHeight - 72) * this.heightScale, 137.5 * this.widthScale, 96 * this.heightScale);
                break;
            case 3:
                this.hitBoxes[collom].drawRect((this.baseWidth / 2 + 142.5) * this.widthScale, (this.baseHeight - 72) * this.heightScale, 137.5 * this.widthScale, 96 * this.heightScale);
                break;
            default:
                break;
        }
        
        this.hitBoxes[collom].endFill();

        for (let i in this.tiles) {
            if (((this.tiles[i].sprite.y > (this.baseHeight - 72) * this.heightScale) && this.tiles[i].collom === collom) || ((this.tiles[i].sprite.y + (30 * this.heightScale) > (this.baseHeight - 72) * this.heightScale) && this.tiles[i].collom === collom)) {
                let deadTileIndex = this.stage.children.indexOf(this.tiles[i].sprite);
                
                this.tiles.splice(parseInt(i), 1);

                this.addCombo();

                let sound;

                switch (collom) {
                    case 0:
                        sound = this.hit_normal.cloneNode() as HTMLAudioElement;
                        sound.volume = 0.1;
                        sound.play();
                        break;
                    case 1:
                        sound = this.hit_soft.cloneNode() as HTMLAudioElement;
                        sound.volume = 0.1;
                        sound.play();
                        break;
                    case 2:
                        sound = this.hit_normal.cloneNode() as HTMLAudioElement;
                        sound.volume = 0.1;
                        sound.play();
                        break;
                    case 3:
                        sound = this.hit_soft.cloneNode() as HTMLAudioElement;
                        sound.volume = 0.1;
                        sound.play();
                        break;
                    default:
                        break;
                }

                (this.stage.children[deadTileIndex] as PIXI.Graphics).tint = 0xFFFFFF;

                (this.stage.children[deadTileIndex] as PIXI.Graphics).width = 141.525 * this.widthScale;
                (this.stage.children[deadTileIndex] as PIXI.Graphics).height = 33.3 * this.heightScale;
                
                (this.stage.children[deadTileIndex] as PIXI.Graphics).filters = [new PIXI.filters.BlurFilter()];

                let loop = (e: number, tile: PIXI.Graphics) => {
                    setTimeout(() => {
                        tile.alpha = e / 50;
                        e--;
                        if (e > 0) return loop(e, tile);
                        this.stage.removeChild(tile);
                    }, 1);
                }
                loop(40, (this.stage.children[deadTileIndex] as PIXI.Graphics));
            }
        }

        for (let i in this.holds) {
            if ((this.holds[i].sprite.y > (this.baseHeight - 72) * this.heightScale) && this.holds[i].collom === collom && this.holds[i].hit === false) {
                this.holds[i].hit = true;

                this.addCombo();

                let sound;

                switch (collom) {
                    case 0:
                        sound = this.hit_normal.cloneNode() as HTMLAudioElement;
                        sound.volume = 0.1;
                        sound.play();
                        break;
                    case 1:
                        sound = this.hit_soft.cloneNode() as HTMLAudioElement;
                        sound.volume = 0.1;
                        sound.play();
                        break;
                    case 2:
                        sound = this.hit_normal.cloneNode() as HTMLAudioElement;
                        sound.volume = 0.1;
                        sound.play();
                        break;
                    case 3:
                        sound = this.hit_soft.cloneNode() as HTMLAudioElement;
                        sound.volume = 0.1;
                        sound.play();
                        break;
                    default:
                        break;
                }
            }
        }
    }

    keyUp(collom: number) {
        this.hitBoxes[collom].clear();
        this.hitBoxes[collom].beginFill(0xff9ba2);
        switch(collom) {
            case 0:
                this.hitBoxes[collom].drawRect((this.baseWidth / 2 - 270) * this.widthScale, (this.baseHeight - 72) * this.heightScale, 137.5 * this.widthScale, 96 * this.heightScale);
                break;
            case 1:
                this.hitBoxes[collom].drawRect((this.baseWidth / 2 - 132.5) * this.widthScale, (this.baseHeight - 72) * this.heightScale, 137.5 * this.widthScale, 96 * this.heightScale);
                break;
            case 2:
                this.hitBoxes[collom].drawRect((this.baseWidth / 2 + 5) * this.widthScale, (this.baseHeight - 72) * this.heightScale, 137.5 * this.widthScale, 96 * this.heightScale);
                break;
            case 3:
                this.hitBoxes[collom].drawRect((this.baseWidth / 2 + 142.5) * this.widthScale, (this.baseHeight - 72) * this.heightScale, 137.5 * this.widthScale, 96 * this.heightScale);
                break;
            default:
                break;
        }
        this.hitBoxes[collom].endFill();
    }

    animate = () => {
        this.renderer.render(this.stage);
    }
}