"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = load;
const fs_1 = require("fs");
const path_1 = require("path");
const MyTheme_1 = require("./MyTheme");
const typedoc_1 = require("typedoc");
/**
 * Called by TypeDoc when loading this theme as a plugin. Should be used to define themes which
 * can be selected by the user.
 */
function load(app) {
    // Hooks can be used to inject some HTML without fully overwriting the theme.
    app.renderer.hooks.on('body.begin', (_) => (typedoc_1.JSX.createElement("script", null,
        typedoc_1.JSX.createElement(typedoc_1.JSX.Raw, { html: "console.log(`Loaded ${location.href}`)" }))));
    app.renderer.on(typedoc_1.RendererEvent.END, () => {
        const moveList = [
            ['style.css', 'my-theme.css'],
            ['onload.js', 'onload.js'],
        ];
        moveList.forEach(([from, to]) => (0, fs_1.cpSync)((0, path_1.resolve)(__dirname, '../assets', from), (0, path_1.resolve)(app.options.getValue('out'), 'assets', to)));
    });
    app.renderer.defineTheme('my-theme', MyTheme_1.MyTheme);
}
