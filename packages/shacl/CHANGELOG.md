# barnard59-shacl

## 2.0.2

### Patch Changes

- d55915d: Bump patch versions for all lindas-trifid packages to ensure they are available on npm
  with the LINDAS namespace
- Updated dependencies [d55915d]
  - lindas-barnard59-base@3.0.2
  - lindas-barnard59-formats@5.0.2
  - lindas-barnard59-rdf@4.0.2

## 2.0.1

### Patch Changes

- 02c2689: Fix all import references to use lindas-barnard59 package names

  Updated all source and test file imports to reference the renamed lindas-barnard59 packages instead of the old barnard59 names. External packages like barnard59-test-support remain unchanged.

- Updated dependencies [02c2689]
  - lindas-barnard59-base@3.0.1
  - lindas-barnard59-formats@5.0.1
  - lindas-barnard59-rdf@4.0.1

## 2.0.0

### Major Changes

- d98737d: Rename all packages with lindas- prefix for LINDAS project

  This is a major version bump as we're publishing these packages under new names (lindas-barnard59-\*) forked from the upstream zazuko/barnard59 repository. All package names, internal dependencies, and repository URLs have been updated to reflect the LINDAS branding.

### Patch Changes

- Updated dependencies [d98737d]
  - lindas-barnard59-base@3.0.0
  - lindas-barnard59-formats@5.0.0
  - lindas-barnard59-rdf@4.0.0

## 1.4.11

### Patch Changes

- bbfcc2d: Updated `rdf-validate-shacl` to 0.6
- Updated dependencies [4de8909]
- Updated dependencies [4de8909]
- Updated dependencies [4de8909]
  - barnard59-formats@4.0.1
  - barnard59-rdf@3.4.1

## 1.4.10

### Patch Changes

- d4e9dd7: Makes `--shapes` optional when running `b59 validate`. If skipped, will validate against shapes found in the standard input alongside data

## 1.4.9

### Patch Changes

- Updated dependencies [01682f7]
  - barnard59-formats@4.0.0

## 1.4.8

### Patch Changes

- 83583d2: Type annotations: remove references to `rdf-js`, using `@rdfjs/types` instead

## 1.4.7

### Patch Changes

- Updated dependencies [8282b0e]
- Updated dependencies [8282b0e]
  - barnard59-formats@3.0.0

## 1.4.6

### Patch Changes

- f1caca5: barnard59-shacl: rephrase messages in human-readable report
- a292c2e: Updated `rdf-validate-shacl` to v0.5.5
- Updated dependencies [57bb930]
  - barnard59-formats@2.1.1

## 1.4.5

### Patch Changes

- 287efab: Accurate imports to work with `moduleResolution=NodeNext`

## 1.4.4

### Patch Changes

- 600eb0e: Updated `rdf-validate-shacl` to v0.5.4
- 49dcd13: Update `@rdfjs/to-ntriples` to v3
- Updated dependencies [f6d593c]
  - barnard59-base@2.4.2

## 1.4.3

### Patch Changes

- d48f198: Remove usage of `rdf-js` package (deprecated)
- f8e7504: Fix sh:conforms in case of results with any severity
- Updated dependencies [d48f198]
- Updated dependencies [94551a4]
  - barnard59-base@2.4.1

## 1.4.2

### Patch Changes

- 052b1a5: Produce SHACL report on successful validation

## 1.4.1

### Patch Changes

- e82aa36: Remove references of `rdf-js` types package, repaced with `@rdfjs/types`

## 1.4.0

### Minor Changes

- 452d885: Added `report-summary` command

## 1.3.1

### Patch Changes

- c090ff2: Updated `rdf-validate-shacl`
- Updated dependencies [82dbe7e]
- Updated dependencies [7456a6a]
  - barnard59-rdf@3.4.0
  - barnard59-base@2.4.0

## 1.3.0

### Minor Changes

- cf2f15c: Bundle TypeScript type declarations

### Patch Changes

- Updated dependencies [0c0245d]
- Updated dependencies [464b09e]
- Updated dependencies [ba328de]
  - barnard59-base@2.3.0

## 1.2.0

### Minor Changes

- f883060: When fetching shapes, `code:imports` declarations are resolved and merged with the graph

### Patch Changes

- Updated dependencies [f883060]
- Updated dependencies [898c80f]
- Updated dependencies [f883060]
- Updated dependencies [898c80f]
- Updated dependencies [1bfec3c]
  - barnard59-rdf@3.3.0

## 1.1.3

### Patch Changes

- 5c14dc9: Add parameter to override the format of the shapes graph
- Updated dependencies [5c14dc9]
  - barnard59-rdf@3.2.2

## 1.1.2

### Patch Changes

- ebe9128: prevent potential memory leaks by creating a fresh validator for each chunk
- Updated dependencies [c759278]
- Updated dependencies [ebe9128]
  - barnard59-rdf@3.2.1

## 1.1.1

### Patch Changes

- c80f82b: Resolve shapes against working directory
- Updated dependencies [b833a62]
  - barnard59-rdf@3.2.0

## 1.1.0

### Minor Changes

- d5249ee: Added a pipeline command which validates quads from standard input

### Patch Changes

- Updated dependencies [e0b6f85]
- Updated dependencies [0431adf]
  - barnard59-base@2.2.0
  - barnard59-rdf@3.1.0

## 1.0.0

### Major Changes

- 430ce8a: Update manifest: current namespace and use HTTPS URL
- Renamed from `barnard59-validate-shacl` to `barnard59-shacl`

### Minor Changes

- 430ce8a: Update `rdf-validate-shacl` to v0.5
- 430ce8a: Remove dependency on `@zazuko/env` and use environment provided at runtime.

- First version
