"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navigation = void 0;
const typedoc_1 = require("typedoc");
const utils_1 = require("../utils");
function navigation(context, props) {
    // Create the navigation for the current page
    // Recurse to children if the parent is some kind of module
    return (typedoc_1.JSX.createElement("nav", { class: "tsd-navigation" },
        link(props.project),
        typedoc_1.JSX.createElement("ul", { class: "tsd-small-nested-navigation" }, props.project.children?.map((c) => typedoc_1.JSX.createElement("li", null, links(c))))));
    function links(mod) {
        const children = (mod.kindOf(typedoc_1.ReflectionKind.SomeModule | typedoc_1.ReflectionKind.Project) && mod.children) || [];
        const nameClasses = (0, utils_1.classNames)({ deprecated: mod.isDeprecated() }, mod.isProject() ? void 0 : context.getReflectionClasses(mod));
        if (!children.length) {
            return link(mod, utils_1.getComment, nameClasses);
        }
        return (typedoc_1.JSX.createElement("details", { class: (0, utils_1.classNames)({ 'tsd-index-accordion': true }, nameClasses), open: inPath(mod), "data-key": mod.getFullName() },
            typedoc_1.JSX.createElement("summary", { class: "tsd-accordion-summary" },
                context.icons.chevronDown(),
                link(mod)),
            typedoc_1.JSX.createElement("div", { class: "tsd-accordion-details" },
                typedoc_1.JSX.createElement("ul", { class: "tsd-nested-navigation" }, children.map((c) => (typedoc_1.JSX.createElement("li", null, links(c))))))));
    }
    function link(child, fn = utils_1.getComment, nameClasses) {
        let sectionName;
        if (child.kind === typedoc_1.ReflectionKind.Module) {
            const splitPath = (0, utils_1.getDisplayName)(child).split('/');
            sectionName = KebabToCamel(splitPath[splitPath.length - 1]);
        }
        else {
            sectionName = (0, utils_1.getDisplayName)(child);
        }
        return (typedoc_1.JSX.createElement("a", { href: context.urlTo(child), class: (0, utils_1.classNames)({ current: child === props.model }, nameClasses) },
            context.icons[child.kind](),
            typedoc_1.JSX.createElement("div", null,
                (0, utils_1.wbr)(sectionName),
                fn(child))));
    }
    function inPath(mod) {
        let iter = props.model;
        do {
            if (iter == mod)
                return true;
            iter = iter.parent;
        } while (iter);
        return false;
    }
    function KebabToCamel(str) {
        let arr = str.split('-');
        let capital = arr.map((item, index) => index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase());
        // ^-- change here.
        let capitalString = capital.join('');
        return capitalString[0].toUpperCase() + capitalString.slice(1);
    }
}
exports.navigation = navigation;
