"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageSidebar = void 0;
const typedoc_1 = require("typedoc");
function pageSidebar(context, props) {
    return (typedoc_1.JSX.createElement(typedoc_1.JSX.Fragment, null, context.pageNavigation(props)));
}
exports.pageSidebar = pageSidebar;
