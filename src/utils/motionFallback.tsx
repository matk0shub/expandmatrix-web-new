'use client';

import {
  createElement,
  forwardRef,
  Fragment,
  type ComponentType,
  type JSX,
  type PropsWithChildren,
} from 'react';

const IGNORED_PROPS = new Set([
  'animate',
  'initial',
  'exit',
  'transition',
  'variants',
  'whileHover',
  'whileTap',
  'whileFocus',
  'whileInView',
  'viewport',
  'layout',
  'layoutId',
  'drag',
  'dragControls',
  'dragConstraints',
  'dragElastic',
  'dragMomentum',
  'onAnimationStart',
  'onAnimationComplete',
  'onDragStart',
  'onDragEnd',
  'onDrag',
  'custom',
]);

type IntrinsicTag = keyof JSX.IntrinsicElements;

type FallbackComponent = ComponentType<PropsWithChildren<Record<string, unknown>>>;

const createFallback = <T extends IntrinsicTag>(tag: T): FallbackComponent => {
  const Component = forwardRef<HTMLElement, Record<string, unknown>>((props, ref) => {
    const filteredProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props)) {
      if (!IGNORED_PROPS.has(key)) {
        filteredProps[key] = value;
      }
    }

    return createElement(tag, { ...filteredProps, ref });
  });

  Component.displayName = `FallbackMotion(${tag})`;

  return Component;
};

export const fallbackMotion = {
  h1: createFallback('h1'),
  h2: createFallback('h2'),
  h3: createFallback('h3'),
  h4: createFallback('h4'),
  h5: createFallback('h5'),
  h6: createFallback('h6'),
  div: createFallback('div'),
  span: createFallback('span'),
  section: createFallback('section'),
  a: createFallback('a'),
  tr: createFallback('tr'),
  td: createFallback('td'),
  article: createFallback('article'),
  button: createFallback('button'),
  p: createFallback('p'),
  ul: createFallback('ul'),
  li: createFallback('li'),
  nav: createFallback('nav'),
};

export const FallbackAnimatePresence: ComponentType<PropsWithChildren> = ({ children }) => (
  <Fragment>{children}</Fragment>
);
