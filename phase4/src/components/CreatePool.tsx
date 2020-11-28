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

class CreatePool extends React.Component<createPoolProps, createPoolState> {
    constructor(props: createPoolProps) {
        super(props);

        this.state = {
            //loading: false,
            //error: '',
            poolID: 0,
            tests: [],
            selectedTests: []
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
                let temp: test[] = [];
                result.result.forEach((e: any) => {
                    let tr: test = e;
                    tr.date_tested = e.date_tested.substring(0,10);
                    temp.push(tr);
                })
                this.setState({tests: temp})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    createPool() {
        const {poolID, selectedTests} = this.state;
        let temp: number[] = [];
        selectedTests.forEach(e => temp.push(e.test_id));
        const path = `http://localhost:8080/create_pool?${poolID},${temp[0]}`;

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

        for (var i = 1; i < temp.length; i++) {
        const path = `http://localhost:8080/assign_test_to_pool?${poolID},${temp[i]}`;

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

    }

    render() {
        const {
            //loading,
            //error,
            poolID,
            tests,
            selectedTests } = this.state;

        let rows: any[] = [];
        let temp: test[] = [];
        tests.forEach((t: test) => {
            rows.push({
                test_id: t.test_id,
                date_tested: t.date_tested,
                radio: <Radio
                    // this is the part that needs fixing.  must allow multiple checked boxes
                    checked={selectedTests[0].test_id + selectedTests[0].date_tested === t.test_id + t.date_tested}
                    onChange={(event) =>
                    temp.push(t)}/>
            })
            this.setState({selectedTests: temp});
        })

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
                    field: 'radio',
                    width: 150
                }
            ],
            rows: tests
        }
        //console.log(this.state);

        /**
         * Redirects the user to the home page if they do not have permissions to be on the page
         */
        if (!this.props.user.isLabTech) { //this.props.user.role !== userType.ADMIN && !this.props.user.isSiteTester) {
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

                <Grid container item xs={10} spacing={2}>
                    <Grid item xs={8}>
                        <Link to="/home">
                            <Button variant="contained" color="primary">
                                Back (Home)
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained" color="primary" onClick={() => this.createPool()}>
                            Create
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

}

type createPoolState = {
    // loading: boolean,
    // error: string,
    poolID: number,
    tests: test[],
    selectedTests: test[]
}

type test = {
    test_id: number,
    date_tested: string
}
const emptyTest = {
    test_id: 0,
    date_tested: ''
}

type createPoolProps = {
    user: user
}

export default CreatePool;