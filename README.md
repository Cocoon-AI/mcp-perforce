# MCP Perforce Server

A Model Context Protocol (MCP) server that provides a clean interface for Perforce (P4) operations in Claude Desktop. This server wraps P4 commands to make them more reliable and easier for Claude to use, eliminating issues with interactive prompts and complex state management.

## Features

- **Non-interactive operations**: All commands are wrapped to avoid interactive prompts
- **Structured responses**: Clean, parseable output instead of raw P4 output
- **Multi-project support**: Automatically uses `.p4config` files for per-project settings
- **Common operations**: Add, edit, delete, submit, revert, sync, and more
- **Changelist management**: Create and submit changelists with explicit parameters
- **Error handling**: Graceful error handling with clear error messages

## Installation

### Prerequisites

- Node.js 18+ installed
- Perforce command-line client (p4) installed and in your PATH
- `.p4config` files in your project directories (recommended)

### Quick Install with Claude Code

```bash
# Install the package globally
npm install -g @cocoon-ai/mcp-perforce

# Add to Claude Code
claude mcp add perforce @cocoon-ai/mcp-perforce
```

That's it! Claude Code will automatically configure the server for you.

### Manual Installation

#### Via NPM (when published)

```bash
npm install -g @cocoon-ai/mcp-perforce
```

#### Install from Source

```bash
git clone https://github.com/Cocoon-AI/mcp-perforce.git
cd mcp-perforce
npm install
npm run build
npm link  # Makes 'mcp-perforce' available globally
```

## Configuration

### Basic Setup

Add the server to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
**Linux**: `~/.config/claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "perforce": {
      "command": "npx",
      "args": ["-y", "@cocoon-ai/mcp-perforce"],
      "env": {
        "P4CONFIG": ".p4config"
      }
    }
  }
}
```

### Setting Up .p4config Files

The server uses Perforce's built-in P4CONFIG mechanism to automatically switch between different Perforce servers based on your current directory. Create a `.p4config` file in each project root:

```bash
# ~/projects/gamedev/.p4config
P4PORT=perforce-game.company.com:1666
P4CLIENT=gamedev-workspace
P4USER=your-username

# ~/projects/web/.p4config
P4PORT=perforce-web.company.com:1666
P4CLIENT=web-workspace
P4USER=your-username
```

Now the MCP server will automatically use the correct Perforce settings based on which project directory you're working in!

## Available Commands

Once configured, you can ask Claude to use these P4 operations. All commands will automatically use the `.p4config` settings from your current project directory.

### Basic File Operations

- **`p4_status`**: Check workspace status and pending changes
  ```
  "Show me my pending P4 changes"
  "Check P4 status in the gamedev directory"
  ```

- **`p4_add`**: Add files to Perforce
  ```
  "Add all .js files in the src directory to Perforce"
  ```

- **`p4_edit`**: Open files for edit
  ```
  "Open config.json for editing in Perforce"
  ```

- **`p4_delete`**: Mark files for deletion
  ```
  "Delete the old_module.py file from Perforce"
  ```

- **`p4_sync`**: Sync files from depot
  ```
  "Sync all files in the project"
  "Force sync the src directory"
  ```

- **`p4_revert`**: Revert files or entire changelists
  ```
  "Revert all files in changelist 12345"
  "Revert changes to config.json"
  ```

- **`p4_diff`**: Show differences for files
  ```
  "Show me the diff for all my open files"
  ```

### Changelist Operations

- **`p4_changelist_create`**: Create a new changelist
  ```
  "Create a new changelist with description 'Fix login bug'"
  ```

- **`p4_changelist_submit`**: Submit a changelist
  ```
  "Submit changelist 12345"
  ```

- **`p4_move_to_changelist`**: Move files between changelists
  ```
  "Move all my open files to changelist 12345"
  ```

### Stream Operations

- **`p4_stream_list`**: List streams in a depot
  ```
  "List all streams in //depot"
  "Show me development streams matching 'feature'"
  ```

- **`p4_stream_info`**: Get detailed stream information
  ```
  "Show me details about //depot/main stream"
  ```

- **`p4_stream_switch`**: Switch workspace to a different stream
  ```
  "Switch to the //depot/dev stream"
  "Force switch to //depot/release-2.0"
  ```

