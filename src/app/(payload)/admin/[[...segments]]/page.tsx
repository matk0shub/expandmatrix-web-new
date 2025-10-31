/* THIS FILE WAS GENERATED BASED ON THE OFFICIAL PAYLOAD TEMPLATE. */
import type { Metadata } from 'next';

import config from '@payload-config';
import { serverLog } from '@/utils/serverLog';
import { importMap } from '../importMap';
import '../vendor-chunks/date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

type Params = {
  segments?: string[];
};

type SearchParams = Record<string, string | string[] | undefined>;

type PageArgs = {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
};

const adminViewsPromise = import('@payloadcms/next/views');
const configPromise = Promise.resolve(config);

const normalizeParams = (paramsPromise: Promise<Params>) =>
  paramsPromise.then((value) => ({
    segments: Array.isArray(value.segments) ? value.segments : [],
  }));

const normalizeSearchParams = (searchParamsPromise: Promise<SearchParams>) =>
  searchParamsPromise.then((value) => {
    const entries = Object.entries(value).filter(
      (entry): entry is [string, string | string[]] => entry[1] !== undefined,
    );
    return Object.fromEntries(entries);
  });

export const generateMetadata = async ({ params, searchParams }: PageArgs): Promise<Metadata> => {
  const viewsModule = await adminViewsPromise;
  serverLog('[admin/page] generateMetadata params', await params);

  return viewsModule.generatePageMetadata({
    config: configPromise,
    params: normalizeParams(params),
    searchParams: normalizeSearchParams(searchParams),
  });
};

const Page = async ({ params, searchParams }: PageArgs) => {
  const viewsModule = await adminViewsPromise;
  serverLog('[admin/page] render', await params);

  return viewsModule.RootPage({
    config: configPromise,
    params: normalizeParams(params),
    searchParams: normalizeSearchParams(searchParams),
    importMap,
  });
};

export default Page;
