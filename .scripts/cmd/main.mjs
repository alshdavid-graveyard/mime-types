/*
  This is a task runner that will parse CLI arguments and execute the relevant script under ./commands

  This following will execute the exported "esm" function in the ./commands/build.mjs
  $ node ./cmd/main.mjs build:esm

  This following will execute all exported functions in the ./commands/build.mjs
  $ node ./cmd/main.mjs build
*/

/** @type {[string|undefined, string|undefined]} */
const [cmd, fn] = process.argv[2]
  ? [
      process.argv[2].split(':')[0] || undefined,
      process.argv[2].split(':')[1] || undefined,
    ]
  : [undefined, undefined]

try {
  if (cmd && fn) {
    const mod = await import(`./commands/${cmd}.mjs`)
    if (mod[fn]) {
      await mod[fn]()
      process.exit()
    }
  }
  
  if (cmd && !fn) {
    const mod = await import(`./commands/${cmd}.mjs`)
    
    /** @type {Array<() => Promise<void>>} */
    const tasks = []
    for (const [key, value] of Object.entries(mod)) {
      if (typeof value === 'function') {
        tasks.push(async () => {
          console.log(`Running ${cmd}:${key}`)
          await value()
          console.log(`Finished ${cmd}:${key}`)
        })
      }
    }
    await Promise.allSettled(tasks.map(t => t()))
    process.exit()
  }
} catch (error) {
  console.log(error)
  // suppress
}

console.log(`Command "${cmd}" not found`)
