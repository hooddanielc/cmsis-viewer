import 'typeface-roboto';
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux'
import store from '../../store';

import HomeContainer from '../../containers/HomeContainer.jsx';
import SelectChipContainer from '../../containers/SelectChipContainer';
import ViewCMSISContainer from '../../containers/ViewCMSISContainer';
import s from './App.scss';

export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Provider store={store}>
          <Router className={s.body}>
            <Switch>
              <Route exact path="/" component={HomeContainer} />
              <Route exact path="/cmsis/:company" component={SelectChipContainer} />
              <Route exact path="/cmsis/:company/chip/:chip" component={ViewCMSISContainer} />
            </Switch>
          </Router>
        </Provider>
      </React.Fragment>
    );
  }
}
