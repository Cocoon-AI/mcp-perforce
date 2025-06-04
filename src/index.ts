#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import { cwd } from 'process';

const execAsync = promisify(exec);

// Create server instance
const server = new Server(
  {
    name: 'mcp-perforce',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper function to execute P4 commands
// This will automatically use the .p4config in the current directory
async function p4Exec(command: string, workingDir?: string) {
  const options = {
    cwd: workingDir || cwd(),
    env: {
      ...process.env,
      P4CONFIG: process.env.P4CONFIG || '.p4config'
    }
  };
  
  return execAsync(command, options);
}

// Define P4 tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'p4_status',
        description: 'Get current P4 workspace status and pending changes',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Path to check status from (uses .p4config in that directory)',
            },
          },
        },
      },
      {
        name: 'p4_add',
        description: 'Add files to Perforce',
        inputSchema: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: { type: 'string' },
              description: 'Files to add (can use wildcards)',
            },
            path: {
              type: 'string',
              description: 'Working directory path (optional)',
            },
          },
          required: ['files'],
        },
      },
      {
        name: 'p4_edit',
        description: 'Open files for edit in Perforce',
        inputSchema: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: { type: 'string' },
              description: 'Files to open for edit',
            },
            path: {
              type: 'string',
              description: 'Working directory path (optional)',
            },
          },
          required: ['files'],
        },
      },
      {
        name: 'p4_delete',
        description: 'Mark files for deletion in Perforce',
        inputSchema: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: { type: 'string' },
              description: 'Files to delete',
            },
            path: {
              type: 'string',
              description: 'Working directory path (optional)',
            },
          },
          required: ['files'],
        },
      },
      {
        name: 'p4_changelist_create',
        description: 'Create a new changelist with a description',
        inputSchema: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'Changelist description',
            },
            path: {
              type: 'string',
              description: 'Working directory path (optional)',
            },
          },
          required: ['description'],
        },
      },
      {
        name: 'p4_changelist_submit',
        description: 'Submit a changelist',
        inputSchema: {
          type: 'object',
          properties: {
            changelist: {
              type: 'string',
              description: 'Changelist number to submit (or "default")',
            },
            description: {
              type: 'string',
              description: 'Submit description (optional, uses CL description if not provided)',
            },
            path: {
              type: 'string',
              description: 'Working directory path (optional)',
            },
          },
          required: ['changelist'],
        },
      },
      {
        name: 'p4_revert',
        description: 'Revert files or changelist',
        inputSchema: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: { type: 'string' },
              description: 'Files to revert (optional)',
            },
            changelist: {
              type: 'string',
              description: 'Changelist to revert all files from (optional)',
            },
            path: {
              type: 'string',
              description: 'Working directory path (optional)',
            },
          },
        },
      },
      {
        name: 'p4_sync',
        description: 'Sync files from the depot',
        inputSchema: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: { type: 'string' },
              description: 'Specific files to sync (optional, syncs all if not provided)',
            },
            force: {
              type: 'boolean',
              description: 'Force sync even if you have local changes',
            },
            path: {
              type: 'string',
              description: 'Working directory path (optional)',
            },
          },
        },
      },
      {
        name: 'p4_diff',
        description: 'Show differences for files',
        inputSchema: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: { type: 'string' },
              description: 'Files to diff',
            },
            path: {
              type: 'string',
              description: 'Working directory path (optional)',
            },
          },
          required: ['files'],
        },
      },
      {
        name: 'p4_move_to_changelist',
        description: 'Move files to a specific changelist',
        inputSchema: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: { type: 'string' },
              description: 'Files to move',
            },
            changelist: {
              type: 'string',
              description: 'Target changelist number',
            },
            path: {
              type: 'string',
              description: 'Working directory path (optional)',
            },
          },
          required: ['files', 'changelist'],
        },
      },
      {
        name: 'p4_info',
        description: 'Show Perforce configuration info for current directory',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Working directory path (optional)',
            },
          },
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Extract working directory if provided
    const workingDir = args?.path ? z.string().parse(args.path) : undefined;

    switch (name) {
      case 'p4_status': {
        const { stdout } = await p4Exec('p4 opened', workingDir);
        const changes = await p4Exec('p4 changes -c $P4CLIENT -s pending', workingDir);
        return {
          content: [
            {
              type: 'text',
              text: `Opened files:\n${stdout}\n\nPending changes:\n${changes.stdout}`,
            },
          ],
        };
      }

      case 'p4_add': {
        const files = z.array(z.string()).parse(args?.files);
        const { stdout, stderr } = await p4Exec(`p4 add ${files.join(' ')}`, workingDir);
        return {
          content: [
            {
              type: 'text',
              text: stderr || stdout,
            },
          ],
        };
      }

      case 'p4_edit': {
        const files = z.array(z.string()).parse(args?.files);
        const { stdout, stderr } = await p4Exec(`p4 edit ${files.join(' ')}`, workingDir);
        return {
          content: [
            {
              type: 'text',
              text: stderr || stdout,
            },
          ],
        };
      }

      case 'p4_delete': {
        const files = z.array(z.string()).parse(args?.files);
        const { stdout, stderr } = await p4Exec(`p4 delete ${files.join(' ')}`, workingDir);
        return {
          content: [
            {
              type: 'text',
              text: stderr || stdout,
            },
          ],
        };
      }

      case 'p4_changelist_create': {
        const description = z.string().parse(args?.description);
        // Create a temporary changelist spec
        const spec = `Change: new\n\nDescription:\n\t${description.replace(/\n/g, '\n\t')}`;
        const { stdout } = await p4Exec(`echo '${spec}' | p4 change -i`, workingDir);
        // Extract changelist number from output
        const match = stdout.match(/Change (\d+) created/);
        return {
          content: [
            {
              type: 'text',
              text: match ? `Created changelist ${match[1]}` : stdout,
            },
          ],
        };
      }

      case 'p4_changelist_submit': {
        const changelist = z.string().parse(args?.changelist);
        const description = z.string().optional().parse(args?.description);
        
        let command = `p4 submit -c ${changelist}`;
        if (description) {
          command += ` -d "${description}"`;
        }
        
        const { stdout, stderr } = await p4Exec(command, workingDir);
        return {
          content: [
            {
              type: 'text',
              text: stderr || stdout,
            },
          ],
        };
      }

      case 'p4_revert': {
        const files = z.array(z.string()).optional().parse(args?.files);
        const changelist = z.string().optional().parse(args?.changelist);
        
        let command = 'p4 revert';
        if (changelist) {
          command += ` -c ${changelist} //...`;
        } else if (files) {
          command += ` ${files.join(' ')}`;
        }
        
        const { stdout, stderr } = await p4Exec(command, workingDir);
        return {
          content: [
            {
              type: 'text',
              text: stderr || stdout,
            },
          ],
        };
      }

      case 'p4_sync': {
        const files = z.array(z.string()).optional().parse(args?.files);
        const force = z.boolean().optional().parse(args?.force);
        
        let command = 'p4 sync';
        if (force) command += ' -f';
        if (files) command += ` ${files.join(' ')}`;
        
        const { stdout, stderr } = await p4Exec(command, workingDir);
        return {
          content: [
            {
              type: 'text',
              text: stderr || stdout,
            },
          ],
        };
      }

      case 'p4_diff': {
        const files = z.array(z.string()).parse(args?.files);
        const { stdout } = await p4Exec(`p4 diff ${files.join(' ')}`, workingDir);
        return {
          content: [
            {
              type: 'text',
              text: stdout || 'No differences found',
            },
          ],
        };
      }

      case 'p4_move_to_changelist': {
        const files = z.array(z.string()).parse(args?.files);
        const changelist = z.string().parse(args?.changelist);
        const { stdout, stderr } = await p4Exec(
          `p4 reopen -c ${changelist} ${files.join(' ')}`,
          workingDir
        );
        return {
          content: [
            {
              type: 'text',
              text: stderr || stdout,
            },
          ],
        };
      }

      case 'p4_info': {
        const { stdout } = await p4Exec('p4 info', workingDir);
        const setOutput = await p4Exec('p4 set', workingDir);
        return {
          content: [
            {
              type: 'text',
              text: `P4 Info:\n${stdout}\n\nP4 Settings:\n${setOutput.stdout}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
});

// Start the server
const transport = new StdioServerTransport();
server.connect(transport);