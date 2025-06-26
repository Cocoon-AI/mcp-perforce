import { ToolDefinition } from '../types/index.js';

export const clientOperationTools: ToolDefinition[] = [
  {
    name: 'p4_client_list',
    description: 'List all clients/workspaces for the current user',
    inputSchema: {
      type: 'object',
      properties: {
        user: {
          type: 'string',
          description: 'Filter by specific user (optional)',
        },
        path: {
          type: 'string',
          description: 'Working directory path (optional)',
        },
      },
    },
  },
  {
    name: 'p4_client_info',
    description: 'Get detailed information about a specific client/workspace',
    inputSchema: {
      type: 'object',
      properties: {
        client: {
          type: 'string',
          description: 'Client/workspace name (optional, uses current if not specified)',
        },
        path: {
          type: 'string',
          description: 'Working directory path (optional)',
        },
      },
    },
  },
  {
    name: 'p4_client_create',
    description: 'Create a new client/workspace',
    inputSchema: {
      type: 'object',
      properties: {
        client: {
          type: 'string',
          description: 'Name for the new client/workspace',
        },
        root: {
          type: 'string',
          description: 'Root directory for the client workspace',
        },
        stream: {
          type: 'string',
          description: 'Stream to associate with the client (optional)',
        },
        view: {
          type: 'array',
          items: { type: 'string' },
          description: 'View mappings (e.g., ["//depot/... //myclient/..."])',
        },
        description: {
          type: 'string',
          description: 'Client description (optional)',
        },
        options: {
          type: 'array',
          items: { type: 'string' },
          description: 'Client options (optional, e.g., ["allwrite", "clobber"])',
        },
        path: {
          type: 'string',
          description: 'Working directory path (optional)',
        },
      },
      required: ['client', 'root'],
    },
  },
  {
    name: 'p4_client_edit',
    description: 'Edit an existing client/workspace specification',
    inputSchema: {
      type: 'object',
      properties: {
        client: {
          type: 'string',
          description: 'Client/workspace name to edit',
        },
        spec: {
          type: 'string',
          description: 'Client specification content (optional, shows current spec if not provided)',
        },
        path: {
          type: 'string',
          description: 'Working directory path (optional)',
        },
      },
      required: ['client'],
    },
  },
  {
    name: 'p4_client_delete',
    description: 'Delete a client/workspace',
    inputSchema: {
      type: 'object',
      properties: {
        client: {
          type: 'string',
          description: 'Client/workspace name to delete',
        },
        force: {
          type: 'boolean',
          description: 'Force delete even if client has opened files',
        },
        path: {
          type: 'string',
          description: 'Working directory path (optional)',
        },
      },
      required: ['client'],
    },
  },
  {
    name: 'p4_client_switch',
    description: 'Switch to a different client/workspace',
    inputSchema: {
      type: 'object',
      properties: {
        client: {
          type: 'string',
          description: 'Client/workspace name to switch to',
        },
        path: {
          type: 'string',
          description: 'Working directory path (optional)',
        },
      },
      required: ['client'],
    },
  },
];