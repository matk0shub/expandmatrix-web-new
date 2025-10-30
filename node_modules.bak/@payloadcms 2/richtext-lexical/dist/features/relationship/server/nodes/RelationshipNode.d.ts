import type { SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode.js';
import type { DOMConversionMap, DOMExportOutput, EditorConfig, ElementFormatType, LexicalEditor, LexicalNode, NodeKey, Spread } from 'lexical';
import type { CollectionSlug, DataFromCollectionSlug } from 'payload';
import type { JSX } from 'react';
import { DecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode.js';
export type RelationshipData = {
    [TCollectionSlug in CollectionSlug]: {
        relationTo: TCollectionSlug;
        value: DataFromCollectionSlug<TCollectionSlug> | number | string;
    };
}[CollectionSlug];
export type SerializedRelationshipNode = {
    children?: never;
    type: 'relationship';
} & Spread<RelationshipData, SerializedDecoratorBlockNode>;
export declare class RelationshipServerNode extends DecoratorBlockNode {
    __data: RelationshipData;
    constructor({ data, format, key, }: {
        data: RelationshipData;
        format?: ElementFormatType;
        key?: NodeKey;
    });
    static clone(node: RelationshipServerNode): RelationshipServerNode;
    static getType(): string;
    static importDOM(): DOMConversionMap<HTMLDivElement> | null;
    static importJSON(serializedNode: SerializedRelationshipNode): RelationshipServerNode;
    static isInline(): false;
    decorate(_editor: LexicalEditor, _config: EditorConfig): JSX.Element;
    exportDOM(): DOMExportOutput;
    exportJSON(): SerializedRelationshipNode;
    getData(): RelationshipData;
    getTextContent(): string;
    setData(data: RelationshipData): void;
}
export declare function $createServerRelationshipNode(data: RelationshipData): RelationshipServerNode;
export declare function $isServerRelationshipNode(node: LexicalNode | null | RelationshipServerNode | undefined): node is RelationshipServerNode;
//# sourceMappingURL=RelationshipNode.d.ts.map