# Serena MCP Integration for Scrolli

This document explains how to use Serena MCP (Model Context Protocol) server with your Scrolli Next.js project.

## What is Serena?

Serena is a powerful coding agent toolkit that provides semantic retrieval and editing capabilities. It integrates with language servers to provide advanced code understanding and manipulation tools.

## Setup Complete ✅

Serena has been installed and configured for your project. Here's what was set up:

1. **Python & uv**: Python 3.13.7 and uv package manager are installed
2. **Serena Installation**: Cloned from https://github.com/oraios/serena and installed with all dependencies
3. **Project Configuration**: Generated `.serena/project.yml` with TypeScript support
4. **MCP Configuration**: Added Serena to Cursor's MCP servers configuration

## How to Use Serena

### Starting Serena MCP Server

You have two options to start the Serena MCP server:

#### Option 1: Using the provided script

```bash
./start-serena.sh
```

#### Option 2: Manual command

```bash
/Users/nihatavci/serena/.venv/bin/serena start-mcp-server --project .
```

### Using Serena in Cursor

Once the MCP server is running, Serena tools will be available in Cursor. The server provides tools for:

- **Semantic Code Search**: Find symbols, references, and code patterns
- **Code Editing**: Insert, replace, and modify code with semantic understanding
- **Project Analysis**: Get overviews of symbols, file structures, and dependencies
- **Refactoring**: Rename symbols across the codebase using language server capabilities

### Available Tools

Serena provides many tools including:

- `find_symbol`: Search for symbols by name
- `find_referencing_symbols`: Find where symbols are referenced
- `get_symbols_overview`: Get overview of symbols in a file
- `replace_symbol_body`: Replace entire symbol definitions
- `insert_after_symbol`: Insert code after symbols
- `read_file`: Read files with semantic context
- `search_for_pattern`: Search for code patterns

## Configuration

### Project Configuration (.serena/project.yml)

Your project is configured for TypeScript development with the following settings:

- Language: TypeScript (supports your Next.js/React code)
- Encoding: UTF-8
- Git ignore integration: Enabled
- Read-only mode: Disabled

### MCP Server Configuration

Serena is configured in `~/.cursor/mcp.json` and will automatically start when Cursor loads projects in the scrolli directory.

## Troubleshooting

### Server Won't Start

- Ensure you're in the project root directory
- Check that Python and uv are properly installed
- Verify the project.yml file exists

### Tools Not Available in Cursor

- Make sure the MCP server is running
- Restart Cursor after configuration changes
- Check Cursor logs for MCP connection errors

### Language Server Issues

- Serena uses TypeScript language server for your Next.js code
- If you encounter issues, try restarting the language server with the `restart_language_server` tool

## Advanced Usage

### Custom Contexts and Modes

Serena supports different contexts and modes for specialized workflows:

- `desktop-app`: Default context with shell command execution
- `editing`: Mode focused on code editing operations
- `interactive`: Mode for conversational interactions

### Memory System

Serena has a built-in memory system for storing project-specific information:

- Use `write_memory` to store important information
- Use `read_memory` to retrieve stored information
- Use `list_memories` to see all stored memories

## Getting Help

- Serena GitHub: https://github.com/oraios/serena
- Check the project documentation in the `.serena` directory
- Use Serena's built-in help: `serena --help`

## Next Steps

1. Start the Serena MCP server using `./start-serena.sh`
2. Open your project in Cursor
3. Serena tools should now be available for semantic code assistance
4. Try using tools like "find_symbol" or "get_symbols_overview" to explore your codebase
