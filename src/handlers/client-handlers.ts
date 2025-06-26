import { z } from 'zod';
import { p4Exec } from '../utils/p4exec.js';

export async function handleClientList(args: any, workingDir?: string) {
  const user = z.string().optional().parse(args?.user);
  
  let command = 'p4 clients';
  if (user) {
    command += ` -u ${user}`;
  }
  
  const { stdout } = await p4Exec(command, workingDir);
  return {
    content: [
      {
        type: 'text',
        text: stdout || 'No clients found',
      },
    ],
  };
}

export async function handleClientInfo(args: any, workingDir?: string) {
  const client = z.string().optional().parse(args?.client);
  
  let command = 'p4 client -o';
  if (client) {
    command += ` ${client}`;
  }
  
  const { stdout } = await p4Exec(command, workingDir);
  return {
    content: [
      {
        type: 'text',
        text: stdout,
      },
    ],
  };
}

export async function handleClientCreate(args: any, workingDir?: string) {
  const client = z.string().parse(args?.client);
  const root = z.string().parse(args?.root);
  const stream = z.string().optional().parse(args?.stream);
  const view = z.array(z.string()).optional().parse(args?.view);
  const description = z.string().optional().parse(args?.description);
  const options = z.array(z.string()).optional().parse(args?.options);
  
  // Get current user for Owner field
  const userResult = await p4Exec('p4 user -o', workingDir);
  const userMatch = userResult.stdout.match(/^User:\s+(\S+)/m);
  const owner = userMatch ? userMatch[1] : 'unknown';
  
  // Build client spec
  let spec = `Client:\t${client}\n\n`;
  spec += `Owner:\t${owner}\n\n`;
  spec += `Description:\n\t${description ? description.replace(/\n/g, '\n\t') : `Created by ${owner}.`}\n\n`;
  spec += `Root:\t${root}\n\n`;
  
  // Add options
  const defaultOptions = ['noallwrite', 'noclobber', 'nocompress', 'unlocked', 'nomodtime', 'normdir'];
  const finalOptions = options || defaultOptions;
  spec += `Options:\t${finalOptions.join(' ')}\n\n`;
  
  spec += `SubmitOptions:\tsubmitunchanged\n\n`;
  spec += `LineEnd:\tlocal\n\n`;
  
  if (stream) {
    spec += `Stream:\t${stream}\n\n`;
  } else if (view && view.length > 0) {
    spec += `View:\n`;
    view.forEach(mapping => {
      spec += `\t${mapping}\n`;
    });
  } else {
    // Default view mapping
    spec += `View:\n\t//depot/... //${client}/...\n`;
  }
  
  const { stdout, stderr } = await p4Exec(`echo '${spec}' | p4 client -i`, workingDir);
  return {
    content: [
      {
        type: 'text',
        text: stderr || stdout,
      },
    ],
  };
}

export async function handleClientEdit(args: any, workingDir?: string) {
  const client = z.string().parse(args?.client);
  const spec = z.string().optional().parse(args?.spec);
  
  if (spec) {
    const { stdout, stderr } = await p4Exec(`echo '${spec}' | p4 client -i`, workingDir);
    return {
      content: [
        {
          type: 'text',
          text: stderr || stdout,
        },
      ],
    };
  } else {
    // Just output the current spec for editing
    const { stdout } = await p4Exec(`p4 client -o ${client}`, workingDir);
    return {
      content: [
        {
          type: 'text',
          text: `Current client spec for ${client}:\n\n${stdout}\n\nTo edit, use p4_client_edit with the 'spec' parameter containing the modified specification.`,
        },
      ],
    };
  }
}

export async function handleClientDelete(args: any, workingDir?: string) {
  const client = z.string().parse(args?.client);
  const force = z.boolean().optional().parse(args?.force);
  
  let command = `p4 client -d`;
  if (force) {
    command += ' -f';
  }
  command += ` ${client}`;
  
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

export async function handleClientSwitch(args: any, workingDir?: string) {
  const client = z.string().parse(args?.client);
  
  // Set P4CLIENT environment variable
  const { stdout, stderr } = await p4Exec(`p4 set P4CLIENT=${client}`, workingDir);
  
  // Verify the switch by showing client info
  const info = await p4Exec('p4 info', workingDir);
  
  return {
    content: [
      {
        type: 'text',
        text: `Switched to client: ${client}\n\n${info.stdout}`,
      },
    ],
  };
}