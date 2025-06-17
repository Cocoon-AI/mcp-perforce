import { ToolDefinition } from '../types/index.js';

export const fileOperationTools: ToolDefinition[] = [
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
];