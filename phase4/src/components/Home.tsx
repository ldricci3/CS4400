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
                            <Link to="/example">
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

type homeState = {
    loading: boolean,
    error: string
}

type homeProps = {
    user: user
}

export default Home;