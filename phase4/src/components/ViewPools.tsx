import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { user, userType } from '../utils';
import './ViewPools.css';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { MDBDataTable } from 'mdbreact';

class ViewPools extends React.Component<ViewPoolsProps, ViewPoolsState> {
    constructor(props: ViewPoolsProps) {
        super(props);

        this.state = {
            loading: false,
            error: '',
            pool_status: 'ALL',
            start_date: new Date(0),
            end_date: new Date(0),
            processed_by: '',
            pools: []
        };
    }

    componentDidMount() {
        this.loadViewPools();
    }

    loadViewPools() {
        const { pool_status, processed_by, start_date, end_date } = this.state;

        const empty_date = new Date(0);
        const start_date_string = start_date.toString() === empty_date.toString() ? null : `'${start_date.toISOString().substring(0,10)}'`;
        const end_date_string = end_date.toString() === end_date.toString() ? null : `'${end_date.toISOString().substring(0,10)}'`;

        const path = `http://localhost:8080/view_pools?${start_date_string},${end_date_string},${pool_status === 'ALL' ? null : `'${pool_status}'`},${processed_by === '' ? null : `'${processed_by}'`}`;

        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                let temp: pool[] = [];
                result.result.forEach((e: any) => {
                    let temp_pool: pool = e;
                    temp_pool.pool_link = "/explore_pool_result?" + temp_pool.pool_id;
                    temp.push(temp_pool);
                })
                this.setState({pools: temp})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        const {
            loading,
            error,
            pool_status,
            start_date,
            end_date,
            pools } = this.state;

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
                    label: 'Pool ID',
                    field: 'pool_id',
                    width: 150
                },
                {
                    label: 'Test Ids',
                    field: 'test_ids',
                    width: 150
                },
                {
                    label: 'Date Processed',
                    field: 'date_processed',
                    width: 150
                },
                {
                    label: 'Processed By',
                    field: 'processed_by',
                    width: 150
                },
                {
                    label: 'Pool Status',
                    field: 'pool_status',
                    width: 150
                }
            ],
            rows: [...this.state.pools.map((data, i) => (
                {
                   pool_id: <a href={data.pool_link}>{data.pool_id}</a>,
                   test_ids: data.test_ids,
                   date_processed: data.date_processed,
                   processed_by: data.processed_by,
                   pool_status: data.pool_status
                }
            ))]
        }

        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'pageTitle'}>View Pools</h1>
                </Grid>
                <Grid container item xs={10} justify={'space-between'}>
                    <Grid item>
                        <FormLabel component="legend">Test Result</FormLabel>
                        <Select
                            labelId="location-label"
                            required
                            value={pool_status}
                            onChange={(event) => this.setState({pool_status: `${event.target.value}`})}>
                                <MenuItem value={"ALL"}>Show All</MenuItem>
                                <MenuItem value={"Positive"}>Show Positive Only</MenuItem>
                                <MenuItem value={"Negative"}>Show Negative Only</MenuItem>
                        </Select>
                        <p></p>
                        <FormLabel component="legend">Processed By:</FormLabel>
                        <form noValidate>
                            <TextField
                                type="string"
                                onChange={(event) => this.setState({processed_by: `${event.target.value}`})}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>
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
                                pool_status: 'ALL',
                                start_date: new Date(0),
                                end_date: new Date(0),
                            }, () => this.loadViewPools());
                        }}>
                            Reset
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained" color="primary" onClick={() => this.loadViewPools()}>
                            Filter
                        </Button>
                    </Grid>
                </Grid>
                {error ?? <p className={'error'}>{error}</p>}
            </Grid>
        );
    }
}

type ViewPoolsState = {
    loading: boolean,
    error: string,
    pool_status: string,
    start_date: Date,
    end_date: Date,
    processed_by: string,
    pools: pool[]
}

type pool = {
    pool_id: string,
    pool_link: string,
    test_ids: string,
    date_processed: string,
    processed_by: string,
    pool_status: string
}

type ViewPoolsProps = {
    user: user
}

export default ViewPools;
