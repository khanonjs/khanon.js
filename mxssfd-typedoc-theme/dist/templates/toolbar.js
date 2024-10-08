"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolbar = void 0;
const typedoc_1 = require("typedoc");
const toolbar = (context, props) => (typedoc_1.JSX.createElement("header", { class: "tsd-page-toolbar" },
    typedoc_1.JSX.createElement("div", { class: "tsd-toolbar-contents container" },
        typedoc_1.JSX.createElement("div", { class: "table-cell", id: "tsd-search", "data-base": context.relativeURL('./') },
            typedoc_1.JSX.createElement("div", { class: "field" },
                typedoc_1.JSX.createElement("label", { for: "tsd-search-field", class: "tsd-widget tsd-toolbar-icon search no-caption" }, context.icons.search()),
                typedoc_1.JSX.createElement("input", { type: "text", id: "tsd-search-field", "aria-label": context.i18n.theme_search() })),
            typedoc_1.JSX.createElement("div", { class: "field" },
                typedoc_1.JSX.createElement("div", { id: "tsd-toolbar-links" }, Object.entries(context.options.getValue('navigationLinks')).map(([label, url]) => (typedoc_1.JSX.createElement("a", { href: url }, label))))),
            typedoc_1.JSX.createElement("ul", { class: "results" },
                typedoc_1.JSX.createElement("li", { class: "state loading" }, context.i18n.theme_preparing_search_index()),
                typedoc_1.JSX.createElement("li", { class: "state failure" }, context.i18n.theme_search_index_not_available())),
            typedoc_1.JSX.createElement("a", { href: context.options.getValue('titleLink') || context.relativeURL('index.html'), class: "title" },
                props.project.name,
                " - v",
                props.project.packageVersion),
            context.settings()),
        typedoc_1.JSX.createElement("div", { class: "table-cell", id: "tsd-widgets" },
            typedoc_1.JSX.createElement("a", { href: "#", class: "tsd-widget tsd-toolbar-icon menu no-caption", "data-toggle": "menu", "aria-label": context.i18n.theme_menu() }, context.icons.menu())))));
exports.toolbar = toolbar;
