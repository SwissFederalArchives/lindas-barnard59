/* eslint-disable no-console */
import { EventEmitter } from 'events'

function monitor(stream: EventEmitter, prefix: string): void {
  stream.on('close', () => {
    console.log(`${prefix}: close`)
  })

  stream.on('end', () => {
    console.log(`${prefix}: end`)
  })

  stream.on('error', () => {
    console.log(`${prefix}: error`)
  })

  stream.on('finish', () => {
    console.log(`${prefix}: finish`)
  })
}

export {
  monitor,
}
