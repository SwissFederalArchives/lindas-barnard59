# barnard59-env

## 2.0.1

### Patch Changes

- 02c2689: Fix all import references to use lindas-barnard59 package names

  Updated all source and test file imports to reference the renamed lindas-barnard59 packages instead of the old barnard59 names. External packages like barnard59-test-support remain unchanged.

## 2.0.0

### Major Changes

- d98737d: Rename all packages with lindas- prefix for LINDAS project

  This is a major version bump as we're publishing these packages under new names (lindas-barnard59-\*) forked from the upstream zazuko/barnard59 repository. All package names, internal dependencies, and repository URLs have been updated to reflect the LINDAS branding.

## 1.2.7

### Patch Changes

- 4de8909: Updated `@zazuko/env-node` to v3

## 1.2.6

### Patch Changes

- 1df0b79: Update `@zazuko/env-node`

## 1.2.5

### Patch Changes

- 57bb930: Update `@zazuko/env-node`

## 1.2.4

### Patch Changes

- 287efab: Accurate imports to work with `moduleResolution=NodeNext`

## 1.2.3

### Patch Changes

- 9178b7e: .d.ts files were not included in package

## 1.2.2

### Patch Changes

- c090ff2: Update `@zazuko/env` to v2
- 82dbe7e: Exported environment did not include fs functionality

## 1.2.1

### Patch Changes

- 86131dc: Updated `@zazuko/vocabulary-extras-builders`

## 1.2.0

### Minor Changes

- 5a70d2b: Added type namespace builders of Zazuko vocabularies
- 5a70d2b: Bundle type declarations (source migrated to TypeScript)

## 1.1.0

### Minor Changes

- e0bab1a: Added `cube` and `meta` namespaces

## 1.0.0

### Major Changes

- ce0bdf4: First release
