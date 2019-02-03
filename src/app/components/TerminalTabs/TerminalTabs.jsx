import React from 'react';
import {ReactTerminalStateless} from 'react-terminal-component';
import {EmulatorState, OutputFactory, Outputs} from 'javascript-terminal';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';


import styles from '../../styles';
import s from './TerminalTabs.scss';
import Terminal from '../Terminal/Terminal';

class TerminalTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  handleChange(event, value) {
    this.setState({value});
  }

  getSelected() {
    const {value} = this.state;
    const keys = this.getTabs();
    if (value) {
      return keys[value];
    }
    return keys.length > 0 ? keys[0] : null;
  }

  getTabs() {
    return Object.keys(this.props.terminalOutput).sort();
  }

  renderTerminal() {
    if (!this.getSelected()) {
      return null;
    }
    const {emulatorState} = this.props.terminalOutput[this.getSelected()];
    return (
      <div className={s.term_wrapper}>
        <Terminal height={this.props.height - 48} className={s.term_container} emulatorState={emulatorState} />
      </div>
    );
  }

  render() {
    const {terminalOutput} = this.props;
    return (
      <div className={classnames(this.props.className, s.container)}>
        <AppBar className={s.tabs_header} position="static">
          <Tabs value={this.state.value} onChange={this.handleChange.bind(this)}>
            {this.getTabs().map((k) => (
              <Tab key={k} label={k} />
            ))}
          </Tabs>
        </AppBar>
        {this.renderTerminal()}
      </div>
    );
  }
}

export default withStyles(styles)(TerminalTabs);
