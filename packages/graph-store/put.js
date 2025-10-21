import Client from 'sparql-http-client'
import SinkToWritable from './lib/SinkToWritable.js'
import { toTerm } from './lib/graph.js'

/**
 * @this {import('lindas-barnard59-core').Context}
 * @param {Pick<import('sparql-http-client/StreamClient.js').Options<any>, 'user' | 'password'> & {
 *   endpoint: string,
 *   graph: string | import('clownface').GraphPointer<import('@rdfjs/types').NamedNode> | import('@rdfjs/types').NamedNode,
 * }} options
 * @returns {import('readable-stream').Writable}
 */
function put({ endpoint, graph, user, password }) {
  if (!graph) {
    throw new Error('graph is required')
  }

  const client = new Client({
    factory: this.env,
    storeUrl: endpoint,
    user,
    password,
  })

  return new SinkToWritable(readable => client.store.put(readable, {
    graph: toTerm(this.env, graph),
  }), this)
}

export default put
