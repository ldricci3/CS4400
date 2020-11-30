import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {user, userType, defaultUser} from '../utils';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from '@material-ui/core/Checkbox';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import './Register.css'


class Register extends React.Component<registerProps, registerState> {
    constructor(props: registerProps) {
        super(props);

        this.state = {
            loading: false,
            error: '',
            username: '',
            email: '',
            firstname: '',
            lastname: '',
            password: '',
            confirmPassword: '',
            tab: 0,
            housingType: '',
            location: '',
            phoneNumber: '',
            // errorMessage: '',
            isSiteTester: false,
            isLabTech: false
        }
    }

    registerUser = () => {
        const {username, 
            email, 
            firstname, 
            lastname, 
            password, 
            confirmPassword, 
            tab,
            housingType,
            location,
            phoneNumber,
            isSiteTester,
            isLabTech } = this.state;
            
        let path: string;
        if (tab === 0) {
            path = `http://localhost:8080/register_student?'${username}','${email}','${firstname}','${lastname}','${location}','${housingType}','${password}'`;
        } else {
            path = `http://localhost:8080/register_employee?'${username}','${email}','${firstname}','${lastname}','${phoneNumber}',${isLabTech},${isSiteTester},'${password}'`;
        }

        fetch(path).then(res => res.json())
            .then((result) => {
                console.log(result);

                if ('code' in result) {
                    this.setState({error: result.sqlMessage});
                    return;
                }

                if (result.Success) {
                    this.setState({error: 'Success'});
                }

                const newUser: user = {
                    username: username,
                    email: email,
                    firstName: firstname,
                    lastName: lastname,
                    role: tab === 0 ? userType.STUDENT : userType.EMPLOYEE,
                    isSiteTester: isSiteTester,
                    isLabTech: isLabTech
                }

                this.props.setActiveUser(newUser);
            })
            .catch((error) => {
                console.log(error);

                this.setState({error: error});
            })
    }

    render() {
        const { error,
            username, 
            email, 
            firstname, 
            lastname, 
            password, 
            confirmPassword, 
            tab,
            housingType,
            location,
            phoneNumber,
            // errorMessage,
            isSiteTester,
            isLabTech } = this.state;

        if (this.props.user.username !== defaultUser.username) {
            return (
                <Redirect to="/home" />
            )
        }

        const differentPasswords = confirmPassword.length > 0 && password !== confirmPassword;
        const validEmail: boolean = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email) && email.length < 25 && email.length >= 5;

