import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import styles from '../../styles';
import Page from '../Page/Page';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Register from '../Register/Register';

class Peripheral extends React.Component {

  onSelectItem({register}) {
    if (typeof this.props.onSelectItem !== 'function') {
      return;
    }
    this.props.onSelectItem({
      peripheral: this.props.data,
      register
    });
  }

  renderRegisters() {
    const {registers, name} = this.props.data;
    if (registers) {
      return (
        <Grid item xs={12}>
            {registers.map((register, i) => (
              <Typography onClick={() => this.onSelectItem({register})} key={`register-list-${i}`}>
                {name}_{register.name}
              </Typography>
            ))}
        </Grid>
      );
    }
    return null;
  }

  render() {
    const {classes} = this.props;
    const {addressBlock, baseAddress, registers} = this.props.data;
    return (
      <Grid container spacing={24}>
        <Grid item xs={3}>
          <Typography>
            <b>Base Address:</b> {baseAddress}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>
            <b>Address Offset:</b> {addressBlock.offset}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>
            <b>Address Size:</b> {addressBlock.size}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>
            <b>Usage:</b> {addressBlock.usage}
          </Typography>
        </Grid>
        {this.renderRegisters()}
      </Grid>
    );
  }
}

Peripheral.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Peripheral);
