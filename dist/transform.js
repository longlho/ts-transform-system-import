"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
function getRequirePath(node) {
    let expression;
    if (node.kind !== ts.SyntaxKind.CallExpression ||
        !(expression = node.expression) ||
        expression.kind !== ts.SyntaxKind.PropertyAccessExpression ||
        expression.expression.getText() !== 'System' ||
        expression.name.getText() !== 'import') {
        return null;
    }
    return node.arguments[0].getText();
}
/**
 * Create Promise.resolve(require(path))
 * @param path
 */
function createPromisifiedRequire(path) {
    const node = ts.createNode(ts.SyntaxKind.ExpressionStatement);
    node.expression = ts.createNode(ts.SyntaxKind.CallExpression);
    const promiseNode = node.expression.expression = ts.createNode(ts.SyntaxKind.PropertyAccessExpression);
    promiseNode.expression = ts.createNode(ts.SyntaxKind.Identifier);
    promiseNode.expression.text = 'Promise';
    promiseNode.name = ts.createNode(ts.SyntaxKind.Identifier);
    promiseNode.name.text = 'resolve';
    const arg = ts.createNode(ts.SyntaxKind.CallExpression);
    arg.expression = ts.createNode(ts.SyntaxKind.Identifier);
    arg.expression.text = 'require';
    arg.arguments = [ts.createNode(ts.SyntaxKind.Identifier)];
    arg.arguments[0].text = path;
    node.expression.arguments.push(arg);
    return node;
}
function default_1() {
    return (ctx) => {
        const visitor = (node) => {
            const requirePath = getRequirePath(node);
            if (!requirePath) {
                return ts.visitEachChild(node, visitor, ctx);
            }
            return createPromisifiedRequire(requirePath);
        };
        return (sf) => ts.visitNode(sf, visitor);
    };
}
exports.default = default_1;
