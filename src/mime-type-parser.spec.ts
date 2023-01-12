import { MimeDatabase } from './mime-databse'
import { MimeTypesParser } from './mime-types-parser'

const mockDatabase: MimeDatabase = {
  'application/javascript': {
    charset: 'UTF-8',
    extensions: ['js', 'mjs'],
  },
  "application/json": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["json","map"]
  },
  'application/foobar': {},
  'application/foo': {
    extensions: ['foo'],
  },
  'application/bar': {
    extensions: ['foo'],
  },
  'text/plain': {
    extensions: ['txt'],
  },
  "text/jade": {
    "extensions": ["jade"]
  },
  "text/html": {
    "source": "iana",
    "compressible": true,
    "extensions": ["html","htm","shtml"]
  },
  "application/xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xml","xsl","xsd","rng"]
  },
  "application/rtf": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rtf"]
  },
}

describe('MimeTypesParser', () => {
  describe('constructor', () => {
    it('Should not throw', () => {
      const testFunc = () => new MimeTypesParser({
        mimeDatabase: mockDatabase,
        preference: [],
      })
      expect(testFunc).not.toThrow()
    })

    it('Should not throw with defaults', () => {
      const testFunc = () => new MimeTypesParser()
      expect(testFunc).not.toThrow()
    })
  })

  describe('instance', () => {
    let mimeTypesParser: MimeTypesParser

    beforeEach(() => {
      mimeTypesParser = new MimeTypesParser({
        mimeDatabase: mockDatabase,
        preference: [],
      })
    })

    describe('charset', () => {
      it('should return "UTF-8" for "application/json"', () => {
        const result = mimeTypesParser.charset('application/json')
        expect(result).toEqual(['UTF-8', true])
      })
  
      it('should return "UTF-8" for "application/json; foo=bar"', () => {
        const result = mimeTypesParser.charset('application/json; foo=bar')
        expect(result).toEqual(['UTF-8', true])
      })
  
      it('should return "UTF-8" for "application/javascript"', () => {
        const result = mimeTypesParser.charset('application/javascript')
        expect(result).toEqual(['UTF-8', true])
      })
  
      it('should return "UTF-8" for "application/JavaScript"', () => {
        const result = mimeTypesParser.charset('application/JavaScript')
        expect(result).toEqual(['UTF-8', true])
      })
  
      it('should return "UTF-8" for "text/html"', () => {
        const result = mimeTypesParser.charset('text/html')
        expect(result).toEqual(['UTF-8', true])
      })
  
      it('should return "UTF-8" for "TEXT/HTML"', () => {
        const result = mimeTypesParser.charset('TEXT/HTML')
        expect(result).toEqual(['UTF-8', true])
      })
  
      it('should return "UTF-8" for any text/*', () => {
        const result = mimeTypesParser.charset('text/x-bogus')
        expect(result).toEqual(['UTF-8', true])
      })
  
      it('should return false for unknown types', () => {
        const result = mimeTypesParser.charset('application/x-bogus')
        expect(result).toEqual(['', false])
      })
  
      it('should return false for any application/octet-stream', () => {
        const result = mimeTypesParser.charset('application/octet-stream')
        expect(result).toEqual(['', false])
      })
  
      it('should return false for invalid arguments', () => {
        // @ts-expect-error
        expect(mimeTypesParser.charset({})).toEqual(['', false])
        // @ts-expect-error
        expect(mimeTypesParser.charset(null)).toEqual(['', false])
        // @ts-expect-error
        expect(mimeTypesParser.charset(true)).toEqual(['', false])
        // @ts-expect-error
        expect(mimeTypesParser.charset(42)).toEqual(['', false])
      })
    })

    describe('contentType', () => {
      it('Should provide correct contentType', () => {
        const result = mimeTypesParser.contentType('foo.js')
        expect(result).toEqual(['application/javascript; charset=utf-8', true])
      })

      it('Should provide false contentType not matched', () => {
        const result = mimeTypesParser.contentType('nothing')
        expect(result).toEqual(['', false])
      })

      it('Should provide false no extension supplied', () => {
        const result = mimeTypesParser.contentType('')
        expect(result).toEqual(['', false])
      })

      it('Should lookup charset', () => {
        const result = mimeTypesParser.contentType('foo.txt')
        expect(result).toEqual(['text/plain; charset=utf-8', true])
      })

      it('should return content-type for "html"', () => {
        const result = mimeTypesParser.contentType('html')
        expect(result).toEqual(['text/html; charset=utf-8', true])
      })
  
      it('should return content-type for ".html"', () => {
        const result = mimeTypesParser.contentType('.html')
        expect(result).toEqual(['text/html; charset=utf-8', true])
      })
  
      it('should return content-type for "jade"', () => {
        const result = mimeTypesParser.contentType('jade')
        expect(result).toEqual(['text/jade; charset=utf-8', true])
      })
  
      it('should return content-type for "json"', () => {
        const result = mimeTypesParser.contentType('json')
        expect(result).toEqual(['application/json; charset=utf-8', true])
      })
  
      it('should return false for unknown extensions', () => {
        const result = mimeTypesParser.contentType('bogus')
        expect(result).toEqual(['', false])
      })

      it('should attach charset to "application/json"', () => {
        const result = mimeTypesParser.contentType('application/json')
        expect(result).toEqual(['application/json; charset=utf-8', true])
      })
  
      it('should attach charset to "application/json; foo=bar"', () => {
        const result = mimeTypesParser.contentType('application/json; foo=bar')
        expect(result).toEqual(['application/json; foo=bar; charset=utf-8', true])
      })
  
      it('should attach charset to "TEXT/HTML"', () => {
        const result = mimeTypesParser.contentType('TEXT/HTML')
        expect(result).toEqual(['TEXT/HTML; charset=utf-8', true])
      })
  
      it('should attach charset to "text/html"', () => {
        const result = mimeTypesParser.contentType('text/html')
        expect(result).toEqual(['text/html; charset=utf-8', true])
      })
  
      it('should not alter "text/html; charset=iso-8859-1"', () => {
        const result = mimeTypesParser.contentType('text/html; charset=iso-8859-1')
        expect(result).toEqual(['text/html; charset=iso-8859-1', true])
      })
  
      it('should return type for unknown types', () => {
        const result = mimeTypesParser.contentType('application/x-bogus')
        expect(result).toEqual(['application/x-bogus', false])
      })

      it('should return false for invalid arguments', () => {
        // @ts-expect-error
        expect(mimeTypesParser.contentType({})).toEqual(['', false])
        // @ts-expect-error
        expect(mimeTypesParser.contentType(null)).toEqual(['', false])
        // @ts-expect-error
        expect(mimeTypesParser.contentType(true)).toEqual(['', false])
        // @ts-expect-error
        expect(mimeTypesParser.contentType(42)).toEqual(['', false])
      })
    })

    describe('extension', () => {
      it('should return extension for mime type', () => {
        expect(mimeTypesParser.extension('text/html')).toEqual(['html', true])
        expect(mimeTypesParser.extension(' text/html')).toEqual(['html', true])
        expect(mimeTypesParser.extension('text/html ')).toEqual(['html', true])
      })
  
      it('should return false for unknown type', () => {
        expect(mimeTypesParser.extension('application/x-bogus')).toEqual(['', false])
      })
  
      it('should return false for non-type string', () => {
        expect(mimeTypesParser.extension('bogus')).toEqual(['', false])
      })
  
      it('should return false for non-strings', () => {
        // @ts-expect-error
        expect(mimeTypesParser.extension(null)).toEqual(['', false])
        // @ts-expect-error
        expect(mimeTypesParser.extension(undefined)).toEqual(['', false])
        // @ts-expect-error
        expect(mimeTypesParser.extension(42)).toEqual(['', false])
        // @ts-expect-error
        expect(mimeTypesParser.extension({})).toEqual(['', false])
      })
  
      it('should return extension for mime type with parameters', () => {
        expect(mimeTypesParser.extension('text/html;charset=UTF-8')).toEqual(['html', true])
        expect(mimeTypesParser.extension('text/HTML; charset=UTF-8')).toEqual(['html', true])
        expect(mimeTypesParser.extension('text/html; charset=UTF-8')).toEqual(['html', true])
        expect(mimeTypesParser.extension('text/html; charset=UTF-8 ')).toEqual(['html', true])
        expect(mimeTypesParser.extension('text/html ; charset=UTF-8')).toEqual(['html', true])
      })
    })

    describe('lookup', () => {
      it('should return mime type for ".html"', () => {
        expect(mimeTypesParser.lookup('.html')).toEqual(['text/html', true])
      })
  
      it('should return mime type for ".js"', () => {
        expect(mimeTypesParser.lookup('.js')).toEqual(['application/javascript', true])
      })
  
      it('should return mime type for ".json"', () => {
        expect(mimeTypesParser.lookup('.json')).toEqual(['application/json', true])
      })
  
      it('should return mime type for ".rtf"', () => {
        expect(mimeTypesParser.lookup('.rtf')).toEqual(['application/rtf', true])
      })
  
      it('should return mime type for ".txt"', () => {
        expect(mimeTypesParser.lookup('.txt')).toEqual(['text/plain', true])
      })
  
      it('should return mime type for ".xml"', () => {
        expect(mimeTypesParser.lookup('.xml')).toEqual(['application/xml', true])
      })
  
      it('should work without the leading dot', () => {
        expect(mimeTypesParser.lookup('html')).toEqual(['text/html', true])
        expect(mimeTypesParser.lookup('xml')).toEqual(['application/xml', true])
      })
  
      it('should be case insensitive', () => {
        expect(mimeTypesParser.lookup('HTML')).toEqual(['text/html', true])
        expect(mimeTypesParser.lookup('.Xml')).toEqual(['application/xml', true])
      })
  
      it('should return false for unknown extension', () => {
        expect(mimeTypesParser.lookup('.bogus')).toEqual(['', false])
        expect(mimeTypesParser.lookup('bogus')).toEqual(['', false])
      })

      it('should return mime type for file name', () => {
        expect(mimeTypesParser.lookup('page.html')).toEqual(['text/html', true])
      })
  
      it('should return mime type for relative path', () => {
        expect(mimeTypesParser.lookup('path/to/page.html')).toEqual(['text/html', true])
        expect(mimeTypesParser.lookup('path\\to\\page.html')).toEqual(['text/html', true])
      })
  
      it('should return mime type for absolute path', () => {
        expect(mimeTypesParser.lookup('/path/to/page.html')).toEqual(['text/html', true])
        expect(mimeTypesParser.lookup('C:\\path\\to\\page.html')).toEqual(['text/html', true])
      })
  
      it('should be case insensitive', () => {
        expect(mimeTypesParser.lookup('/path/to/PAGE.HTML')).toEqual(['text/html', true])
        expect(mimeTypesParser.lookup('C:\\path\\to\\PAGE.HTML')).toEqual(['text/html', true])
      })
  
      it('should return false for unknown extension', () => {
        expect(mimeTypesParser.lookup('/path/to/file.bogus')).toEqual(['', false])
      })

      it('should return false for path without extension', () => {
        expect(mimeTypesParser.lookup('/path/to/json')).toEqual(['', false])
      })

      it('should in dotfile, return false when extension-less', () => {
        expect(mimeTypesParser.lookup('/path/to/.json')).toEqual(['', false])
      })

      it('should in dotfile, return mime type when there is extension', () => {
        expect(mimeTypesParser.lookup('/path/to/.config.json')).toEqual(['application/json', true])
      })

      it('should in dotfile, return mime type when there is extension, but no path', () => {
        expect(mimeTypesParser.lookup('.config.json')).toEqual(['application/json', true])
      })
  
      it('should return false for non-strings', () => {
        // @ts-expect-error
        expect(mimeTypesParser.lookup(null)).toEqual(['', false])
        // @ts-expect-error
        expect(mimeTypesParser.lookup(undefined)).toEqual(['', false])
        // @ts-expect-error
        expect(mimeTypesParser.lookup(42)).toEqual(['', false])
        // @ts-expect-error
        expect(mimeTypesParser.lookup({})).toEqual(['', false])
      })
    })
  })
})
