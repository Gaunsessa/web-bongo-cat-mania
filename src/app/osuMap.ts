import * as JSZip from "jszip";

export class OsuMap {
    mapFile: File;
    zip!: JSZip;

    mapOsu: string;
    song: HTMLAudioElement;

    difficulties: Array<string>;

    general: { [key: string]: string };
    editor: object;
    metadata: object;
    difficulty: object;
    events: object;
    timingPoints: object;
    hitObjects: { [time: string]: Array<{ x: string, y: string, type: string, hitSound: string, objectParams: string, holdLength: number }> };

    constructor(mapFile: File) {
        this.mapFile = mapFile;
        this.difficulties = [];
        
        this.openZip().then(() => {
            this.getDifficulties().then(diffs => {
                this.difficulties = diffs;
            });
        });

        this.mapOsu = "";
        this.song = document.getElementById("Song")! as HTMLAudioElement;
        this.song.volume = 0.1;

        this.general = {};
        this.editor = {};
        this.metadata = {}
        this.difficulty = {};
        this.events = {};
        this.timingPoints = {};
        this.hitObjects = {};
    }

    getZipFile(fileName: string, type: JSZip.OutputType) {
        return new Promise<string>((res, rej) => {
            this.zip!.forEach((_: string, zipEntry: JSZip.JSZipObject) => {
                if (zipEntry.name === fileName) {
                    zipEntry.async(type)
                        .then(content => {
                            res(content as string);
                        });
                }
            });
        });
    }

    openZip() {
        return new Promise<JSZip>((res, rej) => {
            JSZip.loadAsync(this.mapFile)
                .then(zip => {
                    this.zip = zip as JSZip;
                    res();
                });
        });
    }

    async getDifficulties() {
        let fileNames = await this.getZipFileNames();
        let difficulties = [];

        for (let i in fileNames) {
            if (fileNames[i].includes(".osu")) {
                difficulties.push(fileNames[i]);
            }
        }

        return difficulties;
    }

    getZipFileNames() {
        return new Promise<Array<string>>((res, rej) => {
            let fileNames: Array<string> = [];

            this.zip!.forEach((_: string, zipEntry: JSZip.JSZipObject) => {
                fileNames.push(zipEntry.name);
            });
            res(fileNames);
        });
    }

    async parse() {
        let data = this.mapOsu;
        
        this.general = this.parseFeild(data, "[General]", "[Editor]");
        this.editor = this.parseFeild(data, "[Editor]", "[Metadata]");
        this.metadata = this.parseFeild(data, "[Metadata]", "[Difficulty]");
        this.difficulty = this.parseFeild(data, "[Difficulty]", "[Events]");
        
        this.hitObjects = this.parseHitObjects(data);

        this.song.src = URL.createObjectURL(await this.getZipFile(this.general.AudioFilename, "blob"));
    }

    parseHitObjects(fullData: string) {
        let start = fullData.search(rEsc("[HitObjects]"));
        let end = fullData.split("").length;

        let data = fullData.substring(start, end).slice(0, -1);
        let lines = data.split("\n");
        // lines.pop();
        lines.shift();

        let returnData: { [time: string]: Array<{ x: string, y: string, type: string, hitSound: string, objectParams: string, holdLength: number }> } = {};

        for (let i in lines) {
            let perms = lines[i].split(",");
            let holdLength = 0;

            if (/\d+:\d+:\d+:\d+:\d+:/.test(perms[5])) {
                holdLength = parseInt(/\d+/.exec(perms[5])![0]);
            }
            
            if (!(perms[2] in returnData)) {
                returnData[perms[2]] = [];
                returnData[perms[2]].push({"x": perms[0], "y": perms[1], "type": perms[3], "hitSound": perms[4], "objectParams": perms[5], "holdLength": holdLength});
            } else {
                returnData[perms[2]].push({"x": perms[0], "y": perms[1], "type": perms[3], "hitSound": perms[4], "objectParams": perms[5], "holdLength": holdLength});
            }

            //TODO ADD CUSTOM SOUNDS AND NORMAL SOUNDS

            // console.log(returnData[perms[2]]);
        }

        return returnData;
    }

    parseFeild(fullData: string, startKey: string, endKey: string) {
        let start = fullData.search(rEsc(startKey));
        let end = fullData.search(rEsc(endKey));

        let data = fullData.substring(start, end).slice(0, -1);
        let lines = data.split("\n");
        lines.pop();
        lines.shift();

        let returnData: { [key: string]: string } = {};

        for (let i in lines) {
            let propData = this.getProperty(lines[i]);
            returnData[propData["key"]] = propData["value"];
        }

        return returnData;
    }

    getProperty(string: string) {
        let chars = string.split("");
        chars.pop();

        let key = "";
        let value = "";

        let cMode = "key";

        for (let i in chars) {
            if (chars[i] != ":") {
                if (cMode === "key") {
                    key += chars[i];
                } else {
                    value += chars[i];
                }
            } else {
                cMode = "value";
            }
        }

        if (value.split("")[0] === " ") {
            value = value.substring(1);
        }

        return {"key": key, "value": value};
    }

    getText() {
        return new Promise((res, rej) => {
            let reader = new FileReader();

            reader.onload = event => {
                res(event.target!.result);
            }

            reader.readAsText(this.mapFile);
        });
    }
}

function rEsc(text: string) {
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}