import { z } from 'zod';
import { p4Exec } from '../utils/p4exec.js';
import { VERSION } from '../version.js';

export async function handleRawCommand(args: any, workingDir?: string) {
  const command = z.string().parse(args?.command);
  const { stdout, stderr } = await p4Exec(command, workingDir);
  return {
    content: [
      {
        type: 'text',
        text: `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`,
      },
    ],
  };
}

export async function handleStatus(args: any, workingDir?: string) {
  const { stdout, stderr } = await p4Exec('p4 status', workingDir);
  return {
    content: [
      {
        type: 'text',
        text: stderr || stdout,
      },
    ],
  };
}

export async function handleInfo(args: any, workingDir?: string) {
  const { stdout, stderr } = await p4Exec('p4 info', workingDir);
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

export async function handleVersion() {
  return {
    content: [
      {
        type: 'text',
        text: `MCP Perforce Version: ${VERSION}`,
      },
    ],
  };
}