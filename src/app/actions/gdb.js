import util from 'util';
import fs from 'fs';
import child_process from 'child_process';
import {GDB} from 'gdb-js';
import exec from '../util/exec';

export const GDB_LOAD_RESPONSE = 'GDB_LOAD_RESPONSE';
export const GDB_LOAD_REQUEST = 'GDB_LOAD_REQUEST';
export const GDB_LOAD_ERROR = 'GDB_LOAD_ERROR';

export const GDB_ANALYZE_RESPONSE = 'GDB_ANALYZE_RESPONSE';
export const GDB_ANALYZE_REQUEST = 'GDB_ANALYZE_REQUEST';
export const GDB_ANALYZE_ERROR = 'GDB_ANALYZE_ERROR';

export const GDB_LAUNCH_DEBUGGER_REQUEST = 'GDB_LAUNCH_DEBUGGER_REQUEST';
export const GDB_LAUNCH_DEBUGGER_RESPONSE = 'GDB_LAUNCH_DEBUGGER_RESPONSE';
export const GDB_LAUNCH_DEBUGGER_ERROR = 'GDB_LAUNCH_DEBUGGER_ERROR';

export const GDB_ADD_TERMINAL_OUTPUT = 'GDB_ADD_TERMINAL_OUTPUT';
export const GDB_CHILD_DID_EXIT = 'GDB_CHILD_DID_EXIT';

export const GDB_STATUS_UPDATE = 'GDB_STATUS_UPDATE';
export const GDB_STATUS_STOPPED = 'GDB_STATUS_STOPPED';
export const GDB_STATUS_RUNNING = 'GDB_STATUS_RUNNING';

export const GDB_EXEC_STATUS_UPDATE = 'GDB_EXEC_STATUS_UPDATE';

const stat = util.promisify(fs.stat);

export const addTerminalOutput = ({command, output, id}) => async (dispatch) => {
  dispatch({
    type: GDB_ADD_TERMINAL_OUTPUT,
    payload: {command, output, id},
  });
  return Promise.resolve();
}

export const launchMICommand = ({gdb, cmd}) => (dispatch) => {
  dispatch(addTerminalOutput({
    command: cmd,
    id: 'arm-none-eabi-gdb',
  }));
  return gdb.execMI(cmd);
}

export const launchDebugger = ({filepath, remote}) => async (dispatch) => {
  dispatch(addTerminalOutput({
    command: ['arm-none-eabi-gdb'].concat([filepath]).join(' '),
    id: 'arm-none-eabi-gdb',
  }));

  dispatch({
    type: GDB_LAUNCH_DEBUGGER_REQUEST,
    payload: {filepath},
  });

  try {
    const child = child_process.spawn('arm-none-eabi-gdb', ['-i=mi', filepath]);

    child.on('exit', (code) => {
      dispatch({
        type: GDB_CHILD_DID_EXIT,
        payload: {code, filepath},
      });
    });

    child.stdout.on('data', (data) => {
      dispatch(addTerminalOutput({
        output: data.toString(),
        id: 'arm-none-eabi-gdb',
      }));
    });

    child.stderr.on('data', (data) => {
      dispatch(addTerminalOutput({
        output: data.toString(),
        id: 'arm-none-eabi-gdb',
      }));
    });

    const gdb = new GDB(child);

    gdb.on('status', (data) => {
      dispatch({
        type: GDB_STATUS_UPDATE,
        payload: data,
      });
    });

    gdb.on('exec', (data) => {
      dispatch({
        type: GDB_EXEC_STATUS_UPDATE,
        payload: data,
      });
    });

    gdb.on('running', (data) => {
      dispatch({
        type: GDB_STATUS_RUNNING,
        payload: data,
      });
    });

    gdb.on('stopped', (data) => {
      dispatch({
        type: GDB_STATUS_STOPPED,
        payload: data,
      });
    });

    await gdb.init();

    const res = await dispatch(launchMICommand({
      gdb,
      cmd: `-target-select ${remote}`,
    }));

    dispatch({
      type: GDB_LAUNCH_DEBUGGER_RESPONSE,
      payload: {
        gdb,
        filepath,
      }
    });
  } catch (e) {
    dispatch({
      type: GDB_LAUNCH_DEBUGGER_ERROR,
      payload: {
        error: e.message,
        filepath,
      }
    });
  }
}

export const load = ({filepath}) => async (dispatch) => {
  dispatch({
    type: GDB_LOAD_REQUEST,
    payload: {filepath},
  });

  try {
    const res = await stat(filepath);
    dispatch({
      type: GDB_LOAD_RESPONSE,
      payload: {
        filepath,
        filestat: res, 
      }
    });
  } catch (e) {
    dispatch({
      type: GDB_LOAD_ERROR,
      payload: {
        error: e.message,
        filepath: filepath,
      }
    });
    return Promise.reject(e);
  }
}

export const analyze = ({filepath}) => async (dispatch) => {
  dispatch({
    type: GDB_ANALYZE_REQUEST,
    payload: {filepath},
  });

  try {
    dispatch(addTerminalOutput({
      command: ['arm-none-eabi-size'].concat([filepath]).join(' '),
      id: 'arm-none-eabi-size',
    }));
    const {
      stderr,
      stdout,
      exitCode,
      output,
    } = await exec('arm-none-eabi-size', [filepath]);
    dispatch(addTerminalOutput({
      output,
      id: 'arm-none-eabi-size',
    }));
    dispatch({
      type: GDB_ANALYZE_RESPONSE,
      payload: {
        filepath,
        stderr,
        stdout,
        exitCode,
      }
    });
  } catch (e) {
    dispatch({
      type: GDB_ANALYZE_ERROR,
      payload: {
        error: JSON.parse(e.message),
        filepath: filepath,
      }
    });
    return Promise.reject(e);
  }
}
