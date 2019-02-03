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
} from '../actions/gdb';

export default (state = {
  terminalOutput: {}
}, action) => {
  const {payload} = action;
  switch (action.type) {
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
