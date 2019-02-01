import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import styles from '../../styles';
import Page from '../Page/Page';
import LinksByChipName from '../LinksByChipName/LinksByChipName';

function SelectChipPage(props) {
  const {classes} = props;
  const {company} = props.match.params;

  return (
    <Page>
      <LinksByChipName name={company} />
    </Page>
  );
}

SelectChipPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectChipPage);
