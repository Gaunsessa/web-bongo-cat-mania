import { Game } from "./game";
import { Bongo } from "./bongo";
import { OsuMap } from "./osuMap";

let game = new Game();
let bongo = new Bongo();

document.getElementById('fileInput')!.addEventListener('change', event => {
    let osuMap = new OsuMap((event.target as HTMLInputElement).files![0]);

    waitStartGame(osuMap);
});

function waitStartGame(osuMap: OsuMap) {
    setTimeout(() => {
        if (osuMap.difficulties != []) {
            let diffsText = "";
            for (let i in osuMap.difficulties) {
                diffsText += `[${i}] ${osuMap.difficulties[i]}\n`;
            }
            document.getElementById("diffs")!.innerText = diffsText;
            console.log(diffsText);

            osuMap.getZipFile(osuMap.difficulties[1], "string").then((diff: string) => {
                osuMap.mapOsu = diff;

                osuMap.parse().then(() => {
                    let offset = Math.abs(parseInt(Object.keys(osuMap.hitObjects)[0]) - 750 * game.heightScale);

                    setTimeout(() => {
                        osuMap.song.play();
                    }, offset);

                    for (let i in osuMap.hitObjects) {
                        spawn(i, osuMap.hitObjects[i], offset);
                    }
                });
            });
        } else {
            waitStartGame(osuMap);
        }
    }, 500);
}

function spawn(timeout: string, hitObjects: Array<{ x: string, y: string, type: string, hitSound: string, objectParams: string, holdLength: number }>, offset: number) {
    let timeout2 = (parseInt(timeout) - 750 * game.heightScale) + offset;

    setTimeout(function() {
        for (let i in hitObjects) {
            if (hitObjects[i].holdLength === 0) {
                switch (hitObjects[i].x) {
                    case "64":
                        game.tiles.push(game.drawTile(0));
                        break; 
                    case "192":
                        game.tiles.push(game.drawTile(1));
                        break; 
                    case "320":
                        game.tiles.push(game.drawTile(2));
                        break; 
                    case "448":
                        game.tiles.push(game.drawTile(3));
                        break; 
                }
            } else {
                let length;
                if ((Math.sign(parseInt(timeout)) === 0) || (parseInt(timeout) < 750 * game.heightScale)) {
                    length = (((hitObjects[i].holdLength - 750 * game.heightScale)) * 1.2) * game.heightScale;
                } else {
                    length = (((hitObjects[i].holdLength - parseInt(timeout))) * 1.2) * game.heightScale;
                }

                //TODO HOLD SHIT KINDA JIGGLES MAYBE MAKE MULTI THREADED

                switch (hitObjects[i].x) {
                    case "64":
                        game.holds.push(game.drawHold(0, length));
                        break; 
                    case "192":
                        game.holds.push(game.drawHold(1, length));
                        break; 
                    case "320":
                        game.holds.push(game.drawHold(2, length));
                        break; 
                    case "448":
                        game.holds.push(game.drawHold(3, length));
                        break; 
                }
            }
        }
    }, timeout2);
}