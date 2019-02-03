import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

import styles from '../../styles';
import s from './PeripheralList.scss';
import classnames from 'classnames';
import Peripheral from '../Peripheral/Peripheral';

class PeripheralList extends React.Component {
  shouldComponentUpdate(props) {
    return this.props.peripherals.length != props.peripherals.length;
  }

  render() {
    const {classes} = this.props;
    return (
      <div>
        {this.props.peripherals.map((data, i) => (
          <ExpansionPanel key={`peripheral-item-${i}`}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading} variant="title">
                {data.name}
              </Typography>
              <Typography className={classnames(classes.heading, s.subtitle)}>
                {data.description}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Peripheral onSelectItem={this.props.onSelectItem} data={data} />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </div>
    );
  }
}

PeripheralList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PeripheralList);
