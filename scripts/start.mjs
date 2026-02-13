import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'

const root = process.cwd()
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || '3000'
const serverEntry = resolve(root, '.output/server/index.mjs')
const staticIndex = resolve(root, '.output/public/index.html')

const run = (command, args) => {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  })

  child.on('exit', (code) => {
    process.exit(code ?? 0)
  })
}

if (existsSync(serverEntry)) {
  run('node', [serverEntry])
} else if (existsSync(staticIndex)) {
  run('npx', ['nuxi', 'preview', '--host', host, '--port', String(port)])
} else {
  console.error(
    '[start] No build output found. Run "npm run build" (server) or "npm run generate" (static) first.'
  )
  process.exit(1)
}
