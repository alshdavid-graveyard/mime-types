import { shell } from '../../platform/shell.mjs'
import * as clean from './clean.mjs'

export async function esm() {
  clean.esm()
  await shell('npx tsc -p ./tsconfig.build.esm.json --watch')
}

export async function cjs() {
  clean.cjs()
  await shell('npx tsc -p ./tsconfig.build.cjs.json --watch')
}

export async function types() {
  clean.types()
  await shell('npx tsc -p ./tsconfig.build.types.json --watch')
}

export async function tests() {
  await shell('npx tsc -p ./tsconfig.build.tests.json --watch')
}
