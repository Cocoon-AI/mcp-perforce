import { ToolDefinition } from '../types/index.js';

export const infoOperationTools: ToolDefinition[] = [
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
  {
    name: 'mcp_perforce_version',
    description: 'Show MCP Perforce server version',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];