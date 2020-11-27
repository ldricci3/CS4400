import React from 'react';
import { Link } from 'react-router-dom';
import { user, userType } from '../utils';
// import './ViewDailyResults.css';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { MDBDataTable } from 'mdbreact';

class ExploreTestResult extends React.Component<ExploreTestResultProps, ExploreTestResultStates> {
    constructor(props: ExploreTestResultProps) {
        super(props);
        this.state = {
            loading: false,
            error: '',
            testID: parseInt(window.location.href.substring(window.location.href.indexOf('?') + 1)),
            test_data: [],
        };
        // console.log(this.state);
        // console.log(window.location.href.substring(window.location.href.indexOf('?') + 1));
    }

    componentDidMount() {
        this.loadTestResults();
    }

    loadTestResults() {
        const {testID} = this.state;
        const path = `http://localhost:8080/explore_results?${this.state.testID}`;
        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                console.log(result.result);
                let temp: testFullResults[] = [];
                result.result.forEach((e: any) => {
                    let tfr: testFullResults = e;
                    tfr.date_processed = tfr.date_processed.substring(0,10);
                    tfr.test_date = tfr.test_date.substring(0,10);
                    temp.push(tfr);
                })
                this.setState({test_data: temp})
            })
            .catch((error) => {
                console.log(error);
            })
    }


    render() {
        const {
            loading,
            error,
            testID,
            test_data} = this.state;

            const data = {
                columns: [
                    {
                        label: 'Test ID#',
                        field: 'test_id',
                        sort: 'asc',
                        width: 150
                    },
                    {
                        label: 'Date Tested',
                        field: 'test_date',
                        sort: 'asc',
                        width: 150
                    },
                    {
                        label: 'Timeslot',
                        field: 'timeslot',
                        sort: 'asc',
                        width: 150
                    },
                    {
                        label: 'Testing Location',
                        field: 'testing_location',
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
                        label: 'Pooled Result',
                        field: 'pooled_result',
                        sort: 'asc',
                        width: 150
                    },
                    {
                        label: 'Individual Result',
                        field: 'individual_result',
                        sort: 'asc',
                        width: 150
                    },
                    {
                        label: 'Processed By',
                        field: 'processed_by',
                        sort: 'asc',
                        width: 150
                    }
                ],
                rows: test_data
            }

        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'pageTitle'}>Explore Test Results</h1>
                </Grid>

                <Grid item xs={10}>
                    <h4 className={'tableTitle'}>Detailed Test Result</h4>
                    <MDBDataTable
                        striped
                        bordered
                        sortable={false}
                        small
                        data={data}
                        />
                </Grid>

                <Grid container item xs={10} spacing={2}>
                    <Link to="/home">
                        <Button variant="contained" color="primary">
                            Back (Home)
                        </Button>
                    </Link>
                </Grid>
            </Grid>
        );
    }

}

type ExploreTestResultStates = {
    loading: boolean,
    error: string,
    testID: number,
    test_data: testFullResults[]
}


type testFullResults = {
    test_id: number,
    timeslot: string,
    test_date: string,
    date_processed: string,
    testing_location: string,
    pooled_result: string,
    individual_result: string,
    processed_by: string
}

type ExploreTestResultProps = {
    user: user
}

export default ExploreTestResult;