'use client';

import { c as _c } from "react/compiler-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useBlockComponentContext } from '../BlockContent.js';
export const BlockCollapsible = t0 => {
  const $ = _c(6);
  const {
    children,
    editButton,
    Label,
    removeButton
  } = t0;
  const {
    BlockCollapsible
  } = useBlockComponentContext();
  let t1;
  if ($[0] !== BlockCollapsible || $[1] !== Label || $[2] !== children || $[3] !== editButton || $[4] !== removeButton) {
    t1 = BlockCollapsible ? _jsx(BlockCollapsible, {
      editButton,
      Label,
      removeButton,
      children
    }) : null;
    $[0] = BlockCollapsible;
    $[1] = Label;
    $[2] = children;
    $[3] = editButton;
    $[4] = removeButton;
    $[5] = t1;
  } else {
    t1 = $[5];
  }
  return t1;
};
//# sourceMappingURL=BlockCollapsible.js.map