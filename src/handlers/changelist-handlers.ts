import { z } from 'zod';
import { p4Exec } from '../utils/p4exec.js';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export async function handleChangelistCreate(args: any, workingDir?: string) {
  const description = z.string().parse(args?.description);
  const specContent = `Change: new\n\nDescription:\n\t${description.replace(/\n/g, '\n\t')}`;

  // Create a temporary file for the spec
  const tempDir = os.tmpdir();
  const tempFile = path.join(tempDir, `p4-change-spec-${Date.now()}.txt`);

  try {
    fs.writeFileSync(tempFile, specContent, 'utf-8');

    // Use the temporary file to create the changelist
    const command = `p4 change -i < "${tempFile}"`;
    const { stdout, stderr } = await p4Exec(command, workingDir);

    if (stderr && !stdout.includes('created')) {
        throw new Error(stderr);
    }

    const match = stdout.match(/Change (\d+) created/);
    return {
        content: [
            {
                type: 'text',
                text: match ? `Created changelist ${match[1]}` : stdout,
            },
        ],
    };
  } finally {
    // Clean up the temporary file
    if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
    }
  }
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