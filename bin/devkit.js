#!/usr/bin/env node

/**
 * devkit-cli
 *
 * A small DX-focused toolkit to help developers quickly bootstrap Node.js projects
 * and manage common setup tasks like environment configuration and dev server running.
 */

const { Command } = require('commander');
const path = require('path');

const pkg = require(path.join(__dirname, '..', 'package.json'));

const initCommand = require('../commands/init');
const addEnvCommand = require('../commands/addEnv');
const runDevCommand = require('../commands/runDev');

const program = new Command();

program
  .name('devkit')
  .description('Developer Experience toolkit CLI for Node.js projects')
  .version(pkg.version);

program
  .command('init <project-name>')
  .description('Initialize a new Node.js project with a clean structure')
  .option('--ts, --typescript', 'Initialize the project with TypeScript support')
  .action((projectName, options) => {
    initCommand(projectName, options).catch((err) => {
      console.error('❌ Failed to initialize project.');
      if (err && err.message) {
        console.error(`Reason: ${err.message}`);
      } else {
        console.error(err);
      }
      process.exitCode = 1;
    });
  });

program
  .command('add')
  .description('Add helpers or configuration to the current project')
  .command('env')
  .description('Create a .env file from .env.example and prompt for values')
  .action(() => {
    addEnvCommand().catch((err) => {
      console.error('❌ Failed to create .env file.');
      if (err && err.message) {
        console.error(`Reason: ${err.message}`);
      } else {
        console.error(err);
      }
      process.exitCode = 1;
    });
  });

program
  .command('run')
  .description('Run convenience commands on the current project')
  .command('dev')
  .description('Run the dev server using "npm run dev"')
  .action(() => {
    runDevCommand().catch((err) => {
      console.error('❌ Failed to run dev server.');
      if (err && err.message) {
        console.error(`Reason: ${err.message}`);
      } else {
        console.error(err);
      }
      process.exitCode = 1;
    });
  });

// Show help if no args are passed
if (process.argv.length <= 2) {
  program.outputHelp();
} else {
  program.parse(process.argv);
}

