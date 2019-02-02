import util from 'util';
import fs from 'fs';

export const GDB_LOAD_RESPONSE = 'GDB_LOAD_RESPONSE';
export const GDB_LOAD_REQUEST = 'GDB_LOAD_REQUEST';
export const GDB_LOAD_ERROR = 'GDB_LOAD_ERROR';

const stat = util.promisify(fs.stat);

export const load = ({filepath}) => async (dispatch) => {
  dispatch({
    type: GDB_LOAD_REQUEST,
    payload: {filepath},
  });

  try {
    const res = await fs.stat(filepath);
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
  }
  return readFile(filepath, );
}
