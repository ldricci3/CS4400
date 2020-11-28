import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {user, userType} from '../utils';
import './ViewAppointments.css';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { MDBDataTable } from 'mdbreact';

class ViewTestResults extends React.Component<viewTestResultsProps, viewTestResultsState> {
    constructor(props: viewTestResultsProps) {
        super(props);

        this.state = {
            loading: false,
            error: '',
            status: 'All',
            start_date: new Date(0),
            end_date: new Date(0),
            test_results: []
        };
    }

    componentDidMount = () => {
        this.loadTestResults();
    }


    loadTestResults = () => {
        const {status, start_date, end_date } = this.state;

        const empty_date = new Date(0);
        const start_date_string = start_date.toString() === empty_date.toString() ? null : `'${start_date.toISOString().substring(0,10)}'`;
        const end_date_string = end_date.toString() === empty_date.toString() ? null : `'${end_date.toISOString().substring(0,10)}'`;


        const path = `http://localhost:8080/student_view_results?'${this.props.user.username}',${status === 'All' ? null : `'${status}'`},${start_date_string},${end_date_string},`;
        
        console.log(start_date_string);
        console.log(end_date_string);

        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                console.log(result.result);
                let temp: testResults[] = [];
                result.result.forEach((e: any) => {
                    let tr: testResults = e;
                    tr.timeslot_date = tr.timeslot_date.substring(0,10);
                    if (tr.date_processed !== null) {
                        tr.date_processed = tr.date_processed.substring(0,10);
                    }
                    tr.test_link = "/exploreTestResult/?" + tr.test_id;
                    temp.push(tr);
                })
                this.setState({test_results: temp})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        const {
            loading,
            error,
            status,
            start_date,
            end_date,
            test_results } = this.state;

        console.log(this.state);

        const empty_date = new Date(0);

        const status_type: string[] = ['Negative', 'Positive','Pending'];

        // if (this.props.user.role !== userType.ADMIN && !this.props.user.isSiteTester) {
        //     return (<Redirect to={'/home'}></Redirect>)
        // }

        const data = {
            columns: [
                {
                    label: 'Test ID#',
                    field: 'test_id',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Timeslot Date',
                    field: 'timeslot_date',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Date Processed',
                    field: 'date_processed',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Pool Status',
                    field: 'pool_status',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Status',
                    field: 'test_status',
                    sort: 'asc',
                    width: 150
                }
            ],
            rows:  [...this.state.test_results.map((data, i) => (
                {
                   test_id: data.test_status === 'pending' ? data.test_id : <Link to = {data.test_link}> {data.test_id}</Link>,
                   timeslot_date: data.timeslot_date,
                   date_processed: data.date_processed,
                   pool_status: data.pool_status,
                   test_status: data.test_status
                }
            ))]
        }

        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'pageTitle'}>View Test Results - {this.props.user.username} </h1>
                </Grid>
                <Grid container item xs={10} spacing={4} justify={'space-between'}>
                    <Grid item>
                        <FormLabel component="legend">Test Status</FormLabel>
                        <Select
                            labelId="location-label"
                            required
                            value={status}
                            onChange={(event) => this.setState({status: `${event.target.value}`})}>
                                <MenuItem value={"All"}>All</MenuItem>
                                <MenuItem value={"Negative"}>Negative</MenuItem>
                                <MenuItem value={"Positive"}>Positive</MenuItem>
                                <MenuItem value={"Pending"}>Pending</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item justify={'center'}>
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
                </Grid>

                <Grid item xs={10}>
                    <MDBDataTable
                        striped
                        bordered
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
                                status: 'All',
                                start_date: new Date(0),
                                end_date: new Date(0),
                            }, () => this.loadTestResults());
                        }}>
                            Reset
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained" color="primary" onClick={() => this.loadTestResults()}>
                            Filter
                        </Button>
                    </Grid>
                </Grid>
                {error && <p>{error}</p>}
            </Grid>
        );
    }

}

type viewTestResultsState = {
    loading: boolean,
    error: string,
    status: string,
    start_date: Date,
    end_date: Date,
    test_results: testResults[]
}

type testResults = {
    test_id: number,
    timeslot_date: string,
    date_processed: string,
    test_link: string,
    pool_status: string,
    test_status: string
}

type viewTestResultsProps = {
    user: user,
}

export default ViewTestResults;