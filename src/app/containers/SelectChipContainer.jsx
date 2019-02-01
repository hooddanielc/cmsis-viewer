import React from 'react';
import {connect} from 'react-redux'
import SelectChipPage from '../components/SelectChipPage/SelectChipPage';

const mapStateToProps = (state) => {
  return state;
}

export const SelectChipContainer = connect(
  mapStateToProps,
)(SelectChipPage);

export default SelectChipContainer;