- **`p4_stream_create`**: Create a new stream
  ```
  "Create a development stream //depot/feature-xyz from //depot/main"
  ```

- **`p4_stream_edit`**: Edit stream specification
  ```
  "Edit the //depot/feature-xyz stream spec"
  ```

- **`p4_stream_graph`**: Show stream hierarchy
  ```
  "Show the stream hierarchy for //depot"
  ```

### Client/Workspace Operations

- **`p4_client_list`**: List all clients/workspaces
  ```
  "List all my Perforce workspaces"
  "Show clients for user jsmith"
  ```

- **`p4_client_info`**: Get client/workspace details
  ```
  "Show me details about my current workspace"
  "Show info for client gamedev-workspace"
  ```

- **`p4_client_create`**: Create a new client/workspace
  ```
  "Create a new workspace called dev-feature in /home/user/p4/feature"
  "Create a stream client for //depot/main-stream"
  ```

- **`p4_client_edit`**: Edit client specification
  ```
  "Edit the view mappings for client dev-workspace"
  ```

- **`p4_client_delete`**: Delete a client/workspace
  ```
  "Delete the old-feature workspace"
  "Force delete the broken-client workspace"
  ```

- **`p4_client_switch`**: Switch to a different client
  ```
  "Switch to the production-client workspace"
  ```

### Information Operations

- **`p4_info`**: Show current Perforce configuration
  ```
  "Show me which P4 server and workspace I'm using"
  ```

- **`mcp_perforce_version`**: Show MCP Perforce server version
  ```
  "What version of mcp-perforce is running?"
  ```

## Example Usage in Claude

Here are some example conversations with Claude:

**Example 1: Creating and submitting a change**
```
You: "I've modified server.js and config.json. Create a changelist for these fixes"
Claude: I'll help you create a changelist for your changes. Let me first check the status...
[Uses p4_status, p4_changelist_create, p4_submit]
```

**Example 2: Syncing and reviewing changes**
```
You: "Sync the latest changes and show me what files I have open"
Claude: I'll sync your workspace and check your open files...
[Uses p4_sync, p4_status]
```

## Troubleshooting

### Server not appearing in Claude

1. Restart Claude Desktop after modifying the configuration
2. Check that the configuration file is valid JSON
3. Verify the MCP server is installed: `npm list -g @cocoon-ai/mcp-perforce`

### Perforce authentication errors

1. Check your `.p4config` file exists and has the correct settings
2. Test your connection outside Claude: `p4 info`
3. Make sure you're logged in: `p4 login`
4. Verify P4CONFIG is being recognized: `p4 set P4CONFIG`

### Wrong Perforce server being used

1. Check which directory you're in - the server uses `.p4config` from the current or parent directories
2. Run `p4 info` to see which config is being used
3. Use the `p4_info` command in Claude to debug: "Show me my P4 configuration"

### Command not working as expected

1. Check Claude's response for error messages
2. Verify the P4 command works in your terminal from the same directory
3. Enable debug logging (see below)

## Debug Logging

To enable debug output, add to your configuration:

```json
{
  "mcpServers": {
    "perforce": {
      "command": "npx",
      "args": ["-y", "@cocoon-ai/mcp-perforce"],
      "env": {
        "P4CONFIG": ".p4config",
        "DEBUG": "mcp:*"
      }
    }
  }
}
```

## Development

### Building from source

```bash
git clone https://github.com/Cocoon-AI/mcp-perforce.git
cd mcp-perforce
npm install
npm run build
```

### Running tests

```bash
npm test
```

### Adding new commands

1. Add the tool definition in the appropriate file under `src/tools/`
2. Add the handler function in the corresponding file under `src/handlers/`
3. Update the switch statement in `src/handlers/index.ts`
4. Follow the existing pattern for parameter validation and error handling

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-command`)
3. Commit your changes (`git commit -am 'Add new P4 command'`)
4. Push to the branch (`git push origin feature/new-command`)
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built on the [Model Context Protocol SDK](https://github.com/anthropics/mcp-sdk)
- Inspired by the need for better Perforce integration in AI assistants

## Support

- **Issues**: [GitHub Issues](https://github.com/Cocoon-AI/mcp-perforce/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Cocoon-AI/mcp-perforce/discussions)

---

Made with ❤️ for AIs struggling with P4 command-line operations