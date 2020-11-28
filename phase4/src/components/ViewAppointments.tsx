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

class ViewAppointments extends React.Component<viewAppointmentsProps, viewAppointmentsState> {
    constructor(props: viewAppointmentsProps) {
        super(props);

        this.state = {
            loading: false,
            error: '',
            testing_site: 'ALL',
            availability: 'ALL',
            start_date: new Date(0),
            end_date: new Date(0),
            start_time: '',
            end_time: '',
            testing_sites: [],
            appointments: []
        };
    }

    componentDidMount() {
        this.loadTestingSites();
        
        this.loadAppointments();
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
        const { testing_site, availability, start_date, end_date, start_time, end_time } = this.state;

        let is_available = null;

        if (availability === "BOOKED") {
            is_available = "'0'"
        } else if (availability === "AVAILABLE") {
            is_available = "'1'"
        }

        const empty_date = new Date(0);
        const start_date_string = start_date.toString() === empty_date.toString() ? null : `'${start_date.toISOString().substring(0,10)}'`;
        const end_date_string = end_date.toString() === empty_date.toString() ? null : `'${end_date.toISOString().substring(0,10)}'`;

        const start_time_string = start_time ? `'${start_time}:00'` : null;
        const end_time_string = end_time ? `'${end_time}:00'` : null;

        const path = `http://localhost:8080/view_appointments?${testing_site === 'ALL' ? null : `'${testing_site}'`},${start_date_string},${end_date_string},${start_time_string},${end_time_string},${is_available},`;
    
        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                let temp: appointment[] = [];
                result.result.forEach((e: any) => {
                    let apt: appointment = e;
                    apt.appt_date = apt.appt_date.substring(0,10);
                    apt.username = e.username === null ? '' : e.username + '';
                    temp.push(apt);
                })
                this.setState({appointments: temp})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        const {
            loading,
            error,
            testing_sites,
            availability,
            start_date,
            end_date,
            start_time,
            end_time,
            testing_site,
            appointments } = this.state;

        const empty_date = new Date(0);

        /**
         * Redirects the user to the home page if they do not have permissions to be on the page
         */
        if (this.props.user.role !== userType.ADMIN && !this.props.user.isSiteTester) {
            return (<Redirect to={'/home'}></Redirect>)
        }

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
                    label: 'Test Site',
                    field: 'site_name',
                    width: 150
                },
                {
                    label: 'Location',
                    field: 'location',
                    width: 150
                },
                {
                    label: 'User',
                    field: 'username',
                    width: 150
                }
            ],
            rows: appointments
        }

        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'pageTitle'}>View Appointments</h1>
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
                        <FormLabel component="legend">Availability</FormLabel>
                        <Select
                            labelId="location-label"
                            required
                            value={availability}
                            onChange={(event) => this.setState({availability: `${event.target.value}`})}>
                                <MenuItem value={"ALL"}>Show All</MenuItem>
                                <MenuItem value={"AVAILABLE"}>Show Available Only</MenuItem>
                                <MenuItem value={"BOOKED"}>Show Booked Only</MenuItem>
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
                <Grid container item xs={10} spacing={2}>
                    <Grid item xs={8}>
                        <Link to="/home">
                            <Button variant="contained" color="primary">
                                Back (Home)
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained" color="primary" onClick={() => {
                            this.setState({
                                testing_site: 'ALL',
                                availability: 'ALL',
                                start_date: new Date(0),
                                end_date: new Date(0),
                                start_time: '',
                                end_time: ''
                            }, () => this.loadAppointments());
                            
                        }}>
                            Reset
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained" color="primary" onClick={() => this.loadAppointments()}>
                            Filter
                        </Button>
                    </Grid>
                </Grid>
                {error ?? <p className={'error'}>{error}</p>}
            </Grid>
        );
    }

}

type viewAppointmentsState = {
    loading: boolean,
    error: string,
    testing_site: string,
    availability: string
    start_date: Date,
    end_date: Date,
    start_time: string,
    end_time: string,
    testing_sites: testingSite[],
    appointments: appointment[]
}

type appointment = {
    appt_date: string,
    appt_time: string,
    test_site: string,
    location: string,
    username: string
}

type viewAppointmentsProps = {
    user: user
}

export default ViewAppointments;