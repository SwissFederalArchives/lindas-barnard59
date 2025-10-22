import { resolve } from 'path'
import { fileURLToPath } from 'url'

const base = fileURLToPath(new URL('.', import.meta.url))

/**
 * @param {string} name
 * @returns {string}
 */
function filenamePipelineDefinition(name) {
  return resolve(base, `definitions/${name}.ttl`)
}

export default filenamePipelineDefinition
