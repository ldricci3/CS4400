import React from 'react';
import { Link } from 'react-router-dom';
import {user } from '../utils';
import './ViewDailyResults.css';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { MDBDataTable } from 'mdbreact';

class ViewDailyResults extends React.Component<viewDailyResultsProps, viewDailyResultsStates> {
    constructor(props: viewDailyResultsProps) {
        super(props);
        this.state = {
            // loading: false,
            // error: '',
            dailyResults: []
        };
    }

    componentDidMount() {
        this.loadDailyResults();
    }

    loadDailyResults() {
        const path = `http://localhost:8080/daily_results?`;
    
        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                let temp: dailyResult[] = [];
                result.result.forEach((e: any) => {
                    let dr: dailyResult = e;
                    dr.result_date = dr.result_date.substring(0,10);
                    dr.positive_percent = e.positive_percent + '%';
                    temp.push(dr);
                })
                this.setState({dailyResults: temp})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        const {
            // loading,
            // error,
            dailyResults } = this.state;

        const data = {
            columns: [
                {
                    label: 'Date',
                    field: 'result_date',
                    width: 150
                },
                {
                    label: 'Tests Processed',
                    field: 'tests_processed',
                    width: 150
                },
                {
                    label: 'Positive Count',
                    field: 'positive_count',
                    width: 150
                },
                {
                    label: 'Positive Percent',
                    field: 'positive_percent',
                    width: 150
                }
            ],
            rows: dailyResults
        }

        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'pageTitle'}>View Daily Results</h1>
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
                </Grid>
            </Grid>
        );
    }

}

type viewDailyResultsStates = {
    // loading: boolean,
    // error: string,
    dailyResults: dailyResult[]
}

type dailyResult = {
    result_date: string,
    tests_processed : number,
    positive_count: number,
    positive_percent: string
}

type viewDailyResultsProps = {
    user: user
}

export default ViewDailyResults;