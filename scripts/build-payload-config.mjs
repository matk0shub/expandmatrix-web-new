#!/usr/bin/env node
import esbuild from 'esbuild'
import fs from 'node:fs/promises'
import path from 'node:path'

const { build } = esbuild

const projectRoot = process.cwd()
const entryPoint = path.resolve(projectRoot, 'payload.config.ts')
const outFile = path.resolve(projectRoot, 'payload.config.dist.cjs')

await fs.mkdir(path.dirname(outFile), { recursive: true })

await build({
  entryPoints: [entryPoint],
  outfile: outFile,
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  sourcemap: false,
  legalComments: 'none',
  external: [
    '@payloadcms/*',
    'payload',
    'sharp',
    'nodemailer',
    '@calcom/*',
    'react',
    'react-dom',
  ],
})
