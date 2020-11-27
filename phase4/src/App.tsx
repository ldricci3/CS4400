import React from 'react';
import SQLTest from './components/SQLTest.js';
import './App.css';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import {user, userType, defaultUser} from './utils';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import Example from './components/Example';
import LabTechTestsProcessed from './components/LabTechTestsProcessed';
import ViewAppointments from './components/ViewAppointments';
import ViewTestResults from './components/ViewTestResults';
import ViewDailyResults from './components/ViewDailyResults';
import SignUpForTest from './components/SignUpForTest';
import AggregateTestResults from './components/AggregateTestResults';
import TesterChangeSite from './components/TesterChangeSite';
import CreateAppointment from './components/CreateAppointment';
import ExplorePoolResult from './components/ExplorePoolResult';

class App extends React.Component<appProps, appState> {

  constructor(props: appProps) {
    super(props);

    this.state = {
      user: defaultUser,
    }
  }

  setActiveUser = (newUser: user) => {
    this.setState({user: newUser})
  }


  render() {
    const { user } = this.state;
    console.log(user);

    return (
      <Grid container justify={'center'} className={'contentContainer'} spacing={3}>
        <Grid item xs={6}>
          <Paper className={'contentPaper'}>
            <Router>
              <Switch>
                <Route exact path="/">
                  <Login user={user} setActiveUser={this.setActiveUser}/>
                </Route>
                <Route path="/register">
                  <Register user={user} setActiveUser={this.setActiveUser}/>
                </Route>
                <Route path="/example">
                  <Example user={user}/>
                </Route>
                <Route path="/home">
                  <Home user={user}/>
                </Route>
                <Route path="/labTechTestsProcessed">
                  <LabTechTestsProcessed user={user}/>
                </Route>
                <Route path="/viewAppointments">
                  <ViewAppointments user={user}/>
                </Route>
                <Route path="/testSignUp">
                  <SignUpForTest user={user}/>
                </Route>
                <Route path="/viewTestResults">
                  <ViewTestResults user={user}/>
                </Route>
                <Route path="/viewdailyresults">
                   <ViewDailyResults user={user}/>
                </Route>
                <Route path="/aggregateTestResults">
                   <AggregateTestResults user={user}/>
                </Route>
                <Route path="/testerChangeSite">
                  <TesterChangeSite user={user}/>
                </Route>
                <Route path="/createAppointment">
                   <CreateAppointment user={user}/>
                </Route>
                <Route path="/test">
                  <SQLTest/>
                </Route>
                <Route path="/ExplorePoolResult/:poolID">
                   <ExplorePoolResult user={user} />
                </Route>
              </Switch>
            </Router>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}


type appProps = {

}

type appState = {
  user: user
}

export default App;