        const canRegister = username.length > 0 && validEmail && firstname.length > 0 && lastname.length > 0 && password.length > 7 && password === confirmPassword && //user general stuff 
        ((tab === 0 && housingType !== '' && location !== '' && phoneNumber === '' && !isSiteTester && !isLabTech) || //requirements for students
        (tab === 1 && housingType === '' && location === '' && phoneNumber.length === 10 && /^\d+$/.test(phoneNumber) && (isSiteTester || isLabTech))) //requirements for employees
        

        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'pageTitle'}>Register </h1>
                </Grid>

                <Grid item container xs={8} spacing={3}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            required
                            variant="outlined"
                            margin="normal"
                            id="username-register-input"
                            label="Username"
                            value={username}
                            onChange={(event) => this.setState({username: event.target.value})}
                            />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            required
                            variant="outlined"
                            margin="normal"
                            id="email-register-input"
                            label="Email"
                            value={email}
                            onChange={(event) => this.setState({email: event.target.value})}
                            helperText = {email.length > 0 && !validEmail ? "Invalid Email Address" : ""}
                            error = {email.length > 0 && !validEmail}
                            />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            id="firstname-register-input"
                            label="First Name"
                            value={firstname}
                            onChange={(event) => this.setState({firstname: event.target.value})}
                            />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            id="lastname-register-input"
                            label="Last Name"
                            value={lastname}
                            onChange={(event) => this.setState({lastname: event.target.value})}
                            />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            id="password-register-input"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(event) => this.setState({password: event.target.value})}
                            autoComplete="current-password"
                            helperText = {password.length > 0 && password.length < 8 ? "Passwords must be 8+ characters" : ""}
                            error = {password.length > 0 && password.length < 8}
                            />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            id="confirm-register-input"
                            label="Confirm Password"
                            type="password"
                            autoComplete="current-password"
                            value={confirmPassword}
                            onChange={(event) => this.setState({confirmPassword: event.target.value})}
                            helperText = {differentPasswords ? "Passwords are different" : ""}
                            error = {differentPasswords}
                            />
                    </Grid>
                </Grid>

                <Grid container item xs={8}>
                    <Paper elevation={2} className={"registerTabs"}>
                        <Tabs
                            indicatorColor="primary"
                            textColor="primary"
                            value={tab}
                            onChange={(event, value) => this.setState({tab: value})}
                            variant="fullWidth">

                            <Tab label="Student" />
                            <Tab label="Employee" />
                        </Tabs>
                        {tab == 0 ? 
                        <Grid container item xs={12} justify={'center'} >
                            <Grid item xs={4} className={'dropdownFormsContainer'}>
                                <FormControl className={'formControl'} fullWidth>
                                    <InputLabel id="housing-type-label">Housing Type</InputLabel>
                                    <Select
                                        labelId="housing-type-label"
                                        required
                                        value={housingType}
                                        onChange={(event) => this.setState({housingType: `${event.target.value}`})}>
                                        <MenuItem value={""}>None</MenuItem>
                                        <MenuItem value={"Greek Housing"}>Greek Housing</MenuItem>
                                        <MenuItem value={"Student Housing"}>Student Housing</MenuItem>
                                        <MenuItem value={"Off-campus Apartment"}>Off-campus Apartment</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={4} className={'dropdownFormsContainer'}>
                                <FormControl className={'formControl'} fullWidth>
                                    <InputLabel id="location-label">Location</InputLabel>
                                    <Select
                                        labelId="location-label"
                                        required
                                        value={location}
                                        onChange={(event) => this.setState({location: `${event.target.value}`})}>
                                        <MenuItem value={""}>None</MenuItem>
                                        <MenuItem value={"East"}>East</MenuItem>
                                        <MenuItem value={"West"}>West</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    :
                    <Grid container item xs={12} justify={'center'}>
                        <Grid item xs={4} className={'dropdownFormsContainer'}>
                            <TextField
                                required
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                id="phonenumber-register-input"
                                label="Phone Number"
                                value={phoneNumber}
                                onChange={(event) => this.setState({phoneNumber: event.target.value})}
                                />
                        </Grid>
                        <Grid item xs={4} className={'dropdownFormsContainer'}>
                            <FormControl>
                                <FormGroup>
                                    <FormControlLabel
                                    control={
                                    <Checkbox
                                        checked={isSiteTester}
                                        onChange={(event) => this.setState({isSiteTester: event.target.checked})}
                                        color="primary"
                                    />
                                    }
                                    label="Site Tester"/>
                                    <FormControlLabel
                                    control={
                                    <Checkbox
                                        checked={isLabTech}
                                        onChange={(event) => this.setState({isLabTech: event.target.checked})}
                                        color="primary"
                                    />
                                    }
                                    label="Lab Tech"/>
                                </FormGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                    }
                    </Paper>
                </Grid>

                <Grid item container xs={8}>
                    <Grid item xs={6} className={'registerButtonContainer'}>
                        <Link to="/">
                            <Button variant="contained" color="primary">
                                Back to Login
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item xs={6} className={'registerButtonContainer'}>
                        <Button variant="contained" color="primary" disabled={!canRegister} onClick={this.registerUser}>
                            Register
                        </Button>
                    </Grid>
                </Grid>
                {error && <p>{error}</p>}
            </Grid>
        );
    }
}

type registerState = {
    loading: boolean,
    error: string,
    username: string,
    email: string,
    firstname: string,
    lastname: string,
    password: string,
    confirmPassword: string,
    tab: number,
    housingType: string,
    location: string,
    phoneNumber: string,
    // errorMessage: string,
    isSiteTester: boolean,
    isLabTech: boolean
}

type registerProps = {
    user: user,
    setActiveUser: (newUser: user) => void
}

export default Register;

