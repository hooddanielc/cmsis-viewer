import React from 'react';
import {connect} from 'react-redux'
import GDBToolbar from '../components/GDBToolbar/GDBToolbar';

const mapStateToProps = (state) => {
  return state;
}

export const GDBToolbarContainer = connect(
  mapStateToProps,
)(GDBToolbar);

export default GDBToolbarContainer;
