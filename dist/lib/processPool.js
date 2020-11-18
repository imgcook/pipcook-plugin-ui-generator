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
const cluster_1 = __importDefault(require("cluster"));
const COUNTDOWN = 'countdown';
exports.default = (processFn, numCPUs) => __awaiter(void 0, void 0, void 0, function* () {
    if (!cluster_1.default.isMaster) {
        console.log(`Worker ${process.pid} started`);
        yield processFn();
        process.send(COUNTDOWN);
        return process.exit(0);
    }
    else {
        for (let i = 0; i < numCPUs; i += 1) {
            cluster_1.default.fork();
        }
        return new Promise(resolve => {
            let count = numCPUs;
            cluster_1.default.on('message', (_worker, msg) => {
                if (msg === COUNTDOWN) {
                    count -= 1;
                    if (count === 0) {
                        resolve();
                    }
                }
            });
        });
    }
});
//# sourceMappingURL=processPool.js.map