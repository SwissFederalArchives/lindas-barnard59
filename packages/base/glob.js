import { SpanStatusCode } from '@opentelemetry/api'
import { glob as globFn } from 'glob'
import onetime from 'onetime'
import { Readable } from 'readable-stream'
import tracer from './lib/tracer.js'

/**
 * @this {import('lindas-barnard59-core').Context}
 * @param {{ pattern: string } & Omit<import('glob').GlobOptions, 'withFileTypes'>} options
 * @return {Readable}
 */
function glob({ pattern, ...options }) {
  const { logger } = this
  /** @type {string[]} */
  let filenames = []

  const span = tracer.startSpan('glob')

  const init = onetime(async () => {
    span.addEvent('init')
    filenames = await globFn(pattern, options)
    return filenames.length === 0
  })

  /** @type {Readable} */
  const stream = new Readable({
    objectMode: true,
    read: async () => {
      try {
        const noneMatched = await init()

        if (filenames.length === 0) {
          if (noneMatched) {
            logger.warn(`No files matched by glob '${pattern}'`)
          }
          return stream.push(null)
        }

        if (!stream.push(filenames.shift())) {
          return
        }

        // @ts-ignore
        stream._read()
      } catch (/** @type {any} */ err) {
        span.recordException(err)
        span.setStatus({ code: SpanStatusCode.ERROR, message: err.message })
        stream.destroy(err)
      } finally {
        span.end()
      }
    },
  })

  return stream
}

export default glob
