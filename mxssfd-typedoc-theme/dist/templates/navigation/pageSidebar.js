"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageSidebar = pageSidebar;
const typedoc_1 = require("typedoc");
function pageSidebar(context, props) {
    return (typedoc_1.JSX.createElement(typedoc_1.JSX.Fragment, null, context.pageNavigation(props)));
}
