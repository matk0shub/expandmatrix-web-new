/* THIS FILE WAS GENERATED BASED ON THE OFFICIAL PAYLOAD TEMPLATE. */
import type { Metadata } from 'next';

import config from '@payload-config';
import { importMap } from '../importMap';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = Promise<{
  segments: string[];
}>;

type SearchParams = Promise<Record<string, string | string[]>>;

type PageArgs = {
  params: Params;
  searchParams: SearchParams;
};

const adminViewsPromise = import('@payloadcms/next/views');

export const generateMetadata = async ({ params, searchParams }: PageArgs): Promise<Metadata> => {
  const viewsModule = await adminViewsPromise;

  return viewsModule.generatePageMetadata({
    config,
    params,
    searchParams,
  });
};

const Page = async ({ params, searchParams }: PageArgs) => {
  const viewsModule = await adminViewsPromise;

  return viewsModule.RootPage({
    config,
    params,
    searchParams,
    importMap,
  });
};

export default Page;
