const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Safely read and parse a JSON config file.
 * Returns null if the file does not exist or cannot be parsed.
 *
 * @param {string} filePath
 * @returns {object | null}
 */
function readJsonConfigIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf8').trim();
    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch (err) {
    // Config parsing issues should never crash the CLI – log and continue.
    console.warn(
      `[devkit] Failed to read config file at "${filePath}": ${err.message}`
    );
    return null;
  }
}

/**
 * Load the global devkit configuration from the user's home directory.
 *
 * Supported locations:
 * - ~/.devkitrc
 * - ~/.devkit.config.json
 *
 * If both files are present, values from ~/.devkit.config.json override ~/.devkitrc.
 *
 * Example schema:
 * {
 *   "defaultPort": 4000,
 *   "useTypeScript": true
 * }
 *
 * @returns {object} resolved configuration object
 */
function loadGlobalConfig() {
  const homeDir = os.homedir();
  const rcPath = path.join(homeDir, '.devkitrc');
  const jsonPath = path.join(homeDir, '.devkit.config.json');

  const rcConfig = readJsonConfigIfExists(rcPath) || {};
  const jsonConfig = readJsonConfigIfExists(jsonPath) || {};

  // Values from the JSON config take precedence over the rc file.
  return {
    ...rcConfig,
    ...jsonConfig,
  };
}

module.exports = {
  loadGlobalConfig,
};

