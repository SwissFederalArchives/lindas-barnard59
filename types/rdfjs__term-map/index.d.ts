// Type declarations for @rdfjs/term-map/Factory.js
declare module '@rdfjs/term-map/Factory.js' {
  import type { Term } from '@rdfjs/types'

  export interface TermMapFactory {
    termMap<T>(entries?: Iterable<[Term, T]>): Map<Term, T>
  }

  const Factory: TermMapFactory
  export default Factory
}
