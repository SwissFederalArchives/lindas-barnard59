# barnard59-formats

## 5.0.2

### Patch Changes

- d55915d: Bump patch versions for all lindas-trifid packages to ensure they are available on npm
  with the LINDAS namespace
- Updated dependencies [d55915d]
  - lindas-barnard59-base@3.0.2

## 5.0.1

### Patch Changes

- 02c2689: Fix all import references to use lindas-barnard59 package names

  Updated all source and test file imports to reference the renamed lindas-barnard59 packages instead of the old barnard59 names. External packages like barnard59-test-support remain unchanged.

- Updated dependencies [02c2689]
  - lindas-barnard59-base@3.0.1

## 5.0.0

### Major Changes

- d98737d: Rename all packages with lindas- prefix for LINDAS project

  This is a major version bump as we're publishing these packages under new names (lindas-barnard59-\*) forked from the upstream zazuko/barnard59 repository. All package names, internal dependencies, and repository URLs have been updated to reflect the LINDAS branding.

### Patch Changes

- Updated dependencies [d98737d]
  - lindas-barnard59-base@3.0.0

## 4.0.1

### Patch Changes

- 4de8909: Updated `@rdfjs/serializer-ntriples`
- 4de8909: Update `rdfxml-streaming-parser` to v3

## 4.0.0

### Major Changes

- 01682f7: Updating `@zazuko/rdf-parser-csvw` to v0.17. See https://github.com/zazuko/rdf-parser-csvw/blob/master/CHANGELOG.md#0170

## 3.0.0

### Major Changes

- 8282b0e: CSVW: By default, will trim whitespace from header names

### Patch Changes

- 8282b0e: Use `@zazuko/rdf-parser-csvw` and `@zazuko/rdf-parser-csvw-xlsx`

## 2.1.2

### Patch Changes

- cd81cc1: Added type declarations
- 6fea1cc: Context was unbound in step `jsonld/parse/object`
- 1df0b79: Ensures that the RDF/JS environment is used with parser streams

## 2.1.1

### Patch Changes

- 57bb930: Ensures that the RDF/JS environment is used with parser streams

## 2.1.0

### Minor Changes

- ce0bdf4: Removed dependency on any RDF/JS Environment. The CLI provides it at runtime to ensure that steps
  use the same factories. Step implementors are encouraged to use the environment provided by the
  barnard59 runtime insead of importing directly.

  ```diff
  -import rdf from 'rdf-ext'

  export function myStep() {
  - const dataset = rdf.dataset()
  + const dataset = this.env.dataset()

    return rdf.dataset().toStream()
  }
  ```

### Patch Changes

- Updated dependencies [67504df]
  - barnard59-base@2.0.1

## 2.0.0

### Major Changes

- 6be7cd8: Literals loaded as step arguments will be converted to matching JS type (closes #116)
- 72648c5: Change the operation URLs to be HTTPS (re zazuko/barnard59-website#4).
  This will only be a breaking change to those using the [shorthand step syntax](https://data-centric.zazuko.com/docs/workflows/explanations/simplified-syntax).

### Patch Changes

- Updated dependencies [64b50ac]
- Updated dependencies [6be7cd8]
- Updated dependencies [72648c5]
  - barnard59-base@2.0.0

## 1.4.2

### Patch Changes

- f0814d5: Operations in manifest had wrong types
- Updated dependencies [f0814d5]
  - barnard59-base@1.2.2

## 1.4.1

### Patch Changes

- 93b33d0: The package would use `rdf-ext` but it was not a dependency. Using `@zazuko/env` instead

## 1.4.0

### Minor Changes

- f09e8b0: Forward n3 step options to parser (closes #24). For example, to parse n3 rules

  ```turtle
  [
    a :Step ;
    code:implementedBy
      [
        a code:EcmaScriptModule ;
        code:link <node:barnard59-formats/n3.js#parse>
      ] ;
    code:arguments
      [
        code:name "format" ;
        code:value "text/n3" ;
      ] ;
  ]
  ```

## 1.3.1

### Patch Changes

- 59d713f: Updated RDF/JS packages to v2
- 396d36e: Correct rdf/xml usage in manifest (closes #20)

- Moved to JavaScript modules
