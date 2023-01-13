import * as fs from 'node:fs/promises'

/**
 * 
 * @param {string} filepath 
 * @param {Object} json 
 */
export async function writeJson(filepath, json) {
  await fs.writeFile(filepath, JSON.stringify(json, null, 2), { encoding: 'utf8' })
}
