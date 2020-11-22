import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import './Login.css'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import {user, userType, defaultUser} from '../utils';

class Login extends React.Component<loginProps, loginState> {

    constructor(props: loginProps) {
        super(props);

        this.state = {
            loading: false,
            error: '',
            username: '',
            password: ''
        }
    }

    attemptLogin = () => {
        const { username, password } = this.state;
        
        this.setState({error: ''})

        const path = `http://localhost:8080/get_user?'${username}','${password}'`;

        fetch(path)
            .then(res => res.json())
            .then((result) => {
                result = result.result;
                
                if (result.length > 0) {
                    let role: userType = userType.STUDENT;

                    if (result[0].admin_username !== null) {
                        role = userType.ADMIN;
                    } else if (result[0].emp_username !== null) {
                        role = userType.EMPLOYEE;
                    }

                    const newUser: user = {
                        username: result[0].username,
                        email: result[0].email,
                        firstName: result[0].fname,
                        lastName: result[0].lname,
                        role: role,
                        isSiteTester: result[0].sitetester_username === result[0].username,
                        isLabTech: result[0].labtech_username === result[0].username
                    }

                    this.props.setActiveUser(newUser);
                } else {
                    this.setState({error: 'Username/Password combination not found'});
                }
            })
            .catch((error) => {
                console.log(error)
                this.setState({error: error})
            });
    }

    render() {
        const {loading, error, username, password} = this.state;

        if (this.props.user.username !== defaultUser.username) {
            return (
                <Redirect to="/home" />
            )
        }

        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'pageTitle'}>GT COVID-19 Testing</h1>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="login-username-input"
                        label="Username"
                        value={username}
                        onChange={(event) => this.setState({username: event.target.value})}
                        />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="login-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => this.setState({password: event.target.value})}
                        />
                </Grid>
                <Grid item container xs={8}>
                    <Grid item xs={6} className={'loginButtonContainer'}>
                        <Button variant="contained" color="primary" onClick={this.attemptLogin}>
                            Login
                        </Button>
                    </Grid>
                    <Grid item xs={6} className={'loginButtonContainer'}>
                        <Link to="/register">
                            <Button variant="contained" color="primary">
                                Register
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
                {error && <p>{error}</p>}
            </Grid> 
        )
    }
}

type loginState = {
    loading: boolean,
    error: string,
    username: string,
    password: string
}

type loginProps = {
    user: user,
    setActiveUser: (newUser: user) => void
}

export default Login;