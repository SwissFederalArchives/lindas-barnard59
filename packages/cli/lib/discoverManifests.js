import * as module from 'module'
import { exec } from 'child_process'
import { dirname } from 'path'
import { getInstalledPackage } from 'pkgscan'
import isInstalledGlobally from 'is-installed-globally'
import rdf from 'lindas-barnard59-env'
import { packageDirectory } from 'pkg-dir'
import { findUp } from 'find-up'

const packagePattern = /^(?:lindas-)?barnard59-(.+)$/

/**
 * @param {object} [options]
 * @param {string} [options.basePath]
 * @param {boolean} [options.all]
 * @returns {AsyncGenerator<{ name: string, manifest: import('clownface').AnyPointer, version: string }, void, unknown>}
 */
export default async function * ({ basePath = import.meta.url, all = false } = {}) {
  const require = module.createRequire(basePath)
  const hasManifest = canRequireManifest.bind(null, require)

  const packages = (await getInstalledPackages(all)).filter(hasManifest)

  const dir = await packageDirectory()
  if (hasManifest(dir)) {
    const { name, version } = require(`${dir}/package.json`)
    yield {
      name: packagePattern.test(name) ? name.match(packagePattern)[1] : name,
      manifest: rdf.clownface({ dataset: await rdf.dataset().import(rdf.fromFile(`${dir}/manifest.ttl`)) }),
      version,
    }
  }

  for (const pkg of packages) {
    console.log('[barnard59] Processing package:', pkg)
    try {
      const { version } = require(`${pkg}/package.json`)
      const manifestPath = require.resolve(`${pkg}/manifest.ttl`)
      console.log('[barnard59] Loading manifest from:', manifestPath)
      const dataset = await rdf.dataset().import(rdf.fromFile(manifestPath))
      const matched = pkg.match(packagePattern)
      if (matched) {
        console.log('[barnard59] Yielding command:', matched[1])
        yield {
          name: matched[1],
          manifest: rdf.clownface({ dataset }),
          version,
        }
      }
    } catch (err) {
      console.error('[barnard59] Failed to load package', pkg, ':', err.message)
    }
  }
}

/**
 * @param {boolean} [all]
 * @return {Promise<string[]>}
 */
async function getInstalledPackages(all) {
  console.log('[barnard59] getInstalledPackages called, isInstalledGlobally:', isInstalledGlobally)

  // Try global first, always - isInstalledGlobally can be unreliable
  try {
    let npmList = 'npm list -g'
    if (all) {
      npmList += ' --all'
    }
    const result = await new Promise((resolve, reject) => {
      exec(npmList, (err, stdout, stderr) => {
        // npm list exits with code 1 if there are peer dependency warnings,
        // but still outputs the package list to stdout, so we should parse it
        if (err && !stdout) {
          console.error('[barnard59] Failed to list globally installed packages:', err.message)
          console.error('[barnard59] stderr:', stderr)
          reject(err)
        } else {
          const matches = stdout.match(/(?<pkg>(?:lindas-)?barnard59-[^@]+)/g)
          console.log('[barnard59] Found globally installed packages:', matches)
          resolve([...new Set(matches || [])])
        }
      })
    })
    if (result.length > 0) {
      return result
    }
  } catch (err) {
    console.log('[barnard59] Global package discovery failed, trying local')
  }

  // Fallback to local
  const packagePath = await findUp(['package-lock.json', 'yarn.lock'])
  if (!packagePath) {
    return []
  }
  return (getInstalledPackage('{barnard59-*,lindas-barnard59-*}', dirname(packagePath)) || []).map(pkg => pkg.name)
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
