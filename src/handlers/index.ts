import { z } from 'zod';
import { handleAdd, handleEdit, handleDelete, handleRevert, handleSync, handleDiff } from './file-handlers.js';
import { handleChangelistCreate, handleChangelistSubmit, handleMoveToChangelist } from './changelist-handlers.js';
import { handleStatus, handleInfo, handleVersion } from './info-handlers.js';
import { handleStreamList, handleStreamInfo, handleStreamSwitch, handleStreamCreate, handleStreamEdit, handleStreamGraph } from './stream-handlers.js';
import { handleClientList, handleClientInfo, handleClientCreate, handleClientEdit, handleClientDelete, handleClientSwitch } from './client-handlers.js';

export async function handleToolCall(name: string, args: any) {
  try {
    // Extract working directory if provided
    const workingDir = args?.path ? z.string().parse(args.path) : undefined;

    switch (name) {
      // File operations
      case 'p4_add':
        return await handleAdd(args, workingDir);
      case 'p4_edit':
        return await handleEdit(args, workingDir);
      case 'p4_delete':
        return await handleDelete(args, workingDir);
      case 'p4_revert':
        return await handleRevert(args, workingDir);
      case 'p4_sync':
        return await handleSync(args, workingDir);
      case 'p4_diff':
        return await handleDiff(args, workingDir);
      
      // Changelist operations
      case 'p4_changelist_create':
        return await handleChangelistCreate(args, workingDir);
      case 'p4_changelist_submit':
        return await handleChangelistSubmit(args, workingDir);
      case 'p4_move_to_changelist':
        return await handleMoveToChangelist(args, workingDir);
      
      // Info operations
      case 'p4_status':
        return await handleStatus(args, workingDir);
      case 'p4_info':
        return await handleInfo(args, workingDir);
      case 'mcp_perforce_version':
        return await handleVersion();
      
      // Stream operations
      case 'p4_stream_list':
        return await handleStreamList(args, workingDir);
      case 'p4_stream_info':
        return await handleStreamInfo(args, workingDir);
      case 'p4_stream_switch':
        return await handleStreamSwitch(args, workingDir);
      case 'p4_stream_create':
        return await handleStreamCreate(args, workingDir);
      case 'p4_stream_edit':
        return await handleStreamEdit(args, workingDir);
      case 'p4_stream_graph':
        return await handleStreamGraph(args, workingDir);
      
      // Client operations
      case 'p4_client_list':
        return await handleClientList(args, workingDir);
      case 'p4_client_info':
        return await handleClientInfo(args, workingDir);
      case 'p4_client_create':
        return await handleClientCreate(args, workingDir);
      case 'p4_client_edit':
        return await handleClientEdit(args, workingDir);
      case 'p4_client_delete':
        return await handleClientDelete(args, workingDir);
      case 'p4_client_switch':
        return await handleClientSwitch(args, workingDir);

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
}