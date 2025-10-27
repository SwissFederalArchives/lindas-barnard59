import module from 'node:module'
import rdf from 'lindas-barnard59-env'
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
 * @param {import('clownface').AnyPointer} ptr
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
 *   manifest: import('clownface').AnyPointer,
 *   version: string,
 * }} Manifest
 */

/**
 * @param {AsyncIterable<Manifest>} manifests
 * @return {AsyncGenerator<import('commander').Command, void, *>}
 */
export async function * discoverCommands(manifests) {
  for await (const { name, manifest, version = '0.0.0' } of manifests) {
    console.log('[barnard59] discoverCommands processing:', name)

    // Find CliCommand nodes regardless of which b59 namespace variant is used
    const cliTypes = [
      rdf.namedNode(B59_LINDAS + 'CliCommand'),
      rdf.namedNode(B59_UPSTREAM + 'CliCommand'),
    ]

    const commands = Array.from(new Set([
      ...cliTypes.flatMap(t => manifest.has(rdf.ns.rdf.type, t).toArray()),
    ]))

    if (!commands.length) {
      console.log('[barnard59] No CliCommands found in manifest for:', name)
      continue
    }

    console.log('[barnard59] Creating parent command:', name, 'with', commands.length, 'subcommands')
    const command = program.command(`${name}`).version(version)
    let hasValidSubcommands = false

    for (const commandPtr of commands) {
      const source = outB59(commandPtr, 'source')
      const pipeline = outB59(commandPtr, 'pipeline')
      const commandName = outB59(commandPtr, 'command').value
      const description = commandPtr.out(rdf.ns.rdfs.label).value

      console.log('[barnard59] Processing subcommand:', commandName, 'source:', source.value)

      if (!isLiteral(source) || !commandName) {
        // eslint-disable-next-line no-console
        console.error(`WARN: Skipping command <${commandPtr.value}> because it is not valid`)
        continue
      }

      try {
        console.log('[barnard59] Resolving source:', source.value)
        const resolvedPath = require.resolve(source.value)
        console.log('[barnard59] Resolved to:', resolvedPath)
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

        console.log('[barnard59] Successfully created subcommand:', name, commandName)
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

        hasValidSubcommands = true
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        const stack = err instanceof Error ? err.stack : ''
        // eslint-disable-next-line no-console
        console.error(`[barnard59] WARN: Failed to load command '${commandName}' from ${name}:`, message)
        if (stack) {
          // eslint-disable-next-line no-console
          console.error('[barnard59] Stack:', stack)
        }
      }
    }

    if (!hasValidSubcommands) {
      // eslint-disable-next-line no-console
      console.warn(`[barnard59] WARN: Command '${name}' has no valid subcommands`)
    }
  }
}

/**
 * @param {import('clownface').GraphPointer} ptr
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
