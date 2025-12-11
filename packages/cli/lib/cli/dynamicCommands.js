import module from 'node:module'
import rdf from '@lindas/barnard59-env'
import { program } from 'commander'
import { isLiteral } from 'is-graph-pointer'
import { parse } from '../pipeline.js'
import runAction from './runAction.js'
import { combine } from './options.js'

const FALSE = rdf.literal('false', rdf.ns.xsd.boolean)
const require = module.createRequire(import.meta.url)

const B59_LINDAS = 'https://lindas-barnard59.zazuko.com/vocab#'
const B59_UPSTREAM = 'https://barnard59.zazuko.com/vocab#'

/**
 * Read a property using LINDAS b59 first, then upstream b59 as fallback.
 * @param {import('@lindas/clownface').AnyPointer} ptr
 * @param {string} local
 */
function outB59(ptr, local) {
  const lindas = rdf.namedNode(B59_LINDAS + local)
  const upstream = rdf.namedNode(B59_UPSTREAM + local)
  const first = ptr.out(lindas)
  if (first.values.length || (first.terms && first.terms.length)) return first
  return ptr.out(upstream)
}

/**
 * @typedef {{
 *   name: string | undefined,
 *   manifest: import('@lindas/clownface').AnyPointer,
 *   version: string,
 * }} Manifest
 */

/**
 * @param {AsyncIterable<Manifest>} manifests
 * @return {AsyncGenerator<import('commander').Command, void, *>}
 */
export async function * discoverCommands(manifests) {
  for await (const { name, manifest, version = '0.0.0' } of manifests) {
    // Find CliCommand nodes regardless of which b59 namespace variant is used
    const cliTypes = [
      rdf.namedNode(B59_LINDAS + 'CliCommand'),
      rdf.namedNode(B59_UPSTREAM + 'CliCommand'),
    ]

    const commands = Array.from(new Set([
      ...cliTypes.flatMap(t => manifest.has(rdf.ns.rdf.type, t).toArray()),
    ]))

    if (!commands.length) {
      continue
    }

    const command = program.command(`${name}`).version(version)

    for (const commandPtr of commands) {
      const source = outB59(commandPtr, 'source')
      const pipeline = outB59(commandPtr, 'pipeline')
      const commandName = outB59(commandPtr, 'command').value
      const description = commandPtr.out(rdf.ns.rdfs.label).value

      if (!isLiteral(source) || !commandName) {
        continue
      }

      try {
        const resolvedPath = require.resolve(source.value)
        const { basePath, ptr } = await parse(resolvedPath, pipeline.value)

        const pipelineSubCommand = command.command(commandName)
        if (description) {
          pipelineSubCommand.description(description)
        }

        const variables = getAnnotatedVariables(ptr)
        for (const { name, description, required, defaultValue } of variables) {
          const option = `--${name} <${name}>`
          if (required) {
            pipelineSubCommand.requiredOption(option, description, defaultValue)
          } else {
            pipelineSubCommand.option(option, description, defaultValue)
          }
        }

        yield pipelineSubCommand
          .action(async (options) => {
            return runAction(ptr, basePath, combine({
              ...options,
              variable: new Map([
                ...options.variable,
                ...Object.entries(options).filter(([key]) => variables.some(v => v.name === key)),
              ]),
            }))
          })
      } catch {
        // Skip commands that fail to load
      }
    }
  }
}

/**
 * @param {import('@lindas/clownface').GraphPointer} ptr
 * @returns {Array<{ name: string | undefined, description: string | undefined, required: boolean, defaultValue: string | undefined }>}
 */
function getAnnotatedVariables(ptr) {
  return ptr
    .out(rdf.ns.p.variables)
    .out(rdf.ns.p.variable)
    .toArray()
    .map(variable => {
      const requiredLiteral = variable.out(rdf.ns.p.required).term
      const required = requiredLiteral ? !requiredLiteral.equals(FALSE) : true

      return {
        required,
        name: variable.out(rdf.ns.p.name).value,
        defaultValue: variable.out(rdf.ns.p.value).value,
        description: variable.out(rdf.ns.rdfs.label).value,
      }
    })
}
