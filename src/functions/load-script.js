import window from 'global/window'

const loadedScripts = {}
const onTheFly = {}

/**
 * insert script tag if not present
 * @param {string} src script src
 * @returns {Promise} promise that resolves once the script has been loaded
 */
export function insertScript (src) {
  return new Promise((resolve, reject) => {
    if (loadedScripts[src]) return resolve()

    const script = window.document.createElement('script')

    script.src = src
    script.onload = () => {
      loadedScripts[src] = true
      delete onTheFly[src]
      resolve()
    }
    script.onerror = err => {
      delete onTheFly[src]
      reject(err)
    }

    window.document.body.appendChild(script)
  })
}

/**
 * load src as a script tag avoiding duplication
 * @param {string} src script src
 * @returns {Promise} promise that resolves once the script has been loaded
 */
export function loadScript (src) {
  if (!onTheFly[src]) {
    onTheFly[src] = insertScript(src)
  }
  return onTheFly[src]
}

export default loadScript
