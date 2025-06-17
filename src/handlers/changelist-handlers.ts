import { z } from 'zod';
import { p4Exec } from '../utils/p4exec.js';

export async function handleChangelistCreate(args: any, workingDir?: string) {
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

export async function handleChangelistSubmit(args: any, workingDir?: string) {
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

export async function handleMoveToChangelist(args: any, workingDir?: string) {
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