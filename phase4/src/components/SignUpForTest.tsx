import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {user, userType, testingSite} from '../utils';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { MDBDataTable } from 'mdbreact';
import Radio from '@material-ui/core/Radio';

class SignUpForTest extends React.Component<signUpForTestProps, signUpForTestState> {
    constructor(props: signUpForTestProps) {
        super(props);

        this.state = {
            loading: false,
            error: '',
            testing_site: 'ALL',
            start_date: new Date(0),
            end_date: new Date(0),
            start_time: '',
            end_time: '',
            testing_sites: [],
            appointments: [],
            hasPendingTest: false,
            selectedAppointment: emptyAppointment
        };
    }

    componentDidMount() {
        this.loadTestingSites();
        this.loadResults();
        this.loadAppointments();
    }

    loadResults() {
        const path = `http://localhost:8080/student_view_results?'${this.props.user.username}',NULL,NULL,NULL`;

        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                result.result.forEach((e: any) => {
                    if (e.test_status === 'pending') {
                        this.setState({hasPendingTest: true});
                    }
                })
            })
    }

    loadTestingSites() {
        const path = `http://localhost:8080/get_testing_sites`;

        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                this.setState({testing_sites: result.result})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    loadAppointments() {
        const { testing_site, start_date, end_date, start_time, end_time } = this.state;


        const empty_date = new Date(0);
        const start_date_string = start_date.toString() === empty_date.toString() ? null : `'${start_date.toISOString().substring(0,10)}'`;
        const end_date_string = end_date.toString() === empty_date.toString() ? null : `'${end_date.toISOString().substring(0,10)}'`;

        const start_time_string = start_time ? `'${start_time}:00'` : null;
        const end_time_string = end_time ? `'${end_time}:00'` : null;

        const path = `http://localhost:8080/test_sign_up_filter?'${this.props.user.username}',${testing_site === 'ALL' ? null : `'${testing_site}'`},${start_date_string},${end_date_string},${start_time_string},${end_time_string}`;
        

        console.log("fetching appointments");
        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                let temp: appointment[] = [];
                result.result.forEach((e: any) => {
                    let apt: appointment = {
                        appt_date: e.appt_date.substring(0,10),
                        appt_time: e.appt_time,
                        site_name: e.site_name,
                        street: e.street
                    };
                    
                    temp.push(apt);
                })
                this.setState({appointments: temp})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    signUpForAppointment() {
        const { selectedAppointment } = this.state;

        fetch('http://localhost:8080/get_max_test_id')
            .then((res) => res.json())
            .then((result) => {
                console.log(result);

                const new_test_id = parseInt(result.result[0].test_id) + 1;

                const path = `http://localhost:8080/test_sign_up?'${this.props.user.username}','${selectedAppointment.site_name}','${selectedAppointment.appt_date}','${selectedAppointment.appt_time}','${new_test_id}'`;

                fetch(path).then((res) => res.json())
                    .then((res) => {
                        console.log(res);
                        if (res.Success) {
                            this.setState({hasPendingTest: true});
                        }
                    })
                    .catch((err) => console.log(err));
            })
    }

    render() {
        const {
            loading,
            error,
            testing_sites,
            start_date,
            end_date,
            start_time,
            end_time,
            testing_site,
            appointments,
            hasPendingTest,
            selectedAppointment } = this.state;

        const empty_date = new Date(0);

        /**
         * Redirects the user to the home page if they do not have permissions to be on the page
         */
        if (this.props.user.role !== userType.STUDENT && this.props.user.role !== userType.ADMIN || hasPendingTest) {
            return (<Redirect to={'/home'}></Redirect>)
        }

        let rows: any[] = [];

        appointments.forEach((apt: appointment) => {
            rows.push({
                appt_date: apt.appt_date,
                appt_time: apt.appt_time,
                street: apt.street,
                site_name: apt.site_name,
                radio: <Radio 
                    checked={selectedAppointment.appt_date + selectedAppointment.appt_time + selectedAppointment.site_name === apt.appt_date + apt.appt_time + apt.site_name}
                    onChange={(event) => this.setState({selectedAppointment: apt})}/>
            })
        })

        const data = {
            columns: [
                {
                    label: 'Date',
                    field: 'appt_date',
                    width: 150
                },
                {
                    label: 'Time',
                    field: 'appt_time',
                    width: 150
                },
                {
                    label: 'Site Address',
                    field: 'street',
                    width: 150
                },
                {
                    label: 'Test Site',
                    field: 'site_name',
                    width: 150
                },
                {
                    label: 'SignUp',
                    field: 'radio',
                    width: 150
                }
            ],
            rows: rows
        }

        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'pageTitle'}>Sign Up For Test</h1>
                </Grid>
                <Grid container item xs={10} justify={'space-between'}>
                    <Grid item>
                        <FormLabel component="legend">Test Site</FormLabel>
                        <Select
                            labelId="location-label"
                            required
                            value={testing_site}
                            onChange={(event) => this.setState({testing_site: `${event.target.value}`})}>
                                <MenuItem value={"ALL"}>All</MenuItem>
                                {testing_sites.map((site: testingSite) => (
                                    <MenuItem value={site.site_name} key={site.site_name}>{site.site_name}</MenuItem>
                                ))}
                        </Select>
                    </Grid>
                    <Grid item>
                        <FormLabel component="legend">Start Date</FormLabel>
                        <form noValidate>
                            <TextField
                                type="date"
                                value={start_date.toString() === empty_date.toString() ? "" : start_date.toISOString().substring(0,10)}
                                className={"start-date-picker"}
                                onChange={(event) => this.setState({start_date: event.target.value === '' ? new Date(0) : new Date(event.target.value)})}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>
                        <FormLabel component="legend">End Date</FormLabel>
                        <form noValidate>
                            <TextField
                                type="date"
                                value={end_date.toString() === empty_date.toString() ? "" : end_date.toISOString().substring(0,10)}
                                className={"end-date-picker"}
                                onChange={(event) => this.setState({end_date: event.target.value === '' ? new Date(0) : new Date(event.target.value)})}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>
                    </Grid>
                    <Grid item>
                        <FormLabel component="legend">Start Time</FormLabel>
                        <form noValidate>
                            <TextField
                                type="time"
                                value={start_time}
                                className={"start-time-picker"}
                                onChange={(event) => this.setState({start_time: event.target.value})}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>
                        <FormLabel component="legend">End Time</FormLabel>
                        <form noValidate>
                            <TextField
                                type="time"
                                value={end_time}
                                className={"end-time-picker"}
                                onChange={(event) => this.setState({end_time: event.target.value})}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>
                    </Grid>
                </Grid>

                <Grid item xs={10}>
                    <MDBDataTable
                        striped
                        bordered
                        sortable={true}
                        small
                        data={data}
                        />
                </Grid>
                <Grid container item xs={10} spacing={2} justify={"space-between"}>
                    <Grid item>
                        <Link to="/home">
                            <Button variant="contained" color="primary">
                                Back (Home)
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => {
                            this.setState({
                                testing_site: 'ALL',
                                start_date: new Date(0),
                                end_date: new Date(0),
                                start_time: '',
                                end_time: ''
                            }, () => this.loadAppointments());
                            
                        }}>
                            Reset
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => this.loadAppointments()}>
                            Filter
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => this.signUpForAppointment()} disabled={selectedAppointment.site_name === ''}>
                            Sign Up
                        </Button>
                    </Grid>
                </Grid>
                {error ?? <p className={'error'}>{error}</p>}
            </Grid>
        );
    }

}

type signUpForTestState = {
    loading: boolean,
    error: string,
    testing_site: string
    start_date: Date,
    end_date: Date,
    start_time: string,
    end_time: string,
    testing_sites: testingSite[],
    appointments: appointment[],
    hasPendingTest: boolean,
    selectedAppointment: appointment
}

type appointment = {
    appt_date: string,
    appt_time: string,
    site_name: string,
    street: string
}

const emptyAppointment = {
    appt_date: '',
    appt_time: '',
    site_name: '',
    street: ''
}

type signUpForTestProps = {
    user: user
}

export default SignUpForTest;