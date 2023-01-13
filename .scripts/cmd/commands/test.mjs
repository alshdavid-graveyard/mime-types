import { shell } from '../../platform/shell.mjs'

export async function test() {
  await shell('npx jest src --color')
}
