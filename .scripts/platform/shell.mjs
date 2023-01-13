import { exec, execSync } from 'node:child_process'
import { Directories } from './directories.mjs'

/**
 * @param {string} command 
 * @param {import('node:child_process').ExecSyncOptions} options 
 * @returns 
 */
export function shellSync(
  command,
  options = {},
) {
  return execSync(command, { 
    stdio: 'inherit', 
    cwd: Directories.Root.Path,
    ...options,
  })
}

/**
 * @param {string} command 
 * @param {import('node:child_process').ExecOptions} options 
 * @returns {Promise<void>}
 */
export function shell(
  command,
  options = {},
) {
  return new Promise((resolve, reject) => {
    const cmd = exec(command, { 
      cwd: Directories.Root.Path,
      ...options,
    }, error => error ? reject(error) : resolve())

    cmd.stdout && cmd.stdout.on('data', data => {
      console.log(data); 
    })

    cmd.stderr && cmd.stderr.on('data', data => {
      console.log(data); 
    })
  })
}
