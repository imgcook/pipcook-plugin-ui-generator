"use strict";
/**
 * @file This plugin is to object detection data from coco format. Make sure that
 * the data is conform to expectation.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs = __importStar(require("fs-extra"));
const imageDetectionDataCollect = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, totalNum = 1000, dataDir } = args;
    yield fs.ensureDir(dataDir);
    if (!url || !totalNum)
        return console.log('这些参数必选：type, url, totalNum');
    const cmd = child_process_1.spawn('node', [__dirname + '/lib/gen.js', totalNum, url, dataDir + '/train']);
    cmd.stdout.on('data', data => {
        console.log(data.toString().trim());
    });
    cmd.stderr.on('data', data => {
        console.error(data.toString().trim());
    });
    return new Promise(resolve => {
        cmd.on('close', () => {
            resolve();
        });
    });
});
exports.default = imageDetectionDataCollect;
//# sourceMappingURL=index.js.map