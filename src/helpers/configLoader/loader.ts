import * as path from 'node:path'
import process from 'node:process'
import findup from './findup'
import getContent from './getContent'

/**
 * Command line config helpers
 * Shamelessly ripped from with slight modifications:
 * https://github.com/commitizen/cz-cli/blob/master/src/configLoader/loader.js
 *
 * To be honest, I just imported the config loader from Commitzen, so all the credits for
 * that part goes to their team!
 */

/**
 * Get content of the configuration file
 */
function loader(configs: string[], config: string | null, cwd: string) {
  const directory = cwd || process.cwd()

  // If config option is given, attempt to load it
  if (config) {
    return getContent(config, directory)
  }

  const findConfig: string | undefined = findup(
    configs,
    { nocase: true, cwd: directory },
    (configPath: string) => {
      if (path.basename(configPath) === 'package.json') {
        return !!getContent(configPath, directory)
      }

      return true
    },
  )

  return findConfig ? getContent(findConfig, directory) : []
}

export default loader
