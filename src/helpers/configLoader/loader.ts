import * as path from "path"
import findup from "./findup"
import getContent from "./getContent"


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
 * @param {String} config - partial path to configuration file
 * @param {String} [cwd = process.cwd()] - directory path which will be joined with config argument
 * @return {Object|undefined}
 */
const loader = (configs: string[], config: string | null, cwd: string) => {
  var content
  var directory = cwd || process.cwd()

  // If config option is given, attempt to load it
  if (config) {
    return getContent(config, directory)
  }

  const findConfig: string | undefined = findup(
    configs,
    { nocase: true, cwd: directory },
    (configPath: string) => {
      if (path.basename(configPath) === "package.json") {
        return !!getContent(configPath, directory)
      }

      return true
    }
  )

  content = findConfig ? getContent(findConfig, directory) : []

  if (content) {
    return content
  }
}

export default loader
