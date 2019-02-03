import uuid from 'uuid';
import {EmulatorState, OutputFactory, Outputs} from 'javascript-terminal';

import {
  GDB_LOAD_RESPONSE,
  GDB_LOAD_REQUEST,
  GDB_LOAD_ERROR,
  GDB_ANALYZE_RESPONSE,
  GDB_ANALYZE_REQUEST,
  GDB_ANALYZE_ERROR,
  GDB_ADD_TERMINAL_OUTPUT,
  GDB_STATUS_IDLE,
  GDB_STATUS_LAUNCHED,
  GDB_CHILD_DID_EXIT,
  GDB_LAUNCH_DEBUGGER_REQUEST,
  GDB_LAUNCH_DEBUGGER_RESPONSE,
  GDB_LAUNCH_DEBUGGER_ERROR,
  GDB_STATUS_UPDATE,
  GDB_STATUS_RUNNING,
  GDB_STATUS_STOPPED,
  GDB_EXEC_STATUS_UPDATE,
} from '../actions/gdb';

export default (state = {
  terminalOutput: {},
  execStatus: {},
  statusUpdate: {},
  launchStatus: {},
  status: 'idle',
}, action) => {
  const {payload} = action;
  switch (action.type) {
    case GDB_EXEC_STATUS_UPDATE:
      return {
        ...state,
        execStatus: payload,
      }
    case GDB_STATUS_UPDATE:
    case GDB_STATUS_RUNNING:
    case GDB_STATUS_STOPPED:
      return {
        ...state,
        statusUpdate: payload,
      }
    case GDB_LAUNCH_DEBUGGER_REQUEST:
      return {
        ...state,
        launchStatus: 'pending',
        launchError: null,
      }
    case GDB_LAUNCH_DEBUGGER_RESPONSE:
      return {
        ...state,
        launchStatus: 'ok',
        gdb: payload.gdb,
        filepath: payload.filepath,
      }
    case GDB_LAUNCH_DEBUGGER_ERROR:
      return {
        ...state,
        launchStatus: 'error',
        launchError: payload.error,
      }
    case GDB_CHILD_DID_EXIT:
      return {
        ...state,
        launchStatus: 'idle',
      }
    case GDB_LOAD_RESPONSE:
    case GDB_LOAD_REQUEST:
    case GDB_LOAD_ERROR:
      return {
        ...state,
        loadStatus: action.payload,
      }
    case GDB_ANALYZE_RESPONSE:
    case GDB_ANALYZE_REQUEST:
    case GDB_ANALYZE_ERROR:
      return {
        ...state,
        analyzeStatus: action.payload,
      }
    case GDB_ADD_TERMINAL_OUTPUT:
      const id = payload.id || uuid.v4();
      const emulatorState = state.terminalOutput[id] ? state.terminalOutput[id].emulatorState : EmulatorState.createEmpty();
      let newState = emulatorState;
      if (payload.command) {
        newState = emulatorState.setOutputs(Outputs.addRecord(
          newState.getOutputs(),
          OutputFactory.makeHeaderOutput('/', payload.command),
        ));
      }
      if (payload.output) {
        newState = emulatorState.setOutputs(Outputs.addRecord(
          newState.getOutputs(),
          OutputFactory.makeTextOutput(payload.output),
        ));
      }
      return {
        ...state,
        terminalOutput: {
          ...state.terminalOutput,
          [id]: {
            emulatorState: newState,
          }
        }
      }
  }
  return state;
}
