const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

describe('addEnv command', () => {
  const originalCwd = process.cwd();
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'devkit-addenv-'));
    process.chdir(tempDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('creates a .env file from .env.example', async () => {
    const envExamplePath = path.join(process.cwd(), '.env.example');
    const exampleContent = [
      '# Example environment configuration',
      'NODE_ENV=development',
      'PORT=3000',
    ].join('\n');

    fs.writeFileSync(envExamplePath, exampleContent, 'utf8');

    // Mock readline so prompts auto-accept defaults without blocking.
    const createInterfaceSpy = vi
      .spyOn(readline, 'createInterface')
      .mockImplementation(() => {
        return {
          question(prompt, cb) {
            // Always accept default by sending an empty answer.
            cb('');
          },
          close() {},
        };
      });

    const addEnv = require('../commands/addEnv');

    try {
      await addEnv();
    } finally {
      createInterfaceSpy.mockRestore();
    }

    const envPath = path.join(process.cwd(), '.env');
    expect(fs.existsSync(envPath)).toBe(true);

    const envContent = fs.readFileSync(envPath, 'utf8');
    expect(envContent).toContain('NODE_ENV=development');
    expect(envContent).toContain('PORT=3000');
  });
});

