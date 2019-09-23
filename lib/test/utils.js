"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NodeType;
(function (NodeType) {
    NodeType[NodeType["TEXT"] = 0] = "TEXT";
    NodeType[NodeType["ELEMENT"] = 1] = "ELEMENT";
})(NodeType || (NodeType = {}));
;
exports.generateRandomNode = function (maxDepth, maxChildren, maxAttributes, currentDepth) {
    if (maxDepth === void 0) { maxDepth = 5; }
    if (maxChildren === void 0) { maxChildren = 5; }
    if (maxAttributes === void 0) { maxAttributes = 5; }
    if (currentDepth === void 0) { currentDepth = 0; }
    if (Math.round(Math.random())) {
        return {
            type: NodeType.TEXT,
            value: getRandomCharacter()
        };
    }
    return {
        type: NodeType.ELEMENT,
        attributes: Array.from({ length: Math.round(Math.random() * maxAttributes) }).map(function () {
            return { name: getRandomCharacter(), value: getRandomCharacter() };
        }),
        children: currentDepth === maxDepth ? [] : Array.from({ length: Math.round(Math.random() * maxChildren) }).map(function () {
            return exports.generateRandomNode(maxDepth, maxChildren, maxAttributes, currentDepth + 1);
        })
    };
};
var chars = 'abcdefghijklm';
var getRandomCharacter = function () {
    return chars.charAt(Math.floor(Math.random() * chars.length));
};
//# sourceMappingURL=utils.js.map