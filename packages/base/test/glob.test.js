import { array } from 'get-stream'
import { isReadableStream as isReadable, isWritableStream as isWritable } from 'is-stream'
import sinon from 'sinon'
import { expect } from 'chai'
import glob from '../glob.js'

describe('glob', () => {
  let logger

  beforeEach(() => {
    logger = {
      debug: sinon.spy(),
      info: sinon.spy(),
      error: sinon.spy(),
      trace: sinon.spy(),
      warn: sinon.spy(),
      verbose: sinon.spy(),
    }
  })

  it('should return a Readable stream', () => {
    const s = glob.call({ logger }, { pattern: 'test/support/*' })

    expect(isReadable(s)).to.be.true
    expect(isWritable(s)).to.be.false
  })

  it('should emit each file name as a chunk', async () => {
    const s = glob.call({ logger }, { pattern: '../../test/e2e/definitions/foreach/*' })

    const filenames = await array(s)

    // Normalize paths to use forward slashes for cross-platform compatibility
    const normalizedFilenames = filenames.map(f => f.replace(/\\/g, '/'))
    expect(normalizedFilenames).to.contain.all.members([
      '../../test/e2e/definitions/foreach/csv-duplicate.ttl',
      '../../test/e2e/definitions/foreach/with-handler.ttl',
      '../../test/e2e/definitions/foreach/with-variable.ttl',
    ])
  })

  it('should forward additional options', async () => {
    const s = glob.call({ logger }, {
      cwd: '../../test/e2e/definitions/foreach',
      pattern: '*',
    })

    const filenames = await array(s)

    expect(filenames).to.contain.all.members([
      'csv-duplicate.ttl',
      'with-handler.ttl',
      'with-variable.ttl',
    ])
  })

  it('should warn when no files are matched', async () => {
    const s = glob.call({ logger }, {
      cwd: '../../test/e2e/definitions/foreach',
      pattern: 'foobar',
    })

    await array(s)

    expect(logger.warn).to.have.been.called
  })

  it('should not warn files have been matched', async () => {
    const s = glob.call({ logger }, {
      cwd: '../../test/e2e/definitions/foreach',
      pattern: '*',
    })

    await array(s)

    expect(logger.warn).not.to.have.been.called
  })
})
