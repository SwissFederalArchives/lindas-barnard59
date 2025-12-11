import { Transform } from 'node:stream'
import { isReadableStream, isStream } from 'is-stream'
import SHACLValidator from 'rdf-validate-shacl'
import TermCounter from './lib/TermCounter.js'

/**
 * Creates a Transform stream for SHACL validation that collects all reports and
 * pushes them in flush() to ensure proper stream flushing on all platforms.
 * On Linux, data pushed in transform() may not reach stdout before the stream ends.
 *
 * @param {object} options
 * @param {import('@lindas/barnard59-core').Context} options.context
 * @param {import('@rdfjs/types').DatasetCore | undefined} options.shapes
 * @param {number | undefined} options.maxViolations
 * @return {Transform}
 */
function createValidationTransform({ context, shapes, maxViolations }) {
  const counter = new TermCounter(context.env)
  /** @type {import('@rdfjs/types').DatasetCore[]} */
  const collectedReports = []
  let totalViolations = 0
  let aborted = false

  return new Transform({
    objectMode: true,
    async transform(chunk, encoding, callback) {
      try {
        if (aborted) {
          callback()
          return
        }

        if (maxViolations && totalViolations > maxViolations) {
          context.logger.warn('Exceeded max violations. Aborting')
          aborted = true
          callback()
          return
        }

        const validator = new SHACLValidator(shapes || chunk, { maxErrors: 0, factory: context.env })
        const report = await validator.validate(chunk)

        if (!report.conforms) {
          for (const result of report.results) {
            if (result.severity) counter.add(result.severity)
          }
          totalViolations = counter.termMap.get(context.env.ns.sh.Violation) ?? 0
          collectedReports.push(report.dataset)
        }

        callback()
      } catch (err) {
        callback(err)
      }
    },
    flush(callback) {
      // Log violation counts
      counter.termMap.forEach((count, term) => {
        context.logger.warn(`${count} results with severity ${term.value}`)
      })

      // Push all collected reports
      for (const dataset of collectedReports) {
        this.push(dataset)
      }

      // If no violations, push a conforming validation report
      if (counter.termMap.size === 0) {
        const report = context.env.dataset()
        const blankNode = context.env.blankNode('report')
        report.add(context.env.quad(blankNode, context.env.ns.rdf.type, context.env.ns.sh.ValidationReport))
        report.add(context.env.quad(blankNode, context.env.ns.sh.conforms, context.env.literal('true', context.env.ns.xsd.boolean)))
        this.push(report)
      }

      callback()
    },
  })
}

/**
 * @this {import('@lindas/barnard59-core').Context}
 * @param {import('stream').Stream | { shape: import('stream').Stream, maxErrors?: number }} arg
 * @return {Promise<Transform>}
 */
export async function shacl(arg) {
  let shape
  let options
  /** @type {number | undefined} */
  let maxViolations
  if (isStream(arg)) {
    shape = arg
  } else if (arg) {
    ({ shape, ...options } = arg)
    maxViolations = options.maxErrors < 1 ? 0 : Number(options.maxErrors)
  }

  let ds
  if (!shape) {
    this.logger.info('No shapes found. Will validate each chunk against shapes found in the chunk itself')
  } else {
    if (!isReadableStream(shape)) {
      throw new Error(`${shape} is not a readable stream`)
    }
    ds = await this.env.dataset().import(shape)
  }

  return createValidationTransform({
    context: this,
    shapes: ds,
    maxViolations,
  })
}
