import React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import './Login.css'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'

class Login extends React.Component<loginProps, loginState> {

    constructor(props: loginProps) {
        super(props);

        this.state = {
            loading: false,
            error: ''
        }
    }

    render() {
        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'loginTitle'}>GT COVID-19 Testing</h1>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="login-username-input"
                        label="Username"
                        autoComplete="current-password"
                        />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="login-password-input"
                        label="Password"
                        type="password"
                        />
                </Grid>
                <Grid item container xs={8}>
                    <Grid item xs={6} className={'loginButtonContainer'}>
                        <Button variant="contained" color="primary">
                            Login
                        </Button>
                    </Grid>
                    <Grid item xs={6} className={'loginButtonContainer'}>
                        <Button variant="contained" color="primary">
                            Register
                        </Button>
                    </Grid>
                </Grid>
                {/* <Link to="/test">Test</Link>    */}
            </Grid> 
        )
    }
}

type loginState = {
    loading: boolean,
    error: string
}

type loginProps = {

}

export default Login;