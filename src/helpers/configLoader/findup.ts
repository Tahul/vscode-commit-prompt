import * as path from 'node:path'
import * as glob from 'glob'

export interface FindUpOptions {
  nocase: boolean
  cwd: string
  maxDepth?: number
}

export function findup(patterns: string[], options: FindUpOptions, fn: (...args: any[]) => {}): string | undefined {
  let lastpath
  let file

  options = Object.create(options)
  options.maxDepth = 1
  options.cwd = path.resolve(options.cwd)

  do {
    file = patterns.filter((pattern: string) => {
      const configPath = glob.sync(pattern, options)[0]

      if (configPath) {
        return fn(path.join(options.cwd, configPath))
      }

      return false
    })[0]

    if (file) {
      return path.join(options.cwd, file)
    }

    lastpath = options.cwd
    options.cwd = path.resolve(options.cwd, '..')
  } while (options.cwd !== lastpath)
}

export default findup
