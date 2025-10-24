/* THIS FILE WAS GENERATED BASED ON THE OFFICIAL PAYLOAD TEMPLATE. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'

import { importMap } from '../importMap'

type Params = Promise<{
  segments: string[]
}>

type SearchParams = Promise<Record<string, string | string[]>>

type PageArgs = {
  params: Params
  searchParams: SearchParams
}

export const generateMetadata = ({ params, searchParams }: PageArgs): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: PageArgs) =>
  RootPage({ config, params, searchParams, importMap })

export default Page
