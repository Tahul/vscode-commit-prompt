import * as fs from 'node:fs'
import * as path from 'node:path'
import * as isUTF8 from 'is-utf8'
import stripBom from 'strip-bom'
import stripJSONComments from 'strip-json-comments'
import getNormalizedConfig from './getNormalizedConfig'

/**
 * Read the content of a configuration file
 * - if not js or json: strip any comments
 * - if js or json: require it
 */
function readConfigContent(configPath: string) {
  const parsedPath = path.parse(configPath)
  const isRcFile = parsedPath.ext !== '.js' && parsedPath.ext !== '.json'
  const jsonString = readConfigFileContent(configPath)
  const parse = isRcFile
    ? (contents: string) => JSON.parse(stripJSONComments(contents))
    : (contents: string) => JSON.parse(contents)

  try {
    const parsed = parse(jsonString)

    Object.defineProperty(parsed, 'configPath', {
      value: configPath,
    })

    return parsed
  }
  catch (error: any) {
    error.message = [
      `Parsing JSON at ${configPath} for commitizen config failed:`,
      error.mesasge,
    ].join('\n')

    throw error
  }
}

/**
 * Get content of the configuration file
 */
function getConfigContent(configPath: string, baseDirectory: string) {
  if (!configPath) {
    return
  }

  const resolvedPath = path.resolve(baseDirectory, configPath)
  const configBasename = path.basename(resolvedPath)

  if (!fs.existsSync(resolvedPath)) {
    return getNormalizedConfig(resolvedPath)
  }

  const content = readConfigContent(resolvedPath)
  return getNormalizedConfig(configBasename, content)
}

/**
 * Read proper content from config file.
 * If the chartset of the config file is not utf-8, one error will be thrown.
 */
function readConfigFileContent(configPath: string) {
  const rawBufContent = fs.readFileSync(configPath)

  if (!isUTF8(rawBufContent)) {
    throw new Error(
      `The config file at "${configPath}" contains invalid charset, expect utf8`,
    )
  }

  return stripBom(rawBufContent.toString('utf8'))
}

export default getConfigContent
