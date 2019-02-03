import fs from 'fs';
import path from 'path';
import React from 'react';

import {withStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Pageview from '@material-ui/icons/Pageview';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import Help from '@material-ui/icons/Help';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import Typography from '@material-ui/core/Typography';
import Stop from '@material-ui/icons/Stop';

import styles from '../../styles';
import s from './GDBToolbar.scss';
import {load, analyze, launchDebugger} from '../../actions/gdb'; 

class GDBToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onFileInputChange() {
    if (!this.fileinput.files.length) {
      return;
    }
    this.input.value = this.fileinput.files[0].path;
  }

  fileIconClick() {
    this.fileinput.click();
  }

  async startIconClick() {
    const filepath = this.input.value;
    await this.props.dispatch(load({filepath}));
    await this.props.dispatch(analyze({filepath}));
    await this.props.dispatch(launchDebugger({
      filepath,
      remote: this.remoteInput.value || 'remote :4242',
    }));
  }

  renderTargetChooser() {
    const disabled = this.props.gdb.launchStatus === 'pending';
    return (
      <div>
        <div className={s.fileinput_container}>
          <IconButton className={s.icon_button} aria-label="Menu">
            <Help />
          </IconButton>
          <InputBase disabled={disabled} inputRef={(el) => this.input = el} className={s.input} placeholder="Enter Filepath" />
          <IconButton disabled={disabled} onClick={this.fileIconClick.bind(this)} className={s.iconButton} aria-label="Open File">
            <input disabled={disabled} onChange={this.onFileInputChange.bind(this)} ref={(el) => this.fileinput = el} type="file" className={s.hidden} />
            <Pageview />
          </IconButton>
          <InputBase disabled={disabled} inputRef={(el) => this.remoteInput = el} className={s.input} placeholder="remote :4242" />
          <Divider className={s.divider} />
          <IconButton disabled={disabled} onClick={this.startIconClick.bind(this)} color="primary" className={s.iconButton} aria-label="Directions">
            <PlayCircleFilled />
          </IconButton>
        </div>
      </div>
    );
  }

  onContinue() {
    const {gdb} = this.props.gdb;
    gdb.execMI('-exec-continue');
  }

  async onInterrupt() {
    const {gdb} = this.props.gdb;
    await gdb.interrupt();
  }

  async onRun() {
    const {gdb} = this.props.gdb;
    await gdb.execMI('-exec-run');
  }

  async onFlash() {
    const {gdb} = this.props.gdb;
    const res = await gdb.execMI('-target-download');
  }

  async onStop() {
    const {gdb} = this.props.gdb;
    await gdb.execMI('-gdb-exit');
  }

  async onAbort() {
    const {gdb} = this.props.gdb;
    await gdb.execMI('-exec-abort');
  }

  renderSessionControls() {
    const disabled = false;
    const {execStatus} = this.props.gdb;
    const showContinue = execStatus.state ?
      (execStatus.state === 'stopped') :
      'true';

    return (
      <div className={s.fileinput_container}>
        <Button onClick={this.onRun.bind(this)} variant="outlined">
          Run
        </Button>
        <Button onClick={this.onFlash.bind(this)} variant="outlined">
          Flash
        </Button>
        <Button onClick={this.onAbort.bind(this)} variant="outlined">
          Abort
        </Button>
        {
          showContinue ?
            <Button onClick={this.onContinue.bind(this)} variant="outlined">
              Continue
            </Button>
            :
            <Button onClick={this.onInterrupt.bind(this)} variant="outlined">
              Interrupt
            </Button>
        }
        <IconButton className={s.icon_button} aria-label="Menu">
          <Help />
        </IconButton>
        <Divider className={s.divider} />
        <IconButton disabled={disabled} onClick={this.onStop.bind(this)} color="primary" className={s.iconButton} aria-label="Directions">
          <Stop />
        </IconButton>
      </div>
    );
  }

  renderControls() {
    if (this.props.gdb.launchStatus === 'ok') {
      return this.renderSessionControls();
    } else {
      return this.renderTargetChooser();
    }
  }

  render() {
    return (
      <div className={s.gdb_toolbar}>
        {this.renderControls()}
      </div>
    );
  }
}

export default withStyles(styles)(GDBToolbar);