"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LPWebsite = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("@khanonjs/engine");
console.log('aki STARTING APP???');
let LPWebsite = class LPWebsite extends engine_1.AppInterface {
    onStart() {
        // Entrypoint of your application
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
exports.LPWebsite = LPWebsite = tslib_1.__decorate([
    (0, engine_1.App)({
        name: 'Khanon.js blank project',
        loopUpdate: {
            fps: 165
        }
    })
], LPWebsite);
//# sourceMappingURL=app.js.map