import React from 'react';
import {connect} from 'react-redux'
import ViewCMSISPage from '../components/ViewCMSISPage/ViewCMSISPage';

const mapStateToProps = (state) => {
  return state;
}

export const ViewCMSISContainer = connect(
  mapStateToProps,
)(ViewCMSISPage);

export default ViewCMSISContainer;
