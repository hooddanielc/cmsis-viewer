import React from 'react';
import {ReactThemes, ReactTerminalStateless} from 'react-terminal-component';
import {EmulatorState, OutputFactory, Outputs} from 'javascript-terminal';
import {withStyles} from '@material-ui/core/styles';
import styles from '../../styles';
import s from './Terminal.scss';

class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emulatorState: EmulatorState.createEmpty(),
    };
  }

  onStateChange(e) {
    console.log('on state change', e);
  }

  onInputChange(e) {
    console.log('on input change');
  }

  render() {
    return (
      <div style={{height: `${this.props.height}px`}} className={this.props.className}>
        <ReactTerminalStateless
          {...ReactTerminalStateless.defaultProps}
          style={{height: `${this.props.height}px`}}
          emulatorState={this.props.emulatorState || this.state.emulatorState}
          onStateChange={this.onStateChange.bind(this)}
          onInputChange={this.onInputChange.bind(this)}
          theme={ReactThemes.hacker}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Terminal);
