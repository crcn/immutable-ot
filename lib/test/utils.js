"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NodeType;
(function (NodeType) {
    NodeType[NodeType["TEXT"] = 0] = "TEXT";
    NodeType[NodeType["ELEMENT"] = 1] = "ELEMENT";
})(NodeType || (NodeType = {}));
;
exports.generateRandomNode = (maxDepth = 5, maxChildren = 5, maxAttributes = 5, currentDepth = 0) => {
    if (Math.round(Math.random())) {
        return {
            type: NodeType.TEXT,
            value: getRandomCharacter()
        };
    }
    return {
        type: NodeType.ELEMENT,
        attributes: Array.from({ length: Math.round(Math.random() * maxAttributes) }).map(() => {
            return { name: getRandomCharacter(), value: getRandomCharacter() };
        }),
        children: currentDepth === maxDepth ? [] : Array.from({ length: Math.round(Math.random() * maxChildren) }).map(() => {
            return exports.generateRandomNode(maxDepth, maxChildren, maxAttributes, currentDepth + 1);
        })
    };
};
const chars = 'abcdefghijklm';
const getRandomCharacter = () => {
    return chars.charAt(Math.floor(Math.random() * chars.length));
};
//# sourceMappingURL=utils.js.map