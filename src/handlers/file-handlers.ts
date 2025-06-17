import { z } from 'zod';
import { p4Exec } from '../utils/p4exec.js';

export async function handleAdd(args: any, workingDir?: string) {
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

export async function handleEdit(args: any, workingDir?: string) {
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

export async function handleDelete(args: any, workingDir?: string) {
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

export async function handleRevert(args: any, workingDir?: string) {
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

export async function handleSync(args: any, workingDir?: string) {
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

export async function handleDiff(args: any, workingDir?: string) {
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