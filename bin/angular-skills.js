#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const packageRoot = path.resolve(__dirname, '..');
const sourceDir = path.join(packageRoot, '.angular-skills');
const targetDir = path.join(process.cwd(), '.angular-skills');
const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const help = args.has('--help') || args.has('-h');
const skipMcp = args.has('--skip-mcp');

const angularMcpServer = {
  command: 'npx',
  args: ['-y', '@angular/cli', 'mcp'],
};
const mcpSnippetPath = 'mcp/angular-cli-mcp.json';

const editorChoices = [
  {
    label: 'Cursor',
    path: '.cursor/mcp.json',
    key: 'mcpServers',
  },
  {
    label: 'Firebase Studio',
    path: '.idx/mcp.json',
    key: 'mcpServers',
  },
  {
    label: 'Gemini CLI',
    path: '.gemini/settings.json',
    key: 'mcpServers',
  },
  {
    label: 'JetBrains IDEs',
    manual: true,
  },
  {
    label: 'VS Code',
    path: '.vscode/mcp.json',
    key: 'servers',
  },
  {
    label: 'Other IDEs',
    other: true,
    key: 'mcpServers',
  },
  {
    label: 'Skip MCP setup',
    skip: true,
  },
];

function printHelp() {
  console.log(`Angular Skills\n\nUsage:\n  npx github:vadost/angular-skills [--force] [--skip-mcp]\n\nOptions:\n  --force      Replace an existing .angular-skills directory.\n  --skip-mcp   Do not ask to configure the official Angular CLI MCP server.\n  -h, --help   Show this help message.`);
}

function fail(message) {
  console.error(`angular-skills: ${message}`);
  process.exit(1);
}

function createPrompt() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return {
    ask(question) {
      return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer.trim()));
      });
    },
    close() {
      rl.close();
    },
  };
}

async function confirm(prompt, question, defaultValue) {
  const suffix = defaultValue ? ' [Y/n] ' : ' [y/N] ';

  while (true) {
    const answer = (await prompt.ask(question + suffix)).toLowerCase();

    if (!answer) {
      return defaultValue;
    }

    if (answer === 'y' || answer === 'yes') {
      return true;
    }

    if (answer === 'n' || answer === 'no') {
      return false;
    }

    console.log('Please answer yes or no.');
  }
}

async function selectEditor(prompt) {
  console.log('\nSelect where to configure Angular CLI MCP:');
  editorChoices.forEach((choice, index) => {
    console.log(`  ${index + 1}. ${choice.label}`);
  });

  while (true) {
    const answer = await prompt.ask('Enter a number: ');
    const index = Number(answer) - 1;

    if (Number.isInteger(index) && editorChoices[index]) {
      return editorChoices[index];
    }

    console.log(`Please enter a number from 1 to ${editorChoices.length}.`);
  }
}

async function askOtherIdePath(prompt) {
  const defaultPath = 'mcp.json';
  const answer = await prompt.ask(`MCP config file path for your IDE [${defaultPath}]: `);
  return answer || defaultPath;
}

async function askOtherIdeMode(prompt) {
  console.log('\nOther IDEs can use a real config file path or a temporary copy-paste snippet.');
  console.log('  1. Write MCP config to an IDE config path');
  console.log(`  2. Create ${mcpSnippetPath} for manual copy-paste`);

  while (true) {
    const answer = await prompt.ask('Enter a number [1]: ');

    if (!answer || answer === '1') {
      return 'config';
    }

    if (answer === '2') {
      return 'snippet';
    }

    console.log('Please enter 1 or 2.');
  }
}

function getServerConfig(key) {
  return {
    [key]: {
      'angular-cli': angularMcpServer,
    },
  };
}

function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`${path.relative(process.cwd(), filePath)} contains invalid JSON. Fix it and run the command again.`);
  }
}

function writeMcpConfig(relativePath, key) {
  const filePath = path.resolve(process.cwd(), relativePath);
  const config = readJsonFile(filePath);

  config[key] = {
    ...(config[key] && typeof config[key] === 'object' && !Array.isArray(config[key]) ? config[key] : {}),
    'angular-cli': angularMcpServer,
  };

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(config, null, 2)}\n`);

  return path.relative(process.cwd(), filePath);
}

function writeMcpSnippet() {
  return writeMcpConfig(mcpSnippetPath, 'mcpServers');
}

function printManualJetBrainsInstructions() {
  const snippetPath = writeMcpSnippet();

  console.log(`Created ${snippetPath}`);
  console.log('\nJetBrains IDEs require manual setup via the IDE UI:');
  console.log('  Settings | Tools | AI Assistant | Model Context Protocol (MCP)');
  console.log('  Add a new server, select "As JSON", then paste the contents of:');
  console.log(`  ${snippetPath}`);
  console.log('\nYou can delete the mcp/ folder after setup.');
}

async function configureAngularMcp() {
  if (skipMcp) {
    console.log('Skipped Angular CLI MCP setup');
    return;
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    return;
  }

  const prompt = createPrompt();

  try {
    const shouldConfigure = await confirm(
      prompt,
      'Connect the official Angular CLI MCP server?',
      false,
    );

    if (!shouldConfigure) {
      console.log('Skipped Angular CLI MCP setup');
      return;
    }

    const editor = await selectEditor(prompt);

    if (editor.skip) {
      console.log('Skipped Angular CLI MCP setup');
      return;
    }

    if (editor.manual) {
      printManualJetBrainsInstructions();
      return;
    }

    if (editor.other) {
      const mode = await askOtherIdeMode(prompt);

      if (mode === 'snippet') {
        const snippetPath = writeMcpSnippet();
        console.log(`Created ${snippetPath}`);
        console.log('Paste this JSON into your IDE MCP settings, then delete the mcp/ folder if you do not need it.');
        return;
      }
    }

    const configPath = editor.other ? await askOtherIdePath(prompt) : editor.path;
    const writtenPath = writeMcpConfig(configPath, editor.key);
    console.log(`Configured Angular CLI MCP in ${writtenPath}`);
  } finally {
    prompt.close();
  }
}

async function main() {
  if (help) {
    printHelp();
    return;
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

  await configureAngularMcp();
}

main().catch((error) => {
  fail(error.message);
});
