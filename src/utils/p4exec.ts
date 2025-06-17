import { exec } from 'child_process';
import { promisify } from 'util';
import { cwd } from 'process';

const execAsync = promisify(exec);

export async function p4Exec(command: string, workingDir?: string) {
  const options = {
    cwd: workingDir || cwd(),
    env: {
      ...process.env,
      P4CONFIG: process.env.P4CONFIG || '.p4config'
    }
  };
  
  return execAsync(command, options);
}