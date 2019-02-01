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


        {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="h6" align="center" gutterBottom>
            Footer
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
            Something here to give the footer a purpose!
          </Typography>
        </footer>
        {/* End footer */}
      </div>
    );
  }
}

Page.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Page);
