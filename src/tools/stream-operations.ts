import { ToolDefinition } from '../types/index.js';

export const streamOperationTools: ToolDefinition[] = [
  {
    name: 'p4_stream_list',
    description: 'List all streams or streams matching a pattern',
    inputSchema: {
      type: 'object',
      properties: {
        depot: {
          type: 'string',
          description: 'Depot path to list streams from (e.g., //depot/...)',
        },
        filter: {
          type: 'string',
          description: 'Filter pattern for stream names (optional)',
        },
        path: {
          type: 'string',
          description: 'Working directory path (optional)',
        },
      },
    },
  },
  {
    name: 'p4_stream_info',
    description: 'Get detailed information about a specific stream',
    inputSchema: {
      type: 'object',
      properties: {
        stream: {
          type: 'string',
          description: 'Stream path (e.g., //depot/main)',
        },
        path: {
          type: 'string',
          description: 'Working directory path (optional)',
        },
      },
      required: ['stream'],
    },
  },
  {
    name: 'p4_stream_switch',
    description: 'Switch workspace to a different stream',
    inputSchema: {
      type: 'object',
      properties: {
        stream: {
          type: 'string',
          description: 'Target stream path (e.g., //depot/dev)',
        },
        force: {
          type: 'boolean',
          description: 'Force switch even with pending changes',
        },
        path: {
          type: 'string',
          description: 'Working directory path (optional)',
        },
      },
      required: ['stream'],
    },
  },
  {
    name: 'p4_stream_create',
    description: 'Create a new stream',
    inputSchema: {
      type: 'object',
      properties: {
        stream: {
          type: 'string',
          description: 'New stream path (e.g., //depot/feature-xyz)',
        },
        type: {
          type: 'string',
          description: 'Stream type (mainline, development, release, virtual, task)',
          enum: ['mainline', 'development', 'release', 'virtual', 'task'],
        },
        parent: {
          type: 'string',
          description: 'Parent stream path (required for non-mainline streams)',
        },
        description: {
          type: 'string',
          description: 'Stream description',
        },
        path: {
          type: 'string',
          description: 'Working directory path (optional)',
        },
      },
      required: ['stream', 'type', 'description'],
    },
  },
  {
    name: 'p4_stream_edit',
    description: 'Edit stream specification',
    inputSchema: {
      type: 'object',
      properties: {
        stream: {
          type: 'string',
          description: 'Stream path to edit',
        },
        spec: {
          type: 'string',
          description: 'Stream specification content (optional, opens editor if not provided)',
        },
        path: {
          type: 'string',
          description: 'Working directory path (optional)',
        },
      },
      required: ['stream'],
    },
  },
  {
    name: 'p4_stream_graph',
    description: 'Show stream hierarchy graph',
    inputSchema: {
      type: 'object',
      properties: {
        depot: {
          type: 'string',
          description: 'Depot path to show streams from',
        },
        path: {
          type: 'string',
          description: 'Working directory path (optional)',
        },
      },
    },
  },
];