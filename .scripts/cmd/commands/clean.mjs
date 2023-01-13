import { Directories } from '../../platform/directories.mjs'
import * as fs from 'node:fs/promises'
import { exists } from '../../platform/exists.mjs'

export async function esm() {
  const target = Directories.Root.Esm.Path
  if (await exists(target)) {
    await fs.rm(target, { recursive: true })
  }
}

export async function cjs() {
  const target = Directories.Root.Cjs.Path
  if (await exists(target)) {
    await fs.rm(target, { recursive: true })
  }
}

export async function types() {
  const target = Directories.Root.Types.Path
  if (await exists(target)) {
    await fs.rm(target, { recursive: true })
  }
}

