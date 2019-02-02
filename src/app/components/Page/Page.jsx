import 'typeface-roboto';
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Head from '../Head/Head';
import LinksByCompany from '../LinksByCompany/LinksByCompany';
import styles from '../../styles';

class Page extends React.Component {
  render() {
    const {classes} = this.props;

    return (
      <div>
        {/* head */}
        <div className={classes.layout}>
          <Head classes={classes} />
        </div>
        {/* head */}

        {/* main */}
        <main>
          {this.props.children}
        </main>
        {/* main */}
      </div>
    );
  }
}

Page.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Page);
