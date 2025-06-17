import { ToolDefinition } from '../types/index.js';

export const changelistOperationTools: ToolDefinition[] = [
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
];