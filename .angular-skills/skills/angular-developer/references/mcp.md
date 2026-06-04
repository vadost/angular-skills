# Angular CLI MCP Server

The Angular CLI includes a Model Context Protocol (MCP) server that enables AI assistants in your development environment to interact with the Angular CLI. It provides tools for project analysis, official documentation search, guided migrations, code generation, package installation, builds, tests, and more.

## Available Tools (Default)

When the MCP server is enabled, AI agents have access to these default tools:

| Name                        | Description                                                                                               |
| :-------------------------- | :-------------------------------------------------------------------------------------------------------- |
| `ai_tutor`                  | Launches an interactive AI-powered Angular tutor.                                                         |
| `find_examples`             | Finds authoritative Angular code examples from official best-practice examples.                           |
| `get_best_practices`        | Retrieves the Angular Best Practices Guide for modern Angular code.                                       |
| `list_projects`             | Lists all applications and libraries in the workspace by reading `angular.json`.                          |
| `onpush_zoneless_migration` | Analyzes code and provides a plan to migrate it to `OnPush` change detection.                             |
| `search_documentation`      | Searches the official documentation at `https://angular.dev`.                                             |

## Experimental Tools

Some tools must be enabled explicitly using the `--experimental-tool` or `-E` flag.

| Name                       | Description                                                           |
| :------------------------- | :-------------------------------------------------------------------- |
| `build`                    | Performs a one-off build using `ng build`.                            |
| `devserver.start`          | Asynchronously starts a dev server similar to `ng serve`.             |
| `devserver.stop`           | Stops a dev server started by `devserver.start`.                      |
| `devserver.wait_for_build` | Returns logs from the most recent build in a running dev server.      |
| `e2e`                      | Executes end-to-end tests configured in the project.                  |
| `modernize`                | Performs code migrations and gives modernization instructions.        |
| `test`                     | Runs the project's unit tests.                                        |

## Get Started

To get started from a terminal, run:

```bash
ng mcp
```

When run from an interactive terminal, this command displays host configuration instructions. You can also configure the host manually with the snippets below.

## Cursor

Create `.cursor/mcp.json` in the project root, or configure it globally at `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

## Firebase Studio

Create `.idx/mcp.json` in the project root:

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

## Gemini CLI

Create `.gemini/settings.json` in the project root:

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

## JetBrains IDEs

In JetBrains IDEs, after installing the JetBrains AI Assistant plugin, go to `Settings | Tools | AI Assistant | Model Context Protocol (MCP)`. Add a new server, select `As JSON`, and paste:

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

## VS Code

Create `.vscode/mcp.json` in the project root. VS Code uses the `servers` property:

```json
{
  "servers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

## Other IDEs

Check your IDE documentation for the correct MCP configuration file location, often `mcp.json`. The configuration should contain:

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

## Command Options

Pass options to the MCP server in the `args` array of your host configuration:

- `--read-only`: Only registers tools that do not modify the project.
- `--local-only`: Only registers tools that do not require an internet connection.
- `--experimental-tool` or `-E`: Enables specific experimental tools. Use `-E devserver` to enable all `devserver.x` tools.

Example for read-only mode in VS Code:

```json
{
  "servers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp", "--read-only"]
    }
  }
}
```
