"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = settings;
const typedoc_1 = require("typedoc");
function buildFilterItem(context, name, displayName, defaultValue) {
    return (typedoc_1.JSX.createElement("li", { class: "tsd-filter-item" },
        typedoc_1.JSX.createElement("label", { class: "tsd-filter-input" },
            typedoc_1.JSX.createElement("input", { type: "checkbox", id: `tsd-filter-${name}`, name: name, checked: defaultValue }),
            context.icons.checkbox(),
            typedoc_1.JSX.createElement("span", null, displayName))));
}
const flagOptionNameToReflectionFlag = {
    protected: typedoc_1.ReflectionFlag.Protected,
    private: typedoc_1.ReflectionFlag.Private,
    external: typedoc_1.ReflectionFlag.External,
    inherited: typedoc_1.ReflectionFlag.Inherited,
};
function settings(context) {
    const defaultFilters = context.options.getValue('visibilityFilters');
    const visibilityOptions = [];
    for (const key of Object.keys(defaultFilters)) {
        if (key.startsWith('@')) {
            const filterName = key
                .substring(1)
                .replace(/([a-z])([A-Z])/g, '$1-$2')
                .toLowerCase();
            visibilityOptions.push(buildFilterItem(context, filterName, context.internationalization.translateTagName(key), defaultFilters[key]));
        }
        else if ((key === 'protected' && !context.options.getValue('excludeProtected')) ||
            (key === 'private' && !context.options.getValue('excludePrivate')) ||
            (key === 'external' && !context.options.getValue('excludeExternals')) ||
            key === 'inherited') {
            visibilityOptions.push(buildFilterItem(context, key, context.internationalization.flagString(flagOptionNameToReflectionFlag[key]), defaultFilters[key]));
        }
    }
    // Settings panel above navigation
    return (typedoc_1.JSX.createElement("div", { class: "tsd-navigation settings" },
        typedoc_1.JSX.createElement("details", { class: "tsd-accordion", open: false },
            typedoc_1.JSX.createElement("summary", { class: "tsd-accordion-summary" },
                typedoc_1.JSX.createElement("h3", null,
                    context.i18n.theme_settings(),
                    context.icons.chevronDown())),
            typedoc_1.JSX.createElement("div", { class: "tsd-accordion-details" },
                visibilityOptions.length && (typedoc_1.JSX.createElement("div", { class: "tsd-filter-visibility" },
                    typedoc_1.JSX.createElement("span", { class: "settings-label" }, context.i18n.theme_member_visibility()),
                    typedoc_1.JSX.createElement("ul", { id: "tsd-filter-options" }, ...visibilityOptions))),
                typedoc_1.JSX.createElement("div", { class: "tsd-theme-toggle" },
                    typedoc_1.JSX.createElement("label", { class: "settings-label", for: "tsd-theme" }, context.i18n.theme_theme()),
                    typedoc_1.JSX.createElement("select", { id: "tsd-theme" },
                        typedoc_1.JSX.createElement("option", { value: "os" }, context.i18n.theme_os()),
                        typedoc_1.JSX.createElement("option", { value: "light" }, context.i18n.theme_light()),
                        typedoc_1.JSX.createElement("option", { value: "dark" }, context.i18n.theme_dark())))))));
}
