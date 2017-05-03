import * as ts from 'typescript'

export type GenerateScopedNameFn = (name: string, filepath: string, css: string) => string

/**
 * Primarily from https://github.com/css-modules/css-modules-require-hook
 *
 * @export
 * @interface Opts
 */
export interface Opts {
    generateFilePath?(filename: string): string
    threshold?: number
}

function getRequirePath (node: ts.Node): string {
    let expression
    if (
        node.kind !== ts.SyntaxKind.CallExpression ||
        !(expression = ((node as ts.CallExpression).expression as ts.PropertyAccessExpression)) ||
        expression.kind !== ts.SyntaxKind.PropertyAccessExpression ||
        expression.expression.getText() !== 'System' ||
        expression.name.getText() !== 'import'
    ) {
        return null
    }

    return (node as ts.CallExpression).arguments[0].getText()
}

/**
 * Create Promise.resolve(require(path))
 * @param path
 */
function createPromisifiedRequire (path: string): ts.Node {
    const node = ts.createNode(ts.SyntaxKind.CallExpression) as ts.CallExpression

    // Create Require Node
    const requireNode = ts.createNode(ts.SyntaxKind.CallExpression) as ts.CallExpression
    requireNode.expression = ts.createNode(ts.SyntaxKind.Identifier) as ts.Identifier
    (requireNode.expression as ts.Identifier).text = 'require'
    requireNode.arguments = [ts.createNode(ts.SyntaxKind.Identifier) as ts.Identifier] as ts.NodeArray<ts.Identifier>
    ;(requireNode.arguments[0] as ts.Identifier).text = path

    // Create promise node
    const promiseNode = ts.createNode(ts.SyntaxKind.PropertyAccessExpression) as ts.PropertyAccessExpression
    promiseNode.expression = ts.createNode(ts.SyntaxKind.Identifier) as ts.Identifier
    (promiseNode.expression as ts.Identifier).text = 'Promise'
    promiseNode.name = ts.createNode(ts.SyntaxKind.Identifier) as ts.Identifier
    (promiseNode.name as ts.Identifier).text = 'resolve'

    ;(node as ts.CallExpression).expression = promiseNode

    ;(node as ts.CallExpression).arguments = [requireNode] as ts.NodeArray<ts.CallExpression>

    return node
}

export default function () {
    return (ctx: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
        const visitor: ts.Visitor = (node: ts.Node): ts.Node => {
            const requirePath = getRequirePath(node)
            if (!requirePath) {
                return ts.visitEachChild(node, visitor, ctx)
            }

            return createPromisifiedRequire(requirePath)
        }
        return (sf: ts.SourceFile) => ts.visitNode(sf, visitor)
    }
}