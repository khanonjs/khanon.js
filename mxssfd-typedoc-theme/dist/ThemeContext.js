"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeContext = void 0;
const typedoc_1 = require("typedoc");
const templates = require("./templates");
function bind(fn, first) {
    return (...r) => fn(first, ...r);
}
class ThemeContext extends typedoc_1.DefaultThemeRenderContext {
    constructor(theme, page, options) {
        super(theme, page, options);
        this.init();
    }
    init() {
        for (const [key, tpl] of Object.entries(templates)) {
            this[key] = bind(tpl, this);
        }
    }
}
exports.ThemeContext = ThemeContext;
