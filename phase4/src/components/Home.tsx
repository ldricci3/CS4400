import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import './Home.css'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import {user, userType, defaultUser} from '../utils';

class Home extends React.Component<homeProps, homeState> {
    constructor(props: homeProps) {
        super(props);

        this.state = {
            loading: false,
            error: ''
        }
    }

    render() {
        const {
            loading,
            error } = this.state;

            if (this.props.user.username === defaultUser.username) {
                return (<Redirect to="/"></Redirect>)
            }

            if (this.props.user.role === userType.STUDENT) {
                return (
                    <Grid container justify={'center'} spacing={3}>
                        <Grid item xs={12}>
                            <h1 className={'pageTitle'}>STUDENT HOME PAGE</h1>
                        </Grid>
                        <Grid item xs={12}>
                            <h2 className={'pageTitle'}>Logged in user: {this.props.user.username}</h2>
                        </Grid>
                        <Grid item container xs={12}>
                            <Grid item xs={6} className={'homeButtonContainer'}>
                                <Link to="/viewTestResults">
                                    <Button variant="contained" color="primary">
                                        View My Results
                                    </Button>
                                </Link>
                            </Grid>
                            <Grid item xs={6} className={'homeButtonContainer'}>
                                <Link to="/example">
                                    <Button variant="contained" color="primary">
                                        View Aggregate Results
                                    </Button>
                                </Link>
                            </Grid>
    
                            <Grid item xs={6} className={'homeButtonContainer'}>
                                <Link to="/testSignUp">
                                    <Button variant="contained" color="primary">
                                        Sign Up for a Test!
                                    </Button>
                                </Link>
                            </Grid>
    
                            <Grid item xs={6} className={'homeButtonContainer'}>
                                <Link to="/example">
                                    <Button variant="contained" color="primary">
                                        View Daily Results
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                        {error && <p>{error}</p>}
                    </Grid> 
                )
            }
            else if (this.props.user.role === userType.ADMIN) {
                return (
                    <Grid container justify={'center'} spacing={3}>
                        <Grid item xs={12}>
                            <h1 className={'pageTitle'}>ADMIN HOME PAGE</h1>
                        </Grid>
                        <Grid item xs={12}>
                            <h2 className={'pageTitle'}>Logged in user: {this.props.user.username}</h2>
                        </Grid>
                        <Grid item container xs={12}>
                            <Grid item xs={6} className={'homeButtonContainer'}>
                                <Link to="/example">
                                    <Button variant="contained" color="primary">
                                        Reassign Testers
                                    </Button>
                                </Link>
                            </Grid>
                            <Grid item xs={6} className={'homeButtonContainer'}>
                                <Link to="/example">
                                    <Button variant="contained" color="primary">
                                        Create Testing Site
                                    </Button>
                                </Link>
                            </Grid>
                            <Grid item xs={6} className={'homeButtonContainer'}>
                                <Link to="/example">
                                    <Button variant="contained" color="primary">
                                        Create Appointment
                                    </Button>
                                </Link>
                            </Grid>
                            <Grid item xs={6} className={'homeButtonContainer'}>
                                <Link to="/example">
                                    <Button variant="contained" color="primary">
                                        View Aggregate Results
                                    </Button>
                                </Link>
                            </Grid>
    
                            <Grid item xs={6} className={'homeButtonContainer'}>
                                <Link to="/viewAppointments">
                                    <Button variant="contained" color="primary">
                                        View Appointments
                                    </Button>
                                </Link>
                            </Grid>
    
                            <Grid item xs={6} className={'homeButtonContainer'}>
                                <Link to="/example">
                                    <Button variant="contained" color="primary">
                                        View Daily Results
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                        {error && <p>{error}</p>}
                    </Grid> 
                )
            }
            else if (this.props.user.role === userType.EMPLOYEE) {
                //Employee is lab tech and site tester
                if (this.props.user.isLabTech && this.props.user.isSiteTester) {
                    return (
                        <Grid container justify={'center'} spacing={3}>
                            <Grid item xs={12}>
                                <h1 className={'pageTitle'}>LAB TECH + SITE TESTER HOME PAGE</h1>
                            </Grid>
                            <Grid item xs={12}>
                                <h2 className={'pageTitle'}>Logged in user: {this.props.user.username}</h2>
                            </Grid>
                            <Grid item container xs={12}>
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/example">
                                        <Button variant="contained" color="primary">
                                            Process Pool
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/example">
                                        <Button variant="contained" color="primary">
                                            Create Pool
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/example">
                                        <Button variant="contained" color="primary">
                                            View Pools
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/labTechTestsProcessed">
                                        <Button variant="contained" color="primary">
                                            View My Processed Tests
                                        </Button>
                                    </Link>
                                </Grid>
        
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/example">
                                        <Button variant="contained" color="primary">
                                            View Aggregate Results
                                        </Button>
                                    </Link>
                                </Grid>
        
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/example">
                                        <Button variant="contained" color="primary">
                                            Change Testing Site
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/viewAppointments">
                                        <Button variant="contained" color="primary">
                                            View Appointments
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/example">
                                        <Button variant="contained" color="primary">
                                            Create Appointments
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/example">
                                        <Button variant="contained" color="primary">
                                            View Daily Results
                                        </Button>
                                    </Link>
                                </Grid>
                            </Grid>
                            {error && <p>{error}</p>}
                        </Grid> 
                    )
                }

                //Employee is lab tech ------------------------------------------------------------------------
                else if (this.props.user.isLabTech && !this.props.user.isSiteTester) {
                    return (
                        <Grid container justify={'center'} spacing={3}>
                            <Grid item xs={12}>
                                <h1 className={'pageTitle'}>LAB TECH HOME PAGE</h1>
                            </Grid>
                            <Grid item xs={12}>
                                <h2 className={'pageTitle'}>Logged in user: {this.props.user.username}</h2>
                            </Grid>
                            <Grid item container xs={12}>
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/example">
                                        <Button variant="contained" color="primary">
                                            Process Pool
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/example">
                                        <Button variant="contained" color="primary">
                                            Create Pool
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/example">
                                        <Button variant="contained" color="primary">
                                            View Pools
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/labTechTestsProcessed">
                                        <Button variant="contained" color="primary">
                                            View My Processed Tests
                                        </Button>
                                    </Link>
                                </Grid>
        
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/example">
                                        <Button variant="contained" color="primary">
                                            View Aggregate Results
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/example">
                                        <Button variant="contained" color="primary">
                                            View Daily Results
                                        </Button>
                                    </Link>
                                </Grid>
                            </Grid>
                            {error && <p>{error}</p>}
                        </Grid> 
                    )
                }

                //Employee is site tester -------------------------------------------------------------------------------------------
                else if (!this.props.user.isLabTech && this.props.user.isSiteTester) {
                    return (
                        <Grid container justify={'center'} spacing={3}>
                            <Grid item xs={12}>
                                <h1 className={'pageTitle'}>SITE TESTER HOME PAGE</h1>
                            </Grid>
                            <Grid item xs={12}>
                                <h2 className={'pageTitle'}>Logged in user: {this.props.user.username}</h2>
                            </Grid>
                            <Grid item container xs={12}>        
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/example">
                                        <Button variant="contained" color="primary">
                                            Change Testing Site
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/viewAppointments">
                                        <Button variant="contained" color="primary">
                                            View Appointments
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/example">
                                        <Button variant="contained" color="primary">
                                            Create Appointments
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/example">
                                        <Button variant="contained" color="primary">
                                            View Daily Results
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item xs={6} className={'homeButtonContainer'}>
                                    <Link to="/example">
                                        <Button variant="contained" color="primary">
                                            View Aggregate Results
                                        </Button>
                                    </Link>
                                </Grid>
                            </Grid>
                            {error && <p>{error}</p>}
                        </Grid> 
                    )

                }

            }
            else {
                return (
                    <Grid container justify={'center'} spacing={3}>
                        <Grid item xs={12}>
                            <h1 className={'pageTitle'}>HOME PAGE</h1>
                        </Grid>
                        <Grid item xs={12}>
                            <h2 className={'pageTitle'}>Logged in user: {this.props.user.username}</h2>
                        </Grid>
                        <Grid item container xs={12}>
                            <Grid item xs={6} className={'homeButtonContainer'}>
                                <Link to="/example">
                                    <Button variant="contained" color="primary">
                                        View My Results
                                    </Button>
                                </Link>
                            </Grid>
                            <Grid item xs={6} className={'homeButtonContainer'}>
                                <Link to="/example">
                                    <Button variant="contained" color="primary">
                                        View Aggregate Results
                                    </Button>
                                </Link>
                            </Grid>
    
                            <Grid item xs={6} className={'homeButtonContainer'}>
                                <Link to="/testSignUp">
                                    <Button variant="contained" color="primary">
                                        Sign Up for a Test!
                                    </Button>
                                </Link>
                            </Grid>
    
                            <Grid item xs={6} className={'homeButtonContainer'}>
                                <Link to="/example">
                                    <Button variant="contained" color="primary">
                                        View Daily Results
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                        {error && <p>{error}</p>}
                    </Grid> 
                )

            }

    }

}

type homeState = {
    loading: boolean,
    error: string
}

type homeProps = {
    user: user
}

export default Home;