"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LPWebsite = void 0;
const engine_1 = require("@khanonjs/engine");
let LPWebsite = class LPWebsite extends engine_1.AppInterface {
    onStart() {
        // Entrypoint
        engine_1.Logger.trace('App onStart');
    }
    onClose() {
        engine_1.Logger.trace('App onClose');
    }
    onError(error) {
        engine_1.Logger.error('App onError:', error);
    }
};
exports.LPWebsite = LPWebsite;
exports.LPWebsite = LPWebsite = __decorate([
    (0, engine_1.App)({
        name: 'Khanon.js blank project',
        loopUpdate: {
            fps: 165
        }
    })
], LPWebsite);
