const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { loadGlobalConfig } = require('../lib/config');

/**
 * Initialize a new Node.js project with a clean structure.
 *
 * Creates:
 * - src/
 * - src/index.js
 * - .env.example
 * - package.json
 * - README.md
 *
 * @param {string} projectName
 * @param {object} [options] Commander options / flags
 * @returns {Promise<void>}
 */
async function init(projectName, options = {}) {
  const globalConfig = loadGlobalConfig();

  const configPort =
    typeof globalConfig.defaultPort === 'number' &&
    Number.isFinite(globalConfig.defaultPort)
      ? globalConfig.defaultPort
      : null;

  // CLI flags take precedence over global config.
  const cliUseTs = Boolean(options.ts || options.typescript);
  const configUseTs = globalConfig.useTypeScript === true;
  const useTypeScript = cliUseTs || configUseTs;

  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    const stats = fs.statSync(targetDir);

    if (!stats.isDirectory()) {
      throw new Error(`Path "${projectName}" already exists and is not a directory.`);
    }

    const files = fs.readdirSync(targetDir);
    if (files.length > 0) {
      throw new Error(
        `Directory "${projectName}" already exists and is not empty. ` +
          'Please choose a different name or start with an empty directory.'
      );
    }
  } else {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log(`📁 Creating new project in ${targetDir}`);
  if (useTypeScript) {
    console.log('📝 Using TypeScript project template (via CLI flag or global config).');
  }

  // Create src directory and a simple entry point
  const srcDir = path.join(targetDir, 'src');
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }

  const entryExtension = useTypeScript ? 'ts' : 'js';
  const srcIndexPath = path.join(srcDir, `index.${entryExtension}`);
  if (!fs.existsSync(srcIndexPath)) {
    const fileContents = useTypeScript
      ? [
          "import 'dotenv/config';",
          '',
          "console.log('🚀 Welcome to your new devkit-powered TypeScript app!');",
          "console.log('NODE_ENV:', process.env.NODE_ENV || 'development');",
          '',
        ].join('\n')
      : [
          "require('dotenv').config();",
          '',
          "console.log('🚀 Welcome to your new devkit-powered Node.js app!');",
          "console.log('NODE_ENV:', process.env.NODE_ENV || 'development');",
          '',
        ].join('\n');

    fs.writeFileSync(srcIndexPath, fileContents, 'utf8');
  }

  // .env.example with some sensible defaults (configurable via global config)
  const effectivePort = configPort || 3000;
  const envExamplePath = path.join(targetDir, '.env.example');
  if (!fs.existsSync(envExamplePath)) {
    fs.writeFileSync(
      envExamplePath,
      [
        '# Example environment configuration',
        'NODE_ENV=development',
        `PORT=${effectivePort}`,
        `API_URL=http://localhost:${effectivePort}/api`,
        '',
        '# Add your own variables here',
        'SECRET_KEY=changeme',
        '',
      ].join('\n'),
      'utf8'
    );
  }

  // package.json for the generated project
  const projectPackageJsonPath = path.join(targetDir, 'package.json');
  if (!fs.existsSync(projectPackageJsonPath)) {
    const mainEntry = `src/index.${entryExtension}`;

    const projectPackageJson = {
      name: projectName,
      version: '1.0.0',
      private: true,
      main: mainEntry,
      scripts: {
        dev: useTypeScript ? 'ts-node src/index.ts' : 'node ./src/index.js',
        start: useTypeScript ? 'ts-node src/index.ts' : 'node ./src/index.js',
      },
      dependencies: {
        dotenv: '^16.0.0',
      },
    };

    fs.writeFileSync(
      projectPackageJsonPath,
      JSON.stringify(projectPackageJson, null, 2) + '\n',
      'utf8'
    );
  }

  // If TypeScript is enabled, generate a basic tsconfig.json and install dev deps.
  if (useTypeScript) {
    const tsconfigPath = path.join(targetDir, 'tsconfig.json');
    if (!fs.existsSync(tsconfigPath)) {
      const tsconfig = {
        compilerOptions: {
          target: 'ES2020',
          module: 'commonjs',
          moduleResolution: 'node',
          esModuleInterop: true,
          strict: true,
          skipLibCheck: true,
          rootDir: 'src',
          outDir: 'dist',
          types: ['node'],
        },
        include: ['src'],
      };

      fs.writeFileSync(
        tsconfigPath,
        JSON.stringify(tsconfig, null, 2) + '\n',
        'utf8'
      );
    }

    console.log(
      '📦 Installing TypeScript tooling (typescript, ts-node, @types/node) as devDependencies...'
    );

    try {
      await new Promise((resolve, reject) => {
        const child = spawn(
          'npm',
          ['install', '--save-dev', 'typescript', 'ts-node', '@types/node'],
          {
            cwd: targetDir,
            stdio: 'inherit',
            shell: true, // better cross-platform support
          }
        );

        child.on('error', (err) => {
          reject(err);
        });

        child.on('exit', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(
              new Error(`npm install exited with non-zero code: ${code}`)
            );
          }
        });
      });

      console.log('✅ TypeScript tooling installed successfully.');
    } catch (err) {
      console.warn(
        `⚠️  Failed to automatically install TypeScript tooling: ${err.message}`
      );
      console.warn(
        '    You can install them manually with:\n' +
          '    npm install --save-dev typescript ts-node @types/node'
      );
    }
  }

  // README for the generated project
  const projectReadmePath = path.join(targetDir, 'README.md');
  if (!fs.existsSync(projectReadmePath)) {
    const readmeContent = [
      `# ${projectName}`,
      '',
      'This project was bootstrapped with **devkit-cli**.',
      '',
      '## Getting Started',
      '',
      '1. Install dependencies:',
      '   ```bash',
      '   npm install',
      '   ```',
      '',
      '2. Create your `.env` file from `.env.example` (you can use `devkit add env`):',
      '   ```bash',
      '   devkit add env',
      '   ```',
      '',
      '3. Run the dev server:',
      '   ```bash',
      '   devkit run dev',
      '   ```',
      '',
      'Or directly with npm:',
      '',
      '```bash',
      'npm run dev',
      '```',
      '',
      '## Notes',
      '',
      '- Environment variables are loaded using `dotenv` from a `.env` file.',
      '- Edit `src/index.js` to start building your application.',
      '',
    ].join('\n');

    fs.writeFileSync(projectReadmePath, readmeContent, 'utf8');
  }

  console.log('✅ Project initialized successfully!');
  console.log('');
  console.log('Next steps:');
  console.log(`  cd ${projectName}`);
  console.log('  npm install');
  console.log('  devkit add env    # create your .env file interactively');
  console.log('  devkit run dev    # run the dev server');
}

module.exports = init;

