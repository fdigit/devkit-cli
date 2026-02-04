const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

/**
 * Run the dev server using "npm run dev" in the current directory.
 *
 * This command:
 * - Checks that a package.json exists
 * - Verifies that a "dev" script is defined
 * - Spawns "npm run dev" with inherited stdio
 *
 * @returns {Promise<void>}
 */
async function runDev() {
  const cwd = process.cwd();
  const packageJsonPath = path.join(cwd, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(
      'No package.json found in the current directory. ' +
        'Run this command from a Node.js project root.'
    );
  }

  let pkg;
  try {
    const raw = fs.readFileSync(packageJsonPath, 'utf8');
    pkg = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to read or parse package.json: ${err.message}`);
  }

  if (!pkg.scripts || !pkg.scripts.dev) {
    throw new Error(
      'No "dev" script found in package.json. ' +
        'Add a "dev" script (e.g. "dev": "node src/index.js") and try again.'
    );
  }

  console.log('▶️  Running "npm run dev"...');

  await new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', 'dev'], {
      cwd,
      stdio: 'inherit',
      shell: true, // ensures compatibility on Windows
    });

    child.on('error', (err) => {
      reject(new Error(`Failed to start dev server: ${err.message}`));
    });

    child.on('exit', (code) => {
      if (code === 0) {
        console.log('✅ Dev server exited successfully.');
        resolve();
      } else {
        reject(new Error(`"npm run dev" exited with code ${code}`));
      }
    });
  });
}

module.exports = runDev;

