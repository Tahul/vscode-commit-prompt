import * as glob from "glob"
import * as path from "path"

export interface FindUpOptions {
  nocase: boolean
  cwd: string
  maxDepth?: number
}

export const findup = (
  patterns: string[],
  options: FindUpOptions,
  fn: (...args: any[]) => {}
): string | undefined => {
  var lastpath
  var file

  options = Object.create(options)
  options.maxDepth = 1
  options.cwd = path.resolve(options.cwd)

  do {
    file = patterns.filter((pattern: string) => {
      var configPath = glob.sync(pattern, options)[0]

      if (configPath) {
        return fn(path.join(options.cwd, configPath))
      }
    })[0]

    if (file) {
      return path.join(options.cwd, file)
    }

    lastpath = options.cwd
    options.cwd = path.resolve(options.cwd, "..")
  } while (options.cwd !== lastpath)
}

export default findup
