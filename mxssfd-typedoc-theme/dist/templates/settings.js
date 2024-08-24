"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
const typedoc_1 = require("typedoc");
function camelToTitleCase(text) {
    return (text.substring(0, 1).toUpperCase() +
        text.substring(1).replace(/[a-z][A-Z]/g, (x) => `${x[0]} ${x[1]}`));
}
function buildFilterItem(context, name, displayName, defaultValue) {
    return (typedoc_1.JSX.createElement("li", { class: "tsd-filter-item" },
        typedoc_1.JSX.createElement("label", { class: "tsd-filter-input" },
            typedoc_1.JSX.createElement("input", { type: "checkbox", id: `tsd-filter-${name}`, name: name, checked: defaultValue }),
            context.icons.checkbox(),
            typedoc_1.JSX.createElement("span", null, displayName))));
}
function settings(context) {
    const defaultFilters = context.options.getValue('visibilityFilters');
    const visibilityOptions = [];
    for (const key of Object.keys(defaultFilters)) {
        if (key.startsWith('@')) {
            const filterName = key
                .substring(1)
                .replace(/([a-z])([A-Z])/g, '$1-$2')
                .toLowerCase();
            visibilityOptions.push(buildFilterItem(context, filterName, camelToTitleCase(key.substring(1)), defaultFilters[key]));
        }
        else if ((key === 'protected' && !context.options.getValue('excludeProtected')) ||
            (key === 'private' && !context.options.getValue('excludePrivate')) ||
            (key === 'external' && !context.options.getValue('excludeExternals')) ||
            key === 'inherited') {
            visibilityOptions.push(buildFilterItem(context, key, camelToTitleCase(key), defaultFilters[key]));
        }
    }
    // Settings panel above navigation
    return (typedoc_1.JSX.createElement("div", { class: "tsd-navigation settings" },
        typedoc_1.JSX.createElement("details", { class: "tsd-index-accordion", open: false },
            typedoc_1.JSX.createElement("summary", { class: "tsd-accordion-summary" },
                typedoc_1.JSX.createElement("h3", null,
                    context.icons.chevronDown(),
                    "SET")),
            typedoc_1.JSX.createElement("div", { class: "tsd-accordion-details" },
                visibilityOptions.length && (typedoc_1.JSX.createElement("div", { class: "tsd-filter-visibility" },
                    typedoc_1.JSX.createElement("h4", { class: "uppercase" }, "Member Visibility"),
                    typedoc_1.JSX.createElement("form", null,
                        typedoc_1.JSX.createElement("ul", { id: "tsd-filter-options" }, ...visibilityOptions)))),
                typedoc_1.JSX.createElement("div", { class: "tsd-theme-toggle" },
                    typedoc_1.JSX.createElement("h4", { class: "uppercase" }, "Theme"),
                    typedoc_1.JSX.createElement("select", { id: "tsd-theme" },
                        typedoc_1.JSX.createElement("option", { value: "os" }, "OS"),
                        typedoc_1.JSX.createElement("option", { value: "light" }, "Light"),
                        typedoc_1.JSX.createElement("option", { value: "dark" }, "Dark")))))));
}
exports.settings = settings;
