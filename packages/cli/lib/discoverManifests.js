import * as module from 'module'
import { exec } from 'child_process'
import { dirname } from 'path'
import { getInstalledPackage } from 'pkgscan'
import isInstalledGlobally from 'is-installed-globally'
import rdf from '@lindas/barnard59-env'
import { packageDirectory } from 'pkg-dir'
import { findUp } from 'find-up'

const lindasPackagePattern = /^@lindas\/barnard59-(.+)$/
const originalPackagePattern = /^barnard59-(.+)$/

/**
 * @param {object} [options]
 * @param {string} [options.basePath]
 * @param {boolean} [options.all]
 * @returns {AsyncGenerator<{ name: string, manifest: import('@lindas/clownface').AnyPointer, version: string }, void, unknown>}
 */
export default async function * ({ basePath = import.meta.url, all = false } = {}) {
  const require = module.createRequire(basePath)
  const hasManifest = canRequireManifest.bind(null, require)

  const packages = (await getInstalledPackages(all)).filter(hasManifest)

  const dir = await packageDirectory()
  if (hasManifest(dir)) {
    const { name, version } = require(`${dir}/package.json`)
    let shortName = name
    if (lindasPackagePattern.test(name)) {
      shortName = name.match(lindasPackagePattern)[1]
    } else if (originalPackagePattern.test(name)) {
      shortName = name.match(originalPackagePattern)[1]
    }
    yield {
      name: shortName,
      manifest: rdf.clownface({ dataset: await rdf.dataset().import(rdf.fromFile(`${dir}/manifest.ttl`)) }),
      version,
    }
  }

  for (const pkg of packages) {
    try {
      const { version } = require(`${pkg}/package.json`)
      const manifestPath = require.resolve(`${pkg}/manifest.ttl`)
      const dataset = await rdf.dataset().import(rdf.fromFile(manifestPath))
      const lindasMatched = pkg.match(lindasPackagePattern)
      const originalMatched = pkg.match(originalPackagePattern)
      const matched = lindasMatched || originalMatched
      if (matched) {
        yield {
          name: matched[1],
          manifest: rdf.clownface({ dataset }),
          version,
        }
      }
    } catch {
      // Skip packages that fail to load
    }
  }
}

/**
 * @param {boolean} [all]
 * @return {Promise<string[]>}
 */
async function getInstalledPackages(all) {
  const allPackages = []

  // Try global packages
  try {
    let npmList = 'npm list -g'
    if (all) {
      npmList += ' --all'
    }
    const globalPackages = await new Promise((resolve) => {
      exec(npmList, (err, stdout) => {
        // npm list exits with code 1 if there are peer dependency warnings,
        // but still outputs the package list to stdout, so we should parse it
        if (err && !stdout) {
          resolve([])
        } else {
          // Match both @lindas/barnard59-* and barnard59-* packages
          const lindasMatches = stdout.match(/(?<pkg>@lindas\/barnard59-[^\s]+)/g) || []
          const originalMatches = stdout.match(/(?<pkg>barnard59-[^@\s]+)/g) || []
          const allMatches = [...lindasMatches, ...originalMatches]
          resolve([...new Set(allMatches)])
        }
      })
    })
    allPackages.push(...globalPackages)
  } catch {
    // Global package discovery failed, continue with local packages
  }

  // Always check local packages too - merge with global packages
  const packagePath = await findUp(['package-lock.json', 'yarn.lock'])
  if (packagePath) {
    const lindasPackages = (getInstalledPackage('@lindas/barnard59-*', dirname(packagePath)) || []).map(pkg => pkg.name)
    const originalPackages = (getInstalledPackage('barnard59-*', dirname(packagePath)) || []).map(pkg => pkg.name)
    allPackages.push(...lindasPackages, ...originalPackages)
  }

  return [...new Set(allPackages)]
}

/**
 * @param {NodeRequire} require
 * @param {string} [pkg]
 * @returns {boolean}
 */
function canRequireManifest(require, pkg) {
  try {
    require.resolve(`${pkg}/manifest.ttl`)
    return true
  } catch {
    return false
  }
}
