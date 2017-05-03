import * as ts from 'typescript';
export declare type GenerateScopedNameFn = (name: string, filepath: string, css: string) => string;
/**
 * Primarily from https://github.com/css-modules/css-modules-require-hook
 *
 * @export
 * @interface Opts
 */
export interface Opts {
    generateFilePath?(filename: string): string;
    threshold?: number;
}
export default function (): (ctx: ts.TransformationContext) => ts.Transformer<ts.SourceFile>;
