/* THIS FILE WAS GENERATED BASED ON THE OFFICIAL PAYLOAD TEMPLATE. */
import '@payloadcms/next/css';
import '@/payload/prewarm';

import type { ServerFunctionClient } from 'payload';
import React from 'react';

import config from '@payload-config';
import { importMap } from './admin/importMap.js';

import './custom.scss';

const layoutModulePromise = import('@payloadcms/next/layouts');

type LayoutProps = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  'use server';

  const { handleServerFunctions } = await layoutModulePromise;

  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = async ({ children }: LayoutProps) => {
  const { RootLayout } = await layoutModulePromise;

  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
};

export default Layout;
