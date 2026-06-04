#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const packageRoot = path.resolve(__dirname, '..');
const sourceDir = path.join(packageRoot, '.angular-skills');
const targetDir = path.join(process.cwd(), '.angular-skills');
const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const help = args.has('--help') || args.has('-h');

function printHelp() {
  console.log(`Angular Skills\n\nUsage:\n  npx github:vadost/angular-skills [--force]\n\nOptions:\n  --force   Replace an existing .angular-skills directory.\n  -h, --help Show this help message.`);
}

function fail(message) {
  console.error(`angular-skills: ${message}`);
  process.exit(1);
}

if (help) {
  printHelp();
  process.exit(0);
}

if (!fs.existsSync(sourceDir)) {
  fail('package is missing the .angular-skills directory.');
}

if (fs.existsSync(targetDir)) {
  if (!force) {
    fail('.angular-skills already exists. Use --force to replace it.');
  }

  fs.rmSync(targetDir, { recursive: true, force: true });
}

fs.cpSync(sourceDir, targetDir, { recursive: true });
console.log('Created .angular-skills');
