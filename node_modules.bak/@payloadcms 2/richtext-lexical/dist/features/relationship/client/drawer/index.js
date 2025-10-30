'use client';

import { c as _c } from "react/compiler-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js';
import { $getNodeByKey, COMMAND_PRIORITY_EDITOR } from 'lexical';
import React, { useCallback, useEffect, useState } from 'react';
import { useLexicalListDrawer } from '../../../../utilities/fieldsDrawer/useLexicalListDrawer.js';
import { $createRelationshipNode } from '../nodes/RelationshipNode.js';
import { INSERT_RELATIONSHIP_COMMAND } from '../plugins/index.js';
import { EnabledRelationshipsCondition } from '../utils/EnabledRelationshipsCondition.js';
import { INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND } from './commands.js';
const insertRelationship = ({
  editor,
  relationTo,
  replaceNodeKey,
  value
}) => {
  if (!replaceNodeKey) {
    editor.dispatchCommand(INSERT_RELATIONSHIP_COMMAND, {
      relationTo,
      value
    });
  } else {
    editor.update(() => {
      const node = $getNodeByKey(replaceNodeKey);
      if (node) {
        node.replace($createRelationshipNode({
          relationTo,
          value
        }));
      }
    });
  }
};
const RelationshipDrawerComponent = t0 => {
  const $ = _c(16);
  const {
    enabledCollectionSlugs
  } = t0;
  const [editor] = useLexicalComposerContext();
  let t1;
  if ($[0] !== enabledCollectionSlugs?.[0]) {
    t1 = () => enabledCollectionSlugs?.[0];
    $[0] = enabledCollectionSlugs?.[0];
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const [selectedCollectionSlug] = useState(t1);
  const [replaceNodeKey, setReplaceNodeKey] = useState(null);
  const t2 = enabledCollectionSlugs ? enabledCollectionSlugs : undefined;
  let t3;
  if ($[2] !== selectedCollectionSlug || $[3] !== t2) {
    t3 = {
      collectionSlugs: t2,
      selectedCollection: selectedCollectionSlug
    };
    $[2] = selectedCollectionSlug;
    $[3] = t2;
    $[4] = t3;
  } else {
    t3 = $[4];
  }
  const {
    closeListDrawer,
    ListDrawer,
    openListDrawer
  } = useLexicalListDrawer(t3);
  let t4;
  let t5;
  if ($[5] !== editor || $[6] !== openListDrawer) {
    t4 = () => editor.registerCommand(INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND, payload => {
      setReplaceNodeKey(payload?.replace ? payload?.replace.nodeKey : null);
      openListDrawer();
      return true;
    }, COMMAND_PRIORITY_EDITOR);
    t5 = [editor, openListDrawer];
    $[5] = editor;
    $[6] = openListDrawer;
    $[7] = t4;
    $[8] = t5;
  } else {
    t4 = $[7];
    t5 = $[8];
  }
  useEffect(t4, t5);
  let t6;
  if ($[9] !== closeListDrawer || $[10] !== editor || $[11] !== replaceNodeKey) {
    t6 = t7 => {
      const {
        collectionSlug,
        doc
      } = t7;
      insertRelationship({
        editor,
        relationTo: collectionSlug,
        replaceNodeKey,
        value: doc.id
      });
      closeListDrawer();
    };
    $[9] = closeListDrawer;
    $[10] = editor;
    $[11] = replaceNodeKey;
    $[12] = t6;
  } else {
    t6 = $[12];
  }
  const onSelect = t6;
  let t7;
  if ($[13] !== ListDrawer || $[14] !== onSelect) {
    t7 = _jsx(ListDrawer, {
      onSelect
    });
    $[13] = ListDrawer;
    $[14] = onSelect;
    $[15] = t7;
  } else {
    t7 = $[15];
  }
  return t7;
};
export const RelationshipDrawer = props => {
  return (props?.enabledCollectionSlugs?.length ?? -1) > 0 ? /*#__PURE__*/_jsx(RelationshipDrawerComponent, {
    ...props
  }) : /*#__PURE__*/_jsx(EnabledRelationshipsCondition, {
    ...props,
    children: /*#__PURE__*/_jsx(RelationshipDrawerComponent, {
      ...props
    })
  });
};
//# sourceMappingURL=index.js.map