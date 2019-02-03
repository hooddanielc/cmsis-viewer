import child_process from 'child_process';
import store from '../store';

export default (cmd, args, opts) => {
  return new Promise((resolve, reject) => {
    const child = child_process.spawn(cmd, args, opts);
    let stdout = '';
    let stderr = '';
    let output = '';
    child.stdout.on('data', (data) => {
      output += data.toString();
      stdout += data.toString();
    });
    child.stderr.on('data', (data) => {
      output += data.toString();
      stderr += data.toString();
    });
    child.on('exit', (exitCode) => {
      const result = {
        exitCode,
        stderr,
        stdout,
        output
      }
      if (exitCode > 0) {
        reject(new Error(JSON.stringify(result)));
      } else {
        resolve(result);
      }
    });
  });
}