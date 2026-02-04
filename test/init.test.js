const fs = require('fs');
const path = require('path');
const os = require('os');

describe('init command', () => {
  const originalCwd = process.cwd();
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'devkit-init-'));
    process.chdir(tempDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('creates basic project structure and files', async () => {
    // Ensure global user config (if present) does not affect this test.
    const configModule = require('../lib/config');
    vi.spyOn(configModule, 'loadGlobalConfig').mockReturnValue({});

    const init = require('../commands/init');

    const projectName = 'my-app';

    await init(projectName);

    const projectDir = path.join(tempDir, projectName);
    const srcDir = path.join(projectDir, 'src');

    expect(fs.existsSync(projectDir)).toBe(true);
    expect(fs.existsSync(srcDir)).toBe(true);
    expect(fs.existsSync(path.join(srcDir, 'index.js'))).toBe(true);
    expect(fs.existsSync(path.join(projectDir, '.env.example'))).toBe(true);
    expect(fs.existsSync(path.join(projectDir, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(projectDir, 'README.md'))).toBe(true);
  });
});

