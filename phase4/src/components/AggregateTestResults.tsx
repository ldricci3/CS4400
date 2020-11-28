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

class AggregateTestResults extends React.Component<aggregateTestResultsProps, aggregateTestResultsState> {
    constructor(props: aggregateTestResultsProps) {
        super(props);

        this.state = {
            loading: false,
            error: '',
            start_date: new Date(0),
            end_date: new Date(0),
            total: 0,
            site: 'All',
            location: 'All',
            housing: 'All',
            testing_sites: [],
            locations: [],
            housing_types: [],
            aggregate_results: [],
        };
    }

    componentDidMount = () => {
        this.loadTestingSites();
        this.loadAggregateResults();
    }

    loadLocations() {
        const path = `http://localhost:8080/get_locations`;

        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                this.setState({testing_sites: result.result})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    loadHousing() {
        const path = `http://localhost:8080/get_housing`;

        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                this.setState({housing_types: result.result})
            })
            .catch((error) => {
                console.log(error);
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


    loadAggregateResults = () => {
        const {start_date, end_date, total, site, location, housing } = this.state;

        const empty_date = new Date(0);
        const start_date_string = start_date.toString() === empty_date.toString() ? null : `'${start_date.toISOString().substring(0,10)}'`;
        const end_date_string = end_date.toString() === empty_date.toString() ? null : `'${end_date.toISOString().substring(0,10)}'`;


        const path = `http://localhost:8080/aggregate_results?${location === 'All' ? null : `'${location}'`},${housing === 'All' ? null : `'${housing}'`}, ${site === 'All' ? null : `'${site}'`}, ${start_date_string},${end_date_string},`;
        
        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                console.log(result.result);
                let temp: aggregateResults[] = [];
                let totalVal: number = 0;
                result.result.forEach((e: any) => {
                    let ar: aggregateResults = e;
                    totalVal += ar.num_of_test;
                    temp.push(ar);
                })
                this.setState({aggregate_results: temp, total: totalVal})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        const {
            loading,
            error,
            total, 
            site, 
            location, 
            housing,
            start_date,
            end_date,
            testing_sites,
            locations,
            housing_types,
            aggregate_results} = this.state;

        console.log(this.state);

        const empty_date = new Date(0);

        // if (this.props.user.role !== userType.ADMIN && !this.props.user.isSiteTester) {
        //     return (<Redirect to={'/home'}></Redirect>)
        // }

        const data = {
            columns: [
                {
                    label: 'Total',
                    field: 'test_status',
                    width: 150
                },
                {
                    label: total.toString(),
                    field: 'num_of_test',
                    width: 150
                },
                {
                    label: '100%',
                    field: 'percentage',
                    width: 150
                }
            ],
            rows: aggregate_results
        }

        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'pageTitle'}>View Aggregate Results</h1>
                </Grid>
                <Grid container item xs={10} justify={'space-between'}>
                    <Grid item>
                        <FormLabel component="legend">Test Site</FormLabel>
                        <Select
                            labelId="location-label"
                            required
                            value={site}
                            onChange={(event) => this.setState({site: `${event.target.value}`})}>
                                <MenuItem value={"All"}>All</MenuItem>
                                {testing_sites.map((site: testingSite) => (
                                    <MenuItem value={site.site_name} key={site.site_name}>{site.site_name}</MenuItem>
                                ))}
                        </Select>
                        <FormLabel component="legend">Location</FormLabel>
                        <Select
                            labelId="location-label"
                            required
                            value={location}
                            onChange={(event) => this.setState({location: `${event.target.value}`})}>
                                <MenuItem value={"All"}>Show All</MenuItem>
                                <MenuItem value={"East"}>East Campus</MenuItem>
                                <MenuItem value={"West"}>West Campus</MenuItem>
                        </Select>
                        <FormLabel component="legend">Housing</FormLabel>
                        <Select
                            labelId="location-label"
                            required
                            value={housing}
                            onChange={(event) => this.setState({housing: `${event.target.value}`})}>
                                <MenuItem value={"All"}>Show All</MenuItem>
                                <MenuItem value={"Student Housing"}>Student Housing</MenuItem>
                                <MenuItem value={"Greek Housing"}>Greek Housing</MenuItem>
                                <MenuItem value={"Off-campus Apartment"}>Off-Campus: Apartment</MenuItem>
                                <MenuItem value={"Off-campus House"}>Off-Campus House</MenuItem>
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
                                total: 0,
                                site: 'All',
                                location: 'All',
                                housing: 'All',
                                start_date: new Date(0),
                                end_date: new Date(0),
                            }, () => this.loadAggregateResults());
                        }}>
                            Reset
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained" color="primary" onClick={() => this.loadAggregateResults()}>
                            Filter
                        </Button>
                    </Grid>
                </Grid>
                {error && <p>{error}</p>}
            </Grid>
        );
    }

}

type aggregateTestResultsState = {
    loading: boolean,
    error: string,
    start_date: Date,
    end_date: Date,
    total: number,
    site: string,
    location: string,
    housing: string,
    testing_sites: [],
    locations: [],
    housing_types: [],
    aggregate_results: aggregateResults[]
}

type aggregateResults = {
    test_status: string,
    num_of_test: number,
    percentage: number
}

type aggregateTestResultsProps = {
    user: user
}

export default AggregateTestResults;