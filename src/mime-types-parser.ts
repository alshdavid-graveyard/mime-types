import { MimeDatabase } from './mime-databse.js'
import { extname } from './path/index.js'
import { preference as defaultPreference } from './preference.js'
import { mimeDatabase as defaultMimeDatabase } from './mime-databse.js'
import { MimeTypesParserInterface } from './mime-type-parser-interface.js'

const EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/
const TEXT_TYPE_REGEXP = /^text\//i

export type MimeTypesParserOptions = {
  mimeDatabase?: MimeDatabase,
  preference?: Array<string|undefined>
}

export class MimeTypesParser implements MimeTypesParserInterface {
  #mimeTypes: Record<string, string>
  #mimeDatabase: MimeDatabase
  #extensions: Record<string, string[]>

  constructor({
    mimeDatabase = defaultMimeDatabase,
    preference = defaultPreference,
  }: MimeTypesParserOptions = {}) {
    this.#mimeDatabase = mimeDatabase
    this.#mimeTypes = {}
    this.#extensions = {}

    for (const [mimeKey, mime] of Object.entries(this.#mimeDatabase)) {
      const exts = mime.extensions
    
      if (!exts || !exts.length) {
        continue
      }

      this.#extensions[mimeKey] = exts
    
      for (const extension of exts) {
        if (this.#mimeTypes[extension]) {
          const from = preference.indexOf(this.#mimeDatabase[this.#mimeTypes[extension]].source)
          const to = preference.indexOf(mime.source)
    
          if (
            this.#mimeTypes[extension] !== 'application/octet-stream' &&
            (from > to || (from === to && this.#mimeTypes[extension].substring(0, 12) === 'application/'))) {
            continue
          }
        }
    
        this.#mimeTypes[extension] = mimeKey
      }
    }
  }

  lookup(path: string): [contentType: string, found: boolean] {
    if (!path || typeof path !== 'string') {
      return ['', false]
    }

    // get the extension ("ext" or ".ext" or full path)
    const extension = extname('x.' + path)
      .toLowerCase()
      .substring(1)
  
    if (!extension) {
      return ['', false]
    }
  
    const found = this.#mimeTypes[extension]
    if (!found) {
      return ['', false]
    }

    return [found, true]
  }

  contentType(query: string): [contentType: string, found: boolean] {
    if (!query || typeof query !== 'string') {
      return ['', false]
    }

    let mime: string = query
    if (!query.includes('/')) {
      const extension = extname('x.' + query)
        .toLowerCase()
        .substring(1)

      if (!extension || !this.#mimeTypes[extension]) {
        return ['', false]
      }

      mime = this.#mimeTypes[extension]
    }

    if (!mime.includes('charset')) {
      let cs: string | undefined

      const textMatch = EXTRACT_TYPE_REGEXP.exec(mime)
      const dbMime = textMatch && this.#mimeDatabase[textMatch[1].toLowerCase()]

      if (dbMime && dbMime.charset) {
        cs = dbMime.charset
      }

      if (textMatch && TEXT_TYPE_REGEXP.test(textMatch[1])) {
        cs = 'UTF-8'
      }

      if (!cs) {
        return [query, false]
      }

      if (cs) {
        mime += '; charset=' + cs.toLowerCase()
      }
    }

    return [mime, true]
  }

  extension(mimeType: string): [extension: string, found: boolean] {
    if (!mimeType || typeof mimeType !== 'string') {
      return ['', false]
    }

    // TODO: use media-typer
    const match = EXTRACT_TYPE_REGEXP.exec(mimeType)

    // get extensions
    const exts = match && this.#extensions[match[1].toLowerCase()]

    if (!exts || !exts.length) {
      return ['', false]
    }

    return [exts[0], true]
  }

  charset(mimeType: string): [charset: string, found: boolean] {
    if (!mimeType || typeof mimeType !== 'string') {
      return ['', false]
    }

    // TODO: use media-typer
    const match = EXTRACT_TYPE_REGEXP.exec(mimeType)
    const mime = match && this.#mimeDatabase[match[1].toLowerCase()]

    if (mime && mime.charset) {
      return [mime.charset, true]
    }

    // default text/* to utf-8
    if (match && TEXT_TYPE_REGEXP.test(match[1])) {
      return ['UTF-8', true]
    }

    return ['', false]
  }
}
