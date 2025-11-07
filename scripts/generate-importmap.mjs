import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { buildConfig, generateImportMap } from 'payload'
import jitiFactory from 'jiti'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

dotenv.config({ path: path.join(projectRoot, '.env') })

async function main() {
  const jiti = jitiFactory(projectRoot)
  const rawConfig = jiti(path.join(projectRoot, 'payload.config.ts')).default
  const builtConfig = await buildConfig(rawConfig)
  await generateImportMap(builtConfig, { log: true, force: true })
}

main().catch((error) => {
  console.error('Failed to generate import map:', error)
  process.exitCode = 1
})
