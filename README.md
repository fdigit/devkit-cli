# devkit-cli

[![CI](https://github.com/fdigit/devkit-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/fdigit/devkit-cli/actions/workflows/ci.yml)

`devkit-cli` is a small, DX-focused Node.js command-line tool that helps you:

- **Scaffold new projects** with a clean, consistent structure.
- **Manage environment configuration** via interactive `.env` generation.
- **Run dev servers** with a simple, memorable command.

It is designed to remove repetitive setup work so you can focus on building features.

### Problem devkit-cli solves

- New Node.js services often start with repetitive, error-prone boilerplate (folders, `package.json`, `.env`, scripts).
- Different team members scaffold projects differently, which leads to inconsistent structure and friction.
- Environment variables are easy to forget, mis-name, or mis-configure.

**Demo:** To add a demo GIF, create an `assets` folder, save your recording as `assets/devkit-demo.gif`, then add this at the top of the README: `![devkit-cli demo](./assets/devkit-demo.gif)`.

### Features

- Opinionated `devkit init` command that creates a ready-to-run project.
- `devkit add env` to generate `.env` from `.env.example` via guided prompts.
- `devkit run dev` as a standard entrypoint for local development.
- Optional TypeScript template and global configuration for your default stack.

---

## Installation

**From GitHub (clone and install locally):**

```bash
git clone https://github.com/fdigit/devkit-cli.git
cd devkit-cli
npm install -g .
```

**From npm (if published):**

```bash
npm install -g @mfon/devkit-cli
```

This will install the `devkit` command globally on your system.

---

## Commands & Usage

### `devkit init <project-name>`

**What it does**:

- Creates a new project folder with:
  - `src/`
  - `src/index.js`
  - `.env.example`
  - `package.json`
  - `README.md`
- Wires up a basic Node.js app with a `dev` script.

**Example**:

```bash
devkit init my-app
```

After running:

```bash
cd my-app
npm install
devkit add env   # create your .env interactively
devkit run dev   # run the dev server
```

---

### `devkit add env`

**What it does**:

- Looks for `.env.example` in the **current directory**.
- Prompts you for values for each variable.
- Generates a `.env` file, preserving comments and blank lines.

**Example**:

```bash
devkit add env
```

Run this from the root of a project that contains `.env.example` (such as one created with `devkit init`).

---

### `devkit run dev`

**What it does**:

- Ensures a `package.json` exists in the current directory.
- Verifies a `"dev"` script is defined.
- Runs:

```bash
npm run dev
```

with friendly error messages if anything is misconfigured.

**Example**:

```bash
devkit run dev
```

Run this from a project root that has a `"dev"` script (e.g. created by `devkit init`).

---

## Why this improves Developer Experience

- **Consistency**: Every new project starts with the same structure, scripts, and conventions, reducing onboarding time for teams.
- **Reduced boilerplate**: Replaces manual folder creation, `package.json` setup, and `.env` handling with a few memorable commands.
- **Guided environment setup**: Interactive `.env` creation helps prevent missing or mis-typed variables, which are a common source of runtime bugs.
- **Single entrypoint for common tasks**: `devkit run dev` gives a standard command to start development across projects, even if underlying tooling evolves.
- **Simple, modular design**: Commands are implemented in separate modules, making it easy to maintain, extend, or adapt to your organization’s workflows.

---

## Repository

- **GitHub:** [github.com/fdigit/devkit-cli](https://github.com/fdigit/devkit-cli)
- **npm:** [@mfon/devkit-cli](https://www.npmjs.com/package/@mfon/devkit-cli) (when published)

---

## Local Development

If you want to modify `devkit-cli` itself:

```bash
cd devkit-cli
npm install
npm link   # optional: link globally as `devkit`
```

You can then run:

```bash
devkit --help
```

to see available commands.

---

## Putting this repo on GitHub

1. **Create a new repository on GitHub**
   - Go to [github.com/new](https://github.com/new).
   - Name it `devkit-cli` (or another name; then update links in this README and in `package.json`).
   - Choose **Public**, do not add a README (you already have one).
   - Create the repository.

2. **Initialize git and push** (from the `devkit-cli` folder):

   ```bash
   git init
   git add .
   git commit -m "Initial commit: devkit-cli"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/devkit-cli.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your GitHub username (e.g. `fdigit`). If you use SSH:   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/devkit-cli.git
   ```

3. **Update URLs**  
   If your GitHub username is not `fdigit`, replace `fdigit` with your username in:
   - This README (badge, Installation clone URL, Repository links).
   - `package.json` (`repository`, `bugs`, `homepage`).

After pushing, the **CI** workflow (`.github/workflows/ci.yml`) will run on every push and pull request.
