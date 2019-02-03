import React from 'react';
import {connect} from 'react-redux'
import Register from '../components/Register/Register';

const mapStateToProps = (state) => {
  return state;
}

export const RegisterContainer = connect(
  mapStateToProps,
)(Register);

export default RegisterContainer;
