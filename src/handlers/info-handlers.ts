import { p4Exec } from '../utils/p4exec.js';
import { VERSION } from '../version.js';

export async function handleStatus(_args: any, workingDir?: string) {
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

export async function handleInfo(_args: any, workingDir?: string) {
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

export async function handleVersion() {
  return {
    content: [
      {
        type: 'text',
        text: `MCP Perforce Server v${VERSION}`,
      },
    ],
  };
}