import { shell } from '../../platform/shell.mjs'
import * as clean from './clean.mjs'
import * as path from 'node:path'
import { Directories } from '../../platform/directories.mjs'
import { writeJson } from '../../platform/write-json.mjs'

export async function esm() {
  await clean.esm()
  await shell('npx tsc -p ./tsconfig.build.esm.json')
  await writeJson(path.join(Directories.Root.Esm.Path, 'package.json'), { type: 'module' })
}

export async function cjs() {
  await clean.cjs()
  await shell('npx tsc -p ./tsconfig.build.cjs.json')
  await writeJson(path.join(Directories.Root.Cjs.Path, 'package.json'), { type: 'commonjs' })
}

export async function types() {
  await clean.types()
  await shell('npx tsc -p ./tsconfig.build.types.json')
}

export async function tests() {
  await shell('npx tsc -p ./tsconfig.build.tests.json')
}
