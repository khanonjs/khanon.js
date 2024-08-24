"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLayout = void 0;
const typedoc_1 = require("typedoc");
const utils_1 = require("./utils");
const defaultLayout = (context, template, props) => {
    return (typedoc_1.JSX.createElement("html", { class: "default", lang: context.options.getValue('htmlLang') },
        typedoc_1.JSX.createElement("head", null,
            typedoc_1.JSX.createElement("meta", { charSet: "utf-8" }),
            context.hook('head.begin'),
            typedoc_1.JSX.createElement("meta", { "http-equiv": "x-ua-compatible", content: "IE=edge" }),
            typedoc_1.JSX.createElement("title", null, props.model.isProject()
                ? (0, utils_1.getDisplayName)(props.model)
                : `${(0, utils_1.getDisplayName)(props.model)} | ${(0, utils_1.getDisplayName)(props.project)}`),
            typedoc_1.JSX.createElement("meta", { name: "description", content: 'Documentation for ' + props.project.name }),
            typedoc_1.JSX.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
            typedoc_1.JSX.createElement("link", { rel: "stylesheet", href: context.relativeURL('assets/style.css', true) }),
            typedoc_1.JSX.createElement("link", { rel: "stylesheet", href: context.relativeURL('assets/highlight.css', true) }),
            typedoc_1.JSX.createElement("link", { rel: "stylesheet", href: context.relativeURL('assets/my-theme.css') }),
            context.options.getValue('customCss') && (typedoc_1.JSX.createElement("link", { rel: "stylesheet", href: context.relativeURL('assets/custom.css', true) })),
            typedoc_1.JSX.createElement("script", { defer: true, src: context.relativeURL('assets/main.js', true) }),
            typedoc_1.JSX.createElement("script", { async: true, src: context.relativeURL('assets/search.js', true), id: "search-script" }),
            typedoc_1.JSX.createElement("script", { async: true, src: context.relativeURL('assets/navigation.js', true), id: "tsd-nav-script" }),
            context.hook('head.end')),
        typedoc_1.JSX.createElement("body", null,
            context.hook('body.begin'),
            typedoc_1.JSX.createElement("script", null,
                typedoc_1.JSX.createElement(typedoc_1.JSX.Raw, { html: 'document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"' })),
            context.toolbar(props),
            typedoc_1.JSX.createElement("div", { class: (0, utils_1.classNames)({
                    container: true,
                    'container-main': true,
                }) },
                typedoc_1.JSX.createElement("div", { class: "col-content" },
                    context.hook('content.begin'),
                    context.header(props),
                    template(props),
                    context.hook('content.end')),
                typedoc_1.JSX.createElement("div", { class: "col-sidebar" },
                    typedoc_1.JSX.createElement("div", { class: "page-menu" },
                        context.hook('pageSidebar.begin'),
                        context.pageSidebar(props),
                        context.hook('pageSidebar.end')),
                    typedoc_1.JSX.createElement("div", { class: "site-menu" },
                        context.hook('sidebar.begin'),
                        context.sidebar(props),
                        context.hook('sidebar.end')))),
            context.footer(),
            typedoc_1.JSX.createElement("div", { class: "overlay" }),
            context.analytics(),
            context.iconsCache(),
            context.hook('body.end'))));
};
exports.defaultLayout = defaultLayout;
