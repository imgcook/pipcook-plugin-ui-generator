"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const os_1 = __importDefault(require("os"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const json2xml_1 = __importDefault(require("./json2xml"));
const processPool_1 = __importDefault(require("./processPool"));
const numCPUs = Math.min(4, os_1.default.cpus().length);
const numCuncurrentPage = 5;
const gen = ({ totalNum, url, dirPrefix = '', vw = 2000, vh = 3000 }) => __awaiter(void 0, void 0, void 0, function* () {
    if (fs_1.default.existsSync(dirPrefix))
        fs_1.default.rmdirSync(dirPrefix, { recursive: true });
    fs_1.default.mkdirSync(dirPrefix, { recursive: true });
    const genOnPage = (p) => __awaiter(void 0, void 0, void 0, function* () {
        yield p.evaluate('window.update()');
        const json = yield p.evaluate('window.json');
        const { width, height } = json.annotation.size;
        if (width > vw || height > vh) {
            console.warn('图片超出 Viewport 范围了', width, height);
            yield genOnPage(p);
            return;
        }
        const filename = uuid_1.v4();
        json.annotation.filename = `${filename}.jpg`;
        fs_1.default.writeFile(`${dirPrefix}/${filename}.xml`, json2xml_1.default(json), d => d);
        yield p.screenshot({
            path: `${dirPrefix}/${filename}.jpg`,
            type: 'jpeg',
            quality: Math.min(100, Math.round(120000 / width)),
            clip: {
                x: 0, y: 0, width, height,
            },
        });
    });
    const genOnBrowser = (numPerBrowser) => __awaiter(void 0, void 0, void 0, function* () {
        const numPerPage = Math.ceil(numPerBrowser / numCuncurrentPage);
        const browser = yield puppeteer_1.default.launch({ headless: true, args: ['--no-sandbox'] });
        yield Promise.all(Array.from({ length: numCuncurrentPage }).map((_, pageIndex) => __awaiter(void 0, void 0, void 0, function* () {
            const p = yield browser.newPage();
            yield p.setViewport({ width: vw, height: vh, deviceScaleFactor: 1 });
            yield p.setDefaultNavigationTimeout(10000000);
            yield p.setCacheEnabled(false);
            yield p.goto(url, { waitUntil: 'networkidle2' });
            yield p.waitForFunction('window.update');
            for (let i = 0; i < numPerPage; i += 1) {
                yield genOnPage(p);
                console.log(`进程 ${process.pid} 的页面 ${pageIndex} 生成了 ${i + 1} 张图片`);
            }
            ;
        })));
        yield browser.close();
    });
    const start = new Date().getTime();
    yield processPool_1.default(() => genOnBrowser(Math.ceil(totalNum / numCPUs)), numCPUs);
    // await genOnBrowser();
    const time = (new Date().getTime() - start) / 1000;
    console.log('用时：', time);
});
const args = process.argv.slice(2);
gen({ totalNum: Number(args[0]), url: args[1], dirPrefix: args[2] });
//# sourceMappingURL=gen.js.map