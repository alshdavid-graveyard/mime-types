import { contentType } from './mime.js'
import { db } from './mime-db.js'

for (const key of Object.keys(db)) {
  delete db[key]
}

db["application/javascript"] = {
  charset: "UTF-8",
  extensions: ["js","mjs"]
}

db["application/foobar"] = {}

db["application/foo"] = {
  extensions: ['foo']
}

db["application/bar"] = {
  extensions: ['foo']
}

db["text/plain"] = {
  extensions: ['txt']
}

describe('contentType', () => {
  it('Should not throw', () => {
    const testFunc = () => contentType('html')
    expect(testFunc).not.toThrow()
  })

  it('Should provide correct contentType', () => {
    const result = contentType('foo.js')
    expect(result).toBe('application/javascript; charset=utf-8')
  })

  it('Should provide false contentType not matched', () => {
    const result = contentType('nothing')
    expect(result).toBe(false)
  })

  it('Should provide false no extension supplied', () => {
    const result = contentType('')
    expect(result).toBe(false)
  })

  it('Should lookup charset', () => {
    const result = contentType('foo.txt')
    expect(result).toBe('text/plain; charset=utf-8')
  })
})