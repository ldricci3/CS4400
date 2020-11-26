import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {user, userType, testingSite} from '../utils';
import './ViewAppointments.css';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { MDBDataTable } from 'mdbreact';
import { parse } from 'url';

class CreateAppointment extends React.Component<createAppointmentsProps, createAppointmentsState> {
    constructor(props: createAppointmentsProps) {
        super(props);

        this.state = {
            loading: false,
            error: '',
            success: '',
            testing_site: 'ALL',
            start_date: new Date(0),
            start_time: '',
            testing_sites: [],
            filter_array: [],
        };
    }

    componentDidMount() {
        this.loadTestingSites();
    }

    loadTestingSites() {
        const adminPath = `http://localhost:8080/get_testing_sites`;
        const testerPath = `http://localhost:8080/view_testers`
        if (this.props.user.isSiteTester) {

            let filter: string[] = [];
            fetch(testerPath)
            .then((res) => res.json())
            .then((result) => {
                result.result.forEach((e: any) => {
                    let view: testerview = e;
                    if (view.username === this.props.user.username) {
                         
                        if (view.assigned_sites !== null) {
                            let temp: string[] = (view.assigned_sites).split(",");
                            console.log(temp);
                            temp.forEach((c: string) => {
                                filter.push(c);
                            })
                            this.setState({filter_array: filter});
                        }
                    }
                })
            })
            .catch((error) => {
                console.log(error);
            });

            const{filter_array} = this.state;
            console.log(filter_array[1]);
            fetch(adminPath)
            .then((res) => res.json())
            .then((result) => {
                console.log(result.result);
                let temp: testingSite[] = [];
                
                
                result.result.forEach((e: testingSite) => {
                    let ts: testingSite = e;
                    //The filter array is defined, but its elements are undefined
                    console.log(filter.includes("Stamps Health Services"));

                    console.log(ts.site_name);
                    //As a result, this includes doesn't work :(
                    if (filter.includes(ts.site_name)) {
                        console.log("LOOPS")
                        temp.push(ts);
                    }
                })
                this.setState({testing_sites: temp});
                console.log(temp);
            })
            .catch((error) => {
                console.log(error);
            })


        } else {
            fetch(adminPath)
            .then((res) => res.json())
            .then((result) => {
                console.log(result.result);
                this.setState({testing_sites: result.result});
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }

    scheduleAppointment() {
        const {testing_site, start_date, start_time} = this.state;

        const empty_date = new Date(0);
        const start_date_string = start_date.toString() === empty_date.toString() ? null : `'${start_date.toISOString().substring(0,10)}'`;

        const start_time_string = start_time ? `'${start_time}:00'` : null;

        const path = `http://localhost:8080/create_appointment?${testing_site === 'ALL' ? null : `'${testing_site}'`},${start_date_string},${start_time_string}`;

        fetch(path).then((res) => res.json())
            .then((res) => {
                console.log(res);
                if (res.Success) {
                    console.log("Successfully Created");
                }
                this.setState({success: '- Appointment Created Successfully'});
            })
            .catch((err) => {
                console.log(err);
                this.setState({success: '- Appointment Creation Failed'});
            });
    
    }

    render() {
        const {
            loading,
            error,
            success,
            testing_sites,
            start_date,
            start_time,
            testing_site } = this.state;

        console.log(this.state);

        const empty_date = new Date(0);

        /**
         * Redirects the user to the home page if they do not have permissions to be on the page
         */
        if (this.props.user.role !== userType.ADMIN && !this.props.user.isSiteTester) {
            return (<Redirect to={'/home'}></Redirect>)
        }

        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'pageTitle'}>Create Appointments {success}</h1>
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
                        <FormLabel component="legend">Date</FormLabel>
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
                    </Grid>
                    <Grid item>
                        <FormLabel component="legend">Time</FormLabel>
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
                    </Grid>
                </Grid>

                <Grid container item xs={10} spacing={2}>
                    <Grid item xs={8}>
                        <Link to="/home">
                            <Button variant="contained" color="primary">
                                Back (Home)
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained" color="primary" onClick={() => this.scheduleAppointment()}>
                            Create
                        </Button>
                    </Grid>
                </Grid>
                {error ?? <p className={'error'}>{error}</p>}
            </Grid>
        );
    }

}

type createAppointmentsState = {
    loading: boolean,
    error: string,
    success: string,
    testing_site: string,
    start_date: Date,
    start_time: string,
    testing_sites: testingSite[],
    filter_array: string[]
}

type appointment = {
    appt_date: string,
    appt_time: string,
    test_site: string,
    location: string,
    username: string
}

type testerview = {
    username: string,
    name: string,
    phone_number: string,
    assigned_sites: string
}

type createAppointmentsProps = {
    user: user
}

export default CreateAppointment;