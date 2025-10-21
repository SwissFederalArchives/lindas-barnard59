# barnard59-http

## 3.0.1

### Patch Changes

- 02c2689: Fix all import references to use lindas-barnard59 package names

  Updated all source and test file imports to reference the renamed lindas-barnard59 packages instead of the old barnard59 names. External packages like barnard59-test-support remain unchanged.

## 3.0.0

### Major Changes

- d98737d: Rename all packages with lindas- prefix for LINDAS project

  This is a major version bump as we're publishing these packages under new names (lindas-barnard59-\*) forked from the upstream zazuko/barnard59 repository. All package names, internal dependencies, and repository URLs have been updated to reflect the LINDAS branding.

## 2.1.0

### Minor Changes

- f4c4fc6: Add overload to `get` and `post` to match the signature of native `fetch`

### Patch Changes

- cb4223b: Added TS declarations

## 2.0.0

### Major Changes

- 6be7cd8: Literals loaded as step arguments will be converted to matching JS type (closes #116)
- 72648c5: Change the operation URLs to be HTTPS (re zazuko/barnard59-website#4).
  This will only be a breaking change to those using the [shorthand step syntax](https://data-centric.zazuko.com/docs/workflows/explanations/simplified-syntax).

## 1.1.1

### Patch Changes

- f0814d5: Operations in manifest had wrong types
- 295db4c: Updated `node-fetch` to v3 and allow `readable-stream` v4

- Moved to JavaScript modules
