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
import Radio from '@material-ui/core/Radio';
import {AppBar, Tabs, Tab} from '@material-ui/core';
import {RadioGroup, FormControl, FormControlLabel} from '@material-ui/core';
//import TabPanel from '@material-ui/lab/TabPanel';

class ProcessPool extends React.Component<processPoolProps, processPoolState> {
    constructor(props: processPoolProps) {
        super(props);

        this.state = {
            //loading: false,
            //error: '',
            success: '',
            poolID: parseInt(window.location.href.substring(34)),
            tests: [],
            username: this.props.user.username,
            date_processed: new Date(0),
            pool_status: ''
        };
    }

    componentDidMount() {
        this.loadTests();
    }

    loadTests() {
        const path = `http://localhost:8080/tests_in_pool?${this.state.poolID}`;

        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                console.log(result.result);
                let temp: test[] = [];
                result.result.forEach((e: any) => {
                    let tr: test = {
                        test_id: e.test_id,
                        date_tested: e.date_tested.substring(0,10),
                        test_result: 'negative',
                        date_processed: e.process_date === undefined ? null:  e.process_date.substring(0,10)
                    };
                    temp.push(tr);
                })
                this.setState({tests: temp})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    processPool() {
        const {poolID, pool_status, date_processed, username} = this.state;
        const empty_date = new Date(0);
        const date_processed_string = date_processed.toString() === empty_date.toString() ? null : `'${date_processed.toISOString().substring(0,10)}'`;

        const path = `http://localhost:8080/process_pool?${poolID},'${pool_status}',${date_processed_string},'${username}'`;

        fetch(path).then((res) => res.json())
            .then((res) => {
                console.log(res);
                if (res.Success) {
                    console.log("Successfully Created");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    processTest(rows: test[]) {
        const {tests, pool_status} = this.state;

        if (pool_status == "negative") {
            tests.forEach((e: any) => {
                const path = `http://localhost:8080/process_test?${e.test_id},'${e.test_result}'`;

                fetch(path).then((res) => res.json())
                    .then((res) => {
                        console.log(res);
                        if (res.Success) {
                            console.log("Successfully Modified");
                            this.setState({success: 'successful'});
                        }
                    })
                    .catch((err) => {
                        this.setState({success: 'error'});
                        console.log(err);
                    });
            });
        } else {
            rows.forEach((e: any) => {
                const path = `http://localhost:8080/process_test?${e.test_id},'${e.test_result}'`;

                if (e.test_result == 'positive' || e.test_result == 'negative') {
                    fetch(path).then((res) => res.json())
                        .then((res) => {
                            console.log(res);
                            if (res.Success) {
                                console.log("Successfully Modified");
                                this.setState({success: 'successful'});
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            this.setState({success: 'error'});
                        });
                } else {
                    this.setState({success: 'please select all test results'});
                }
            });
        }
    }

    render() {
        const {
            //loading,
            //error,
            success,
            poolID,
            tests,
            username,
            date_processed,
            pool_status } = this.state;

        console.log(this.state);

        const empty_date = new Date(0);

        let rows: any[] = [];
        tests.forEach((t: test) => {
            rows.push({
                test_id: t.test_id,
                date_tested: t.date_tested,
                select: <Select onChange={(event) => t.test_result= `${event.target.value}`}>
                            <MenuItem value={"positive"}>Positive</MenuItem>
                            <MenuItem value={"negative"}>Negative</MenuItem>
                        </Select>
            })
        })

            let data = {
                columns: [
                    {
                        label: 'Test ID#',
                        field: 'test_id',
                        width: 150
                    },
                    {
                        label: 'Date Tested',
                        field: 'date_tested',
                        width: 150
                    },
                    {
                        label: 'Test Result',
                        field: 'select',
                        width: 150
                    }
                ],
                rows: rows
            }

        if (pool_status == "positive") {
            data = {
                columns: [
                    {
                        label: 'Test ID#',
                        field: 'test_id',
                        width: 150
                    },
                    {
                        label: 'Date Tested',
                        field: 'date_tested',
                        width: 150
                    },
                    {
                        label: 'Test Result',
                        field: 'select',
                        width: 150
                    }
                ],
                rows: rows
            }
        } else {
            data = {
                columns: [
                    {
                        label: 'Test ID#',
                        field: 'test_id',
                        width: 150
                    },
                    {
                        label: 'Date Tested',
                        field: 'date_tested',
                        width: 150
                    },
                    {
                        label: 'Test Result',
                        field: 'test_result',
                        width: 150
                    }
                ],
                rows: tests
            }
        }

        console.log(this.state);

        /**
         * Redirects the user to the home page if they do not have permissions to be on the page
         */
        if (!this.props.user.isLabTech || tests[0].date_processed !== null) { //this.props.user.role !== userType.ADMIN && !this.props.user.isSiteTester) {
            return (<Redirect to={'/home'}></Redirect>)
        }

        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'pageTitle'}>Process Pool</h1>
                </Grid>
                <Grid item xs={10} alignContent={'center'} justify={'center'}>
                    <h2 className={'success'}>{success}</h2>
                </Grid>
                <Grid container item xs ={10} justify={'center'}>
                    <Grid item xs={3}>
                        <p className={'pool_id'}>Pool ID:</p>
                    </Grid>
                    <Grid item xs={7}>
                        <p className={'pool_id'}>{poolID}</p>
                    </Grid>
                </Grid>

                <Grid container item xs ={10} justify={'center'}>
                    <Grid item xs={3}>
                        <p className={'pool_id'}>Date Processed</p>
                    </Grid>
                    <Grid item xs={7}>
                        <form noValidate>
                            <TextField
                                type="date"
                                value={date_processed.toString() === empty_date.toString() ? "" : date_processed.toISOString().substring(0,10)}
                                className={"date_processed-picker"}
                                onChange={(event) => this.setState({date_processed: event.target.value === '' ? new Date(0) : new Date(event.target.value)})}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>
                    </Grid>
                </Grid>

                <Grid container item xs={10} justify={'space-between'}>
                    <Grid item>
                        <FormControl>
                          <FormLabel component="legend">Pool Status</FormLabel>
                          <RadioGroup aria-label="pool_status-setter" name="pool_status-setter" value={pool_status} onChange={(event) => this.setState({pool_status: event.target.value})}>
                            <FormControlLabel value="positive" control={<Radio />} label="Positive" />
                            <FormControlLabel value="negative" control={<Radio />} label="Negative" />
                          </RadioGroup>
                        </FormControl>
                            <Grid item xs={10}>
                                <MDBDataTable
                                    striped
                                    bordered
                                    sortable={true}
                                    small
                                    data={data}
                                    />
                            </Grid>

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
                        <Button variant="contained" color="primary" onClick={() => {
                            if (date_processed !== empty_date && pool_status !== '') {
                                this.processPool(); this.processTest(rows)
                                } else {
                                this.setState({success: 'please fill in all fields'});
                                }
                            }}>
                            Process Pool
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

}

type processPoolState = {
    // loading: boolean,
    // error: string,
    success: string,
    poolID: number,
    tests: test[],
    username: string,
    date_processed: Date,
    pool_status: string
}

type test = {
    test_id: number,
    date_tested: string,
    test_result: string,
    date_processed: string
}

type processPoolProps = {
    user: user
}

                        /** This is what I tried to use...
                        <AppBar position="static">
                            <Tabs value={pool_status} onChange={(event) => this.setState({pool_status: `${pool_status}`})}>
                                <Tab label="Positive" />
                                <Tab label="Negative" />
                            </Tabs>
                        </AppBar>
                        <TabPanel value={pool_status} index={0}>
                            <Grid item xs={10}>
                                <MDBDataTable
                                    striped
                                    bordered
                                    sortable={true}
                                    small
                                    data={pos_data}
                                    />
                            </Grid>
                        </TabPanel>
                        <TabPanel value={pool_status} index={1}>
                            <Grid item xs={10}>
                                <MDBDataTable
                                    striped
                                    bordered
                                    sortable={true}
                                    small
                                    data={neg_data}
                                    />
                            </Grid>
                        </TabPanel> **/


                        /*<FormLabel component="legend">Pool Status</FormLabel>
                        <Grid container item xs = {8} justify={'space-between'}>
                            <Grid item xs={2}>
                                <Button variant="contained" color="primary" onClick={() => {this.setState({pool_status: 'positive'})}}>
                                    Positive
                                </Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button variant="contained" color="primary" onClick={() => {this.setState({pool_status: 'negative'})}}>
                                    Negative
                                </Button>
                            </Grid>*/
export default ProcessPool;