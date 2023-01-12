import { extname } from './path/index.js'
import { db } from './mime-db.js'

const EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/
const TEXT_TYPE_REGEXP = /^text\//i
const preference = ['nginx', 'apache', undefined, 'iana']

let isSetup = false
const mimeTypes: Record<string, string> = {}

// Populate the mimeTypes object above
function populateMimeTypes() {
  for (const [key, mime] of Object.entries(db)) {
    const exts = mime.extensions
  
    if (!exts || !exts.length) {
      continue
    }
  
    for (const extension of exts) {
  
      if (mimeTypes[extension]) {
        const from = preference.indexOf(db[mimeTypes[extension]].source)
        const to = preference.indexOf(mime.source)
  
        if (
          mimeTypes[extension] !== 'application/octet-stream' &&
          (from > to || (from === to && mimeTypes[extension].substring(0, 12) === 'application/'))) {
          continue
        }
      }
  
      mimeTypes[extension] = key
    }
  }
}

export function contentType (str: string): false | string {
  if (!isSetup) {
    populateMimeTypes()
    isSetup = true
  }

  let mime: string | false = str
  if (!str.includes('/')) {
    const extension = extname('x.' + str)
    .toLowerCase()
    .substring(1)

    if (!extension || !mimeTypes[extension]) {
      return false
    }

    mime = mimeTypes[extension]
  }

  if (!mime.includes('charset')) {
    let cs: string | false = false

    const textMatch = EXTRACT_TYPE_REGEXP.exec(mime)
    const dbMime = textMatch && db[textMatch[1].toLowerCase()]

    if (dbMime && dbMime.charset) {
      cs = dbMime.charset
    }

    if (textMatch && TEXT_TYPE_REGEXP.test(textMatch[1])) {
      cs = 'UTF-8'
    }

    if (cs) {
      mime += '; charset=' + cs.toLowerCase()
    }
  }

  return mime
}
