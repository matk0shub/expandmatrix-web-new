import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const steps = [
  { name: 'team', script: 'scripts/seed-team.mjs' },
  { name: 'faqs', script: 'scripts/seed-faqs.mjs' },
  { name: 'references', script: 'scripts/seed-references.mjs' },
  { name: 'site-settings', script: 'scripts/seed-site-settings.mjs' },
]

const runStep = (step) =>
  new Promise((resolve, reject) => {
    const child = spawn('node', [path.join(projectRoot, step.script)], {
      cwd: projectRoot,
      stdio: 'inherit',
      env: { ...process.env },
    })

    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Seed step "${step.name}" failed with exit code ${code}`))
      }
    })
  })

async function main() {
  for (const step of steps) {
    // eslint-disable-next-line no-console
    console.log(`Running seed step: ${step.name}`)
    await runStep(step)
  }

  // eslint-disable-next-line no-console
  console.log('Payload seed complete.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
