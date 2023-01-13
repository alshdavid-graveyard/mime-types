import * as fs from 'node:fs/promises'

export async function exists(/** @type {string} */dir) {
  try {
    await fs.access(dir, fs.constants.R_OK)
    return true
  } catch (error) {
    return false
  }
}
