import * as path from 'node:path'
import * as url from 'node:url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const rootDirectory = path.resolve(__dirname,'..', '..')

export const Directories = {
  Root: {
    Path: rootDirectory,
    Cjs: {
      Path: path.join(rootDirectory, 'cjs')
    },
    Esm: {
      Path: path.join(rootDirectory, 'esm')
    },
    Types: {
      Path: path.join(rootDirectory, 'types')
    }
  }
}
