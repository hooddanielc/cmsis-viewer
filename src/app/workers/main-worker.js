let state = {}

export const on_ping = ({self, e}) => {
  self.postMessage({
    ...e.data,
    type: 'pong',
  });
}

export const on_get_state = ({self, e}) => {
  const {str} = e.data.payload;
  state.raw_json += str;
  self.postMessage({
    type: 'get_state_response',
    payload: state
  });
}

export default ({self}) => {
  self.addEventListener('message', (e) => {
    try {
      const args = {self, e}
      const type = e.data && e.data.type;
      switch (type) {
        case 'ping': on_ping(args); break;
        case 'on_get_state': on_get_state(args); break;
      }
    } catch (e) {
      self.postMessage({
        type: 'error',
        payload: {
          message: e.message,
          stack: e.stack,
        }
      });
    }
  }, false);
}
