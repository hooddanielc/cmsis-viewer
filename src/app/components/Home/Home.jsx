import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import LinksByCompany from '../LinksByCompany/LinksByCompany';
import styles from '../../styles';
import Page from '../Page/Page';

function Home(props) {
  const {classes} = props;

  return (
    <Page>
      <LinksByCompany />
    </Page>
  );
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
