import util from 'util';
import fs from 'fs';
import exec from '../util/exec';

export const GDB_LOAD_RESPONSE = 'GDB_LOAD_RESPONSE';
export const GDB_LOAD_REQUEST = 'GDB_LOAD_REQUEST';
export const GDB_LOAD_ERROR = 'GDB_LOAD_ERROR';

export const GDB_ANALYZE_RESPONSE = 'GDB_ANALYZE_RESPONSE';
export const GDB_ANALYZE_REQUEST = 'GDB_ANALYZE_REQUEST';
export const GDB_ANALYZE_ERROR = 'GDB_ANALYZE_ERROR';

export const GDB_ADD_TERMINAL_OUTPUT = 'GDB_ADD_TERMINAL_OUTPUT';

const stat = util.promisify(fs.stat);


export const addTerminalOutput = ({command, output, id}) => async (dispatch) => {
  dispatch({
    type: GDB_ADD_TERMINAL_OUTPUT,
    payload: {command, output, id},
  });
  return Promise.resolve();
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
