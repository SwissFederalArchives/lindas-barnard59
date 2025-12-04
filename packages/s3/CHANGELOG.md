# barnard59-s3

## 1.0.2

### Patch Changes

- d55915d: Bump patch versions for all lindas-trifid packages to ensure they are available on npm
  with the LINDAS namespace

## 1.0.1

### Patch Changes

- 02c2689: Fix all import references to use lindas-barnard59 package names

  Updated all source and test file imports to reference the renamed lindas-barnard59 packages instead of the old barnard59 names. External packages like barnard59-test-support remain unchanged.

## 1.0.0

### Major Changes

- d98737d: Rename all packages with lindas- prefix for LINDAS project

  This is a major version bump as we're publishing these packages under new names (lindas-barnard59-\*) forked from the upstream zazuko/barnard59 repository. All package names, internal dependencies, and repository URLs have been updated to reflect the LINDAS branding.

## 0.3.0

### Minor Changes

- 4b9ce9d: Allow `getObject` and `putObject` operations to be used inside a barnard59 pipeline, as they are now returning a stream.
  They can be used at any place in the list of steps, as it will not change anything in the stream.

  The `getStreamObject` operation is also now available, which returns a stream of a S3 object.
  This can be used to create a stream, where you can then transform by using other barnard59 operations.

  To upload a stream to S3, you will need to first write the stream to a file and then use `putObject` to upload the file to S3.

## 0.2.0

### Minor Changes

- 6be7cd8: Literals loaded as step arguments will be converted to matching JS type (closes #116)
- 72648c5: Change the operation URLs to be HTTPS (re zazuko/barnard59-website#4).
  This will only be a breaking change to those using the [shorthand step syntax](https://data-centric.zazuko.com/docs/workflows/explanations/simplified-syntax).

## 0.1.0

### Minor Changes

- 10b4bf5: Add support for S3 GetObject and PutObject methods
