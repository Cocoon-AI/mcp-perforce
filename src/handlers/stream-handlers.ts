import { z } from 'zod';
import { p4Exec } from '../utils/p4exec.js';

export async function handleStreamList(args: any, workingDir?: string) {
  const depot = z.string().optional().parse(args?.depot);
  const filter = z.string().optional().parse(args?.filter);
  
  let command = 'p4 streams';
  if (depot) command += ` ${depot}`;
  if (filter) command += ` -F "Stream~=${filter}"`;
  
  const { stdout } = await p4Exec(command, workingDir);
  return {
    content: [
      {
        type: 'text',
        text: stdout || 'No streams found',
      },
    ],
  };
}

export async function handleStreamInfo(args: any, workingDir?: string) {
  const stream = z.string().parse(args?.stream);
  const { stdout } = await p4Exec(`p4 stream -o ${stream}`, workingDir);
  return {
    content: [
      {
        type: 'text',
        text: stdout,
      },
    ],
  };
}

export async function handleStreamSwitch(args: any, workingDir?: string) {
  const stream = z.string().parse(args?.stream);
  const force = z.boolean().optional().parse(args?.force);
  
  let command = `p4 switch ${stream}`;
  if (force) command += ' -f';
  
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

export async function handleStreamCreate(args: any, workingDir?: string) {
  const stream = z.string().parse(args?.stream);
  const type = z.enum(['mainline', 'development', 'release', 'virtual', 'task']).parse(args?.type);
  const parent = z.string().optional().parse(args?.parent);
  const description = z.string().parse(args?.description);
  
  // Extract stream name from path (e.g., "//pa/vcpkg" -> "vcpkg")
  const streamName = stream.split('/').pop() || stream;
  
  // Get current user for Owner field
  const userResult = await p4Exec('p4 user -o', workingDir);
  const userMatch = userResult.stdout.match(/^User:\s+(\S+)/m);
  const owner = userMatch ? userMatch[1] : 'unknown';
  
  // Build stream spec following the template format
  let spec = `Stream:\t${stream}\n\n`;
  spec += `Owner:\t${owner}\n\n`;
  spec += `Name:\t${streamName}\n\n`;
  if (parent && type !== 'mainline') {
    spec += `Parent:\t${parent}\n\n`;
  } else if (type === 'mainline') {
    spec += `Parent:\tnone\n\n`;
  }
  spec += `Type:\t${type}\n\n`;
  spec += `Description:\n\t${description.replace(/\n/g, '\n\t')}\n\n`;
  
  // Set appropriate options based on stream type
  let options = 'allsubmit unlocked';
  if (type === 'task') {
    options += ' toparent fromparent mergedown';
  } else if (type === 'development') {
    options += ' toparent fromparent mergedown';
  } else if (type === 'release') {
    options += ' notoparent fromparent mergedown';
  } else if (type === 'mainline') {
    options += ' notoparent nofromparent mergedown';
  }
  spec += `Options:\t${options}\n\n`;
  
  if (parent && type !== 'mainline') {
    spec += `ParentView:\tinherit\n\n`;
  }
  
  spec += `Paths:\n\tshare ...\n`;
  
  const { stdout, stderr } = await p4Exec(`echo '${spec}' | p4 stream -i`, workingDir);
  return {
    content: [
      {
        type: 'text',
        text: stderr || stdout,
      },
    ],
  };
}

export async function handleStreamEdit(args: any, workingDir?: string) {
  const stream = z.string().parse(args?.stream);
  const spec = z.string().optional().parse(args?.spec);
  
  if (spec) {
    const { stdout, stderr } = await p4Exec(`echo '${spec}' | p4 stream -i`, workingDir);
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
    const { stdout } = await p4Exec(`p4 stream -o ${stream}`, workingDir);
    return {
      content: [
        {
          type: 'text',
          text: `Current stream spec for ${stream}:\n\n${stdout}\n\nTo edit, use p4_stream_edit with the 'spec' parameter containing the modified specification.`,
        },
      ],
    };
  }
}

export async function handleStreamGraph(args: any, workingDir?: string) {
  const depot = z.string().optional().parse(args?.depot) || '//...';
  const { stdout } = await p4Exec(`p4 streams -T ${depot}`, workingDir);
  return {
    content: [
      {
        type: 'text',
        text: stdout || 'No streams found',
      },
    ],
  };
}