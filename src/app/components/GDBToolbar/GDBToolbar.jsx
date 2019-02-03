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

import styles from '../../styles';
import s from './GDBToolbar.scss';
import {load, analyze} from '../../actions/gdb'; 

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
    try {
      const filepath = this.input.value;
      await this.props.dispatch(load({filepath}));
      await this.props.dispatch(analyze({filepath}));
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    console.log('this.props', this.props);
    return (
      <div className={s.gdb_toolbar}>
        <div className={s.fileinput_container}>
          <IconButton className={s.icon_button} aria-label="Menu">
            <Help />
          </IconButton>
          <InputBase inputRef={(el) => this.input = el} className={s.input} placeholder="Enter Filepath" />
          <IconButton onClick={this.fileIconClick.bind(this)} className={s.iconButton} aria-label="Open File">
            <input onChange={this.onFileInputChange.bind(this)} ref={(el) => this.fileinput = el} type="file" className={s.hidden} />
            <Pageview />
          </IconButton>
          <Divider className={s.divider} />
          <IconButton onClick={this.startIconClick.bind(this)} color="primary" className={s.iconButton} aria-label="Directions">
            <PlayCircleFilled />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(GDBToolbar);