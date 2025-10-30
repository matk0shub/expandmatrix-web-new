import type { ClientField, FormState } from 'payload';
import React from 'react';
type Props = {
    baseClass: string;
    BlockDrawer: React.FC;
    Collapsible: React.FC<{
        children?: React.ReactNode;
        editButton?: boolean;
        errorCount?: number;
        fieldHasErrors?: boolean;
        /**
         * Override the default label with a custom label
         */
        Label?: React.ReactNode;
        removeButton?: boolean;
    }>;
    CustomBlock: React.ReactNode;
    EditButton: React.FC;
    errorCount: number;
    formSchema: ClientField[];
    initialState: false | FormState | undefined;
    nodeKey: string;
    RemoveButton: React.FC;
};
type BlockComponentContextType = {
    BlockCollapsible?: React.FC<{
        children?: React.ReactNode;
        editButton?: boolean;
        /**
         * Override the default label with a custom label
         */
        Label?: React.ReactNode;
        removeButton?: boolean;
    }>;
    EditButton?: React.FC;
    initialState: false | FormState | undefined;
    nodeKey?: string;
    RemoveButton?: React.FC;
};
export declare const useBlockComponentContext: () => BlockComponentContextType;
/**
 * The actual content of the Block. This should be INSIDE a Form component,
 * scoped to the block. All format operations in here are thus scoped to the block's form, and
 * not the whole document.
 */
export declare const BlockContent: React.FC<Props>;
export {};
//# sourceMappingURL=BlockContent.d.ts.map