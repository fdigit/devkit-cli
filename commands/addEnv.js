const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Create a .env file from .env.example and prompt the user
 * to fill in values for each environment variable.
 *
 * This improves DX by:
 * - Avoiding manual copy/paste of .env.example
 * - Providing guided prompts so devs know what each variable is
 *
 * @returns {Promise<void>}
 */
async function addEnv() {
  const cwd = process.cwd();
  const envExamplePath = path.join(cwd, '.env.example');
  const envPath = path.join(cwd, '.env');

  if (!fs.existsSync(envExamplePath)) {
    throw new Error(
      'No .env.example file found in the current directory. ' +
        'Run this command from a project initialized with devkit-cli or add a .env.example file.'
    );
  }

  if (fs.existsSync(envPath)) {
    console.log('⚠️  A .env file already exists. No changes were made.');
    console.log('    If you want to regenerate it, delete the existing .env and run this command again.');
    return;
  }

  const exampleContent = fs.readFileSync(envExamplePath, 'utf8');
  const lines = exampleContent.split(/\r?\n/);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  /**
   * Promisified question helper.
   * @param {string} query
   * @returns {Promise<string>}
   */
  const ask = (query) =>
    new Promise((resolve) => {
      rl.question(query, (answer) => resolve(answer));
    });

  console.log('🧩 Creating .env from .env.example');
  console.log('You will now be prompted for each environment variable.');
  console.log('Press Enter to accept the default value (if any).');
  console.log('');

  const resultLines = [];

  for (const line of lines) {
    // Preserve comments and empty lines as-is
    if (!line.trim() || line.trim().startsWith('#')) {
      resultLines.push(line);
      continue;
    }

    const [key, ...rest] = line.split('=');
    const defaultValue = rest.join('='); // support '=' in values

    const promptLabel =
      defaultValue && defaultValue.length > 0
        ? `${key} (default: ${defaultValue}): `
        : `${key}: `;

    // eslint-disable-next-line no-await-in-loop
    const answer = await ask(promptLabel);
    const finalValue = answer !== '' ? answer : defaultValue;

    resultLines.push(`${key}=${finalValue}`);
  }

  rl.close();

  fs.writeFileSync(envPath, resultLines.join('\n'), 'utf8');

  console.log('');
  console.log('✅ .env file created successfully!');
  console.log('   Make sure not to commit .env to version control.');
}

module.exports = addEnv;

