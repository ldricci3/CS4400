import React from 'react';
import SQLTest from './components/SQLTest.js';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";


function App() {
  return (
    <Grid container justify={'center'} className={'contentContainer'} spacing={3}>
        <Grid item xs={6}>
          <Paper className={'contentPaper'}>
            <Router>
              <Switch>
                <Route exact path="/">
                    <Login />
                </Route>
                <Route path="/register">
                    <Register/>
                </Route>
                <Route path="/test">
                    <SQLTest/>
                </Route>
              </Switch>
            </Router>
          </Paper>
        </Grid>
    </Grid>
  );
}

export default App;
