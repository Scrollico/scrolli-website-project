#!/bin/bash

# Start Serena MCP server for the Merinda project
# This script activates the virtual environment and starts the MCP server

cd "$(dirname "$0")"
/Users/nihatavci/serena/.venv/bin/serena start-mcp-server --project .
