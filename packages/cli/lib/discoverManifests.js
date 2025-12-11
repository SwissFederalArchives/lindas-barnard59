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
    console.error('[lindas-barnard59] Processing package:', pkg)
    try {
      const { version } = require(`${pkg}/package.json`)
      const manifestPath = require.resolve(`${pkg}/manifest.ttl`)
      console.error('[lindas-barnard59] Loading manifest from:', manifestPath)
      const dataset = await rdf.dataset().import(rdf.fromFile(manifestPath))
      const lindasMatched = pkg.match(lindasPackagePattern)
      const originalMatched = pkg.match(originalPackagePattern)
      const matched = lindasMatched || originalMatched
      if (matched) {
        console.error('[lindas-barnard59] Yielding command:', matched[1])
        yield {
          name: matched[1],
          manifest: rdf.clownface({ dataset }),
          version,
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[lindas-barnard59] Failed to load package', pkg, ':', message)
    }
  }
}

/**
 * @param {boolean} [all]
 * @return {Promise<string[]>}
 */
async function getInstalledPackages(all) {
  console.error('[lindas-barnard59] getInstalledPackages called, isInstalledGlobally:', isInstalledGlobally)

  const allPackages = []

  // Try global packages
  try {
    let npmList = 'npm list -g'
    if (all) {
      npmList += ' --all'
    }
    const globalPackages = await new Promise((resolve, reject) => {
      exec(npmList, (err, stdout, stderr) => {
        // npm list exits with code 1 if there are peer dependency warnings,
        // but still outputs the package list to stdout, so we should parse it
        if (err && !stdout) {
          if (err instanceof Error) {
            console.error('[lindas-barnard59] Failed to list globally installed packages:', err.message)
          }
          console.error('[lindas-barnard59] stderr:', stderr)
          resolve([])
        } else {
          // Match both @lindas/barnard59-* and barnard59-* packages
          const lindasMatches = stdout.match(/(?<pkg>@lindas\/barnard59-[^\s]+)/g) || []
          const originalMatches = stdout.match(/(?<pkg>barnard59-[^@\s]+)/g) || []
          const allMatches = [...lindasMatches, ...originalMatches]
          console.error('[lindas-barnard59] Found globally installed packages:', allMatches)
          resolve([...new Set(allMatches)])
        }
      })
    })
    allPackages.push(...globalPackages)
  } catch (err) {
    console.error('[lindas-barnard59] Global package discovery failed')
  }

  // Always check local packages too - merge with global packages
  const packagePath = await findUp(['package-lock.json', 'yarn.lock'])
  if (packagePath) {
    const lindasPackages = (getInstalledPackage('@lindas/barnard59-*', dirname(packagePath)) || []).map(pkg => pkg.name)
    const originalPackages = (getInstalledPackage('barnard59-*', dirname(packagePath)) || []).map(pkg => pkg.name)
    console.error('[lindas-barnard59] Found locally installed packages:', [...lindasPackages, ...originalPackages])
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
