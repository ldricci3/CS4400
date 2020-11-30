import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {user, userType, testingSite} from '../utils';
import './ViewAppointments.css';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { MDBDataTable } from 'mdbreact';
import Checkbox from '@material-ui/core/Checkbox';
import {Promise} from "bluebird";
var _ = require('lodash');


class CreatePool extends React.Component<createPoolProps, createPoolState> {
    constructor(props: createPoolProps) {
        super(props);

        this.state = {
            loading: false,
            error: '',
            poolID: 0,
            tests: [],
            numSelected: 0
        };
    }

    componentDidMount() {
        this.loadTests();
    }

    loadTests() {
        const path = `http://localhost:8080/get_unpooled_tests`;

        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                console.log(result.result);
                let temp0: test[] = [];
                result.result.forEach((e: any) => temp0.push({test_id: e.test_id ,date_tested: e.date_tested.substring(0,10), selected: false}));
                this.setState({tests: temp0});
            })
            .catch((error) => {
                console.log(error);
            })
    }

    createPool() {
        const {poolID, tests} = this.state;

        let temp: number[] = [];

        tests.forEach((test) => test.selected && temp.push(test.test_id));

        const path = `http://localhost:8080/create_pool?${poolID},${temp.pop()}`;

        fetch(path).then((res) => res.json())
            .then((res) => {
                console.log(res);
                if (res.Success) {
                    console.log("Successfully Created");

                    let paths: string[] = [];
                    temp.forEach((test_id: number) => paths.push(`http://localhost:8080/assign_test_to_pool?${poolID},${test_id}`))

                    Promise.map(paths, (path: string) => {
                        return fetch(path)
                    })
                    .then((results: any[]) => {
                        this.loadTests();
                    })
                } else if (res.sqlMessage === "This Pool ID Already Exists") {
                    alert("This pool ID already exists, please select a new pool ID");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        const { poolID, tests, numSelected } = this.state;
        console.log(this.state);
        let rows: any[] = [];

        tests.forEach((test) => rows.push({
            test_id: test.test_id,
            date_tested: test.date_tested,
            selected: <Checkbox
                        checked={test.selected}
                        color="primary"
                        disabled={numSelected >= 7}
                        onClick={() => {
                            if (!test.selected || numSelected < 7) {
                                let copy: test[] = _.cloneDeep(tests);
                                copy[copy.findIndex((e: test) => e.test_id === test.test_id)].selected = !test.selected;
                                this.setState({tests: copy, numSelected: test.selected ? numSelected - 1 : numSelected + 1});
                            }
                        }}/>
        }))

        const data = {
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
                    label: 'Include in Pool',
                    field: 'selected',
                    width: 150
                }
            ],
            rows: rows
        }

        // /**
        //  * Redirects the user to the home page if they do not have permissions to be on the page
        //  */
        if (!this.props.user.isLabTech) {
            return (<Redirect to={'/home'}></Redirect>)
        }

        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'pageTitle'}>Create a Pool</h1>
                </Grid>
                <Grid container item xs={10} justify={'space-between'}>
                    <Grid item>
                        <FormLabel component="legend">Pool ID</FormLabel>
                        <form noValidate>
                            <TextField
                                type="number"
                                error={poolID < 0}
                                value={poolID}
                                className={"poolID-picker"}
                                onChange={(event) => this.setState({poolID: event.target.value === '' ? 0 : parseInt(event.target.value)})}
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

                <Grid container item xs={10} spacing={2} justify={'space-between'}>
                    <Grid item>
                        <Link to="/home">
                            <Button variant="contained" color="primary">
                                Back (Home)
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" disabled={numSelected === 0 || poolID <= 0} onClick={() => this.createPool()}>
                            Create
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

}

type createPoolState = {
    loading: boolean,
    error: string,
    poolID: number,
    tests: test[],
    numSelected: number
}

type test = {
    test_id: number,
    date_tested: string,
    selected: boolean
}
const emptyTest = {
    test_id: 0,
    date_tested: ''
}

type createPoolProps = {
    user: user
}

export default CreatePool;
