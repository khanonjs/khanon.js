"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageNavigation = void 0;
const typedoc_1 = require("typedoc");
const utils_1 = require("../utils");
function pageNavigation(context, props) {
    const levels = [[]];
    function finalizeLevel() {
        const built = (typedoc_1.JSX.createElement("ul", null, levels.pop().map((l) => (typedoc_1.JSX.createElement("li", null, l)))));
        levels[levels.length - 1].push(built);
    }
    for (const heading of props.pageHeadings) {
        const inferredLevel = heading.level ? heading.level + 1 : 1;
        while (inferredLevel < levels.length) {
            finalizeLevel();
        }
        if (inferredLevel > levels.length) {
            // Lower level than before
            levels.push([]);
        }
        levels[levels.length - 1].push(typedoc_1.JSX.createElement("a", { href: heading.link, class: heading.classes },
            heading.kind && context.icons[heading.kind](),
            typedoc_1.JSX.createElement("span", null, (0, utils_1.wbr)(heading.text))));
    }
    while (levels.length > 1) {
        finalizeLevel();
    }
    if (!levels[0].length) {
        return typedoc_1.JSX.createElement(typedoc_1.JSX.Fragment, null);
    }
    return (typedoc_1.JSX.createElement("details", { open: true, class: "tsd-index-accordion tsd-page-navigation" },
        typedoc_1.JSX.createElement("summary", { class: "tsd-accordion-summary" },
            typedoc_1.JSX.createElement("h3", null,
                context.icons.chevronDown(),
                "On This Page")),
        typedoc_1.JSX.createElement("div", { class: "tsd-accordion-details" },
            typedoc_1.JSX.createElement("ul", null, levels[0].map((l) => (typedoc_1.JSX.createElement("li", null, l)))))));
}
exports.pageNavigation = pageNavigation;
