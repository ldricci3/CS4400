import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { user, userType } from '../utils';
import './LabTechTestsProcessed.css';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { MDBDataTable } from 'mdbreact';

class LabTechTestsProcessed extends React.Component<labTechTestsProcessedProps, labTechTestsProcessedState> {
    constructor(props: labTechTestsProcessedProps) {
        super(props);

        this.state = {
            loading: false,
            error: '',
            test_status: 'ALL',
            start_date: new Date(0),
            end_date: new Date(0),
            tests: []
        };
    }

    componentDidMount() {
        this.loadLabTechTestsProcessed();
    }

    loadLabTechTestsProcessed() {
        const { test_status, start_date, end_date } = this.state;

        const empty_date = new Date(0);
        const start_date_string = start_date.toString() === empty_date.toString() ? null : `'${start_date.toISOString().substring(0,10)}'`;
        const end_date_string = end_date.toString() === end_date.toString() ? null : `'${end_date.toISOString().substring(0,10)}'`;

        const path = `http://localhost:8080/tests_processed?${start_date_string},${end_date_string},${test_status === 'ALL' ? null : `'${test_status}'`},'${this.props.user.username}'`;

        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                let temp: test[] = [];
                result.result.forEach((e: any) => {
                    let temp_test: test = e;
                    temp_test.test_date = temp_test.test_date.substring(0,10)
                    temp_test.process_date = temp_test.test_date.substring(0,10)
                    temp_test.pool_link = "/explorePoolResult/?" + temp_test.pool_id;
                    temp.push(temp_test);
                })
                this.setState({tests: temp})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        const {
            loading,
            error,
            test_status,
            start_date,
            end_date,
            tests } = this.state;

        const empty_date = new Date(0);

        /**
         * Redirects the user to the home page if they do not have permissions to be on the page
         */
        if (this.props.user.role !== userType.ADMIN && !this.props.user.isLabTech) {
            return (<Redirect to={'/home'}></Redirect>)
        }

        const data = {
            columns: [
                {
                    label: 'Test ID#',
                    field: 'test_id',
                    width: 150
                },
                {
                    label: 'Pool ID',
                    field: 'pool_id',
                    width: 150
                },
                {
                    label: 'Date Tested',
                    field: 'test_date',
                    width: 150
                },
                {
                    label: 'Date Processed',
                    field: 'process_date',
                    width: 150
                },
                {
                    label: 'Result',
                    field: 'test_status',
                    width: 150
                }
            ],
            rows: [...this.state.tests.map((data, i) => (
                {
                   test_id: data.test_id,
                   pool_id: <Link to = {data.pool_link} >{data.pool_id}</Link>,
                   test_date: data.test_date,
                   process_date: data.process_date,
                   test_status: data.test_status
                }
            ))]
        }

        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'pageTitle'}>Lab Tech Tests Processed</h1>
                </Grid>
                <Grid container item xs={10} justify={'space-between'}>
                    <Grid item>
                        <FormLabel component="legend">Test Result</FormLabel>
                        <Select
                            labelId="location-label"
                            required
                            value={test_status}
                            onChange={(event) => this.setState({test_status: `${event.target.value}`})}>
                                <MenuItem value={"ALL"}>Show All</MenuItem>
                                <MenuItem value={"Positive"}>Show Positive Only</MenuItem>
                                <MenuItem value={"Negative"}>Show Negative Only</MenuItem>
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
                        <p></p>
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
                                test_status: 'ALL',
                                start_date: new Date(0),
                                end_date: new Date(0),
                            }, () => this.loadLabTechTestsProcessed());
                        }}>
                            Reset
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained" color="primary" onClick={() => this.loadLabTechTestsProcessed()}>
                            Filter
                        </Button>
                    </Grid>
                </Grid>
                {error ?? <p className={'error'}>{error}</p>}
            </Grid>
        );
    }
}

type labTechTestsProcessedState = {
    loading: boolean,
    error: string,
    test_status: string,
    start_date: Date,
    end_date: Date,
    tests: test[]
}

type test = {
    test_id: string,
    pool_id: string,
    pool_link: string,
    test_date: string,
    process_date: string,
    test_status: string
}

type labTechTestsProcessedProps = {
    user: user
}

export default LabTechTestsProcessed;
