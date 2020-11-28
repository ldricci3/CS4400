import React from 'react';
import { Link } from 'react-router-dom';
import {user } from '../utils';
// import './ViewDailyResults.css';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { MDBDataTable } from 'mdbreact';

class ExplorePoolResult extends React.Component<ExplorePoolResultProps, ExplorePoolResultStates> {
    constructor(props: ExplorePoolResultProps) {
        super(props);
        this.state = {
            // loading: false,
            // error: '',
            poolID: parseInt(window.location.href.substring(window.location.href.indexOf('?') + 1)),
            // poolResults: [],
            pool_data: [],
            tests: []
        };
    }

    componentDidMount() {
        this.loadPoolResults();
        this.loadTests();
    }

    loadPoolResults() {
        const path = `http://localhost:8080/pool_metadata?${this.state.poolID}`;
        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                console.log(result.result);
                let temp: poolResult[] = [];
                result.result.forEach((e: any) => {
                    let pr: poolResult = e;
                    pr.date_processed = pr.date_processed.substring(0,10);
                    temp.push(pr);
                    // my brute forcing the Pool Metadata.  Sorry I am bad at web design
                    let temp2: pool_datum[] = [];
                    temp2.push({"label":"Date Processed", "datum": e.date_processed},
                    {"label":"Pooled Result", "datum": e.pooled_result},
                    {"label":"Processed by", "datum": e.processed_by});
                    this.setState({pool_data: temp2});
                })
                // this.setState({poolResults: temp})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    loadTests() {
        const path = `http://localhost:8080/tests_in_pool?${this.state.poolID}`;

        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                console.log(result.result);
                let temp: test[] = [];
                result.result.forEach((e: any) => {
                    let tr: test = e;
                    tr.date_tested = tr.date_tested.substring(0,10);
                    temp.push(tr);
                })
                console.log(temp);
                this.setState({tests: temp})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        const {
            // loading,
            // error,
            poolID,
            //poolResults,
            pool_data,
            tests } = this.state;

        // This was non-brute force method, but I don't MDBDataTable works this way...
        /* const poolData = {
            rows: [
                {
                    label: 'Pool ID',
                    field: 'pool_id',
                    width: 150
                },
                {
                    label: 'Date Processed',
                    field: 'date_processed',
                    width: 150
                },
                {
                    label: 'Pooled Result',
                    field: 'pooled_result',
                    width: 150
                },
                {
                    label: 'Processed By',
                    field: 'processd_by',
                    width: 150
                }
            ],
            columns: poolResults
        } */

        const poolData = {
            columns: [
                {
                    label: 'Pool ID',
                    field: 'label',
                    width: 150
                },
                {
                    label: poolID.toString(),
                    field: 'datum',
                    width: 150
                }
            ],
            rows: pool_data
        }


        const testData = {
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
                    label: 'Testing Site',
                    field: 'testing_site',
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

        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'pageTitle'}>Explore Pool Results</h1>
                </Grid>

                <Grid item xs={10}>
                    <h4 className={'tableTitle'}>Pool Metadata</h4>
                    <MDBDataTable
                        striped
                        bordered
                        sortable={false}
                        small
                        data={poolData}
                        />
                </Grid>

                <Grid item xs={10}>
                    <h4 className={'tableTitle'}>Tests in Pool</h4>
                    <MDBDataTable
                        striped
                        bordered
                        sortable={true}
                        small
                        data={testData}
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

type ExplorePoolResultStates = {
    // loading: boolean,
    // error: string,
    poolID: number,
    //poolResults: poolResult[],
    pool_data: pool_datum[],
    tests: test[]
}

type poolResult = {
    pool_id: number,
    date_processed : string,
    pooled_result: string,
    processed_by: string
}

type pool_datum = {
    label: string,
    datum: string
}

type test = {
    test_id: number,
    date_tested: string,
    testing_site: string,
    test_result: string
}

type ExplorePoolResultProps = {
    user: user
}

export default ExplorePoolResult;