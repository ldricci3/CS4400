import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {user, userType, testingSite, states} from '../utils';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { MDBDataTable } from 'mdbreact';
import { parse } from 'url';

class CreateTestingSite extends React.Component<createTestingSiteProps, createTestingSiteState> {
    constructor(props: createTestingSiteProps) {
        super(props);

        this.state = {
            loading: false,
            error: '',
            success: '',
            site_name: '',
            street_address: '',
            city: '',
            site_state: '',
            zip_code: '',
            location: '',
            locations: [],
            site_tester: '',
            testers: []
        };
    }

    componentDidMount() {
        this.loadTesters();
        this.loadLocations();
    }

    loadTesters() {
        const path = `http://localhost:8080/view_testers`

        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                console.log(result.result);
                let temp: tester[] = [];
                result.result.forEach((e: any) => {
                    let tr: tester = {
                        username: e.username,
                        name: e.name
                    };
                    temp.push(tr);
                })
                this.setState({testers: temp})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    loadLocations() {
        const path = `http://localhost:8080/get_locations`

        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                let temp: location[] = [];
                result.result.forEach((e: any) => {
                    let loc: location = e;
                    temp.push(loc);
                })
                this.setState({locations: temp})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    create_testing_site() {
        const {site_name, street_address, city, site_state, zip_code, location, site_tester} = this.state;

        const path = `http://localhost:8080/create_testing_site?'${site_name}','${street_address}','${city}','${site_state}','${zip_code}','${location}','${site_tester}'`;
        //console.log(path);
        if (site_name != '' && street_address != '' &&  city != '' && site_state != '' && zip_code != '' && location != '' && site_tester != '') {
            fetch(path).then((res) => res.json())
                .then((res) => {
                    console.log(res);
                    if (res.Success) {
                        console.log("Successfully Created");
                    }
                    this.setState({success: '- Testing Site Created Successfully'});
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({success: '- Testing Site Creation Failed'});
                });
        } else{
            this.setState({success: '- Please fill in all values'});
        }
    }

    render() {
        const {
            loading,
            error,
            success,
            site_name,
            street_address,
            city,
            site_state,
            zip_code,
            location,
            locations,
            site_tester,
            testers } = this.state;

        console.log(this.state);

        /**
         * Redirects the user to the home page if they do not have permissions to be on the page
         */
        if (this.props.user.role !== userType.ADMIN) {
            return (<Redirect to={'/home'}></Redirect>)
        }

        // fix location select
        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'pageTitle'}>Create Testing Site {success}</h1>
                </Grid>
                <Grid container item xs={10} justify={'space-between'} alignItems={"baseline"}>
                    <Grid item xs={4} >
                        <FormLabel component="legend">Site Name</FormLabel>
                    </Grid>
                    <Grid item xs={7} justify={'flex-end'}>
                        <form noValidate>
                            <TextField
                                type="string"
                                value={site_name}
                                className="site_name-label"
                                required
                                variant="outlined"
                                size="small"
                                onChange={(event) => this.setState({site_name: `${event.target.value}`})}
                                InputLabelProps={{shrink: true,}}
                                />
                        </form>
                    </Grid>
                </Grid>
                <Grid container item xs={10} justify={'space-between'} alignItems={"baseline"}>
                    <Grid item xs={4}>
                        <FormLabel component="legend">Street Address</FormLabel>
                    </Grid>
                    <Grid item xs={7} justify={'flex-start'}>
                        <form noValidate>
                            <TextField
                                type="string"
                                value={street_address}
                                className="street_address-label"
                                variant="outlined"
                                size="small"
                                required
                                onChange={(event) => this.setState({street_address: `${event.target.value}`})}>
                                InputLabelProps={{ shrink: true}}
                            </TextField>
                        </form>
                    </Grid>
                </Grid>
                <Grid container item xs={10} justify={'space-between'} alignItems={"baseline"}>
                    <Grid item xs={2}>
                        <FormLabel component="legend">City</FormLabel>
                    </Grid>
                    <Grid item>
                        <form noValidate>
                            <TextField
                                type="string"
                                value={city}
                                className="city-label"
                                variant="outlined"
                                size="small"
                                required
                                onChange={(event) => this.setState({city: `${event.target.value}`})}
                                InputLabelProps={{shrink: true}}
                                />
                        </form>
                    </Grid>
                    <Grid item >
                        <FormLabel component="legend">State</FormLabel>
                    </Grid>
                    <Grid item>
                        <Select
                            labelId="site_state-label"
                            required
                            value={site_state}
                            variant="outlined"
                            onChange={(event) => this.setState({site_state: `${event.target.value}`})}>
                                <MenuItem value='GA' key='GA'>GA</MenuItem>
                                {states.map((st: string) => (
                                    <MenuItem value={st} key={st}>{st}</MenuItem>
                                ))}
                        </Select>
                    </Grid>
                </Grid>
                <Grid container item xs={10} justify={'space-between'} alignItems={"baseline"}>
                    <Grid item xs={2}>
                        <FormLabel component="legend">Zip Code</FormLabel>
                    </Grid>
                    <Grid item>
                        <form noValidate>
                            <TextField
                                type="string"
                                value={zip_code}
                                className="zip_code-label"
                                variant="outlined"
                                size="small"
                                required
                                onChange={(event) => this.setState({zip_code: `${event.target.value}`})}
                                InputLabelProps={{shrink: true,}}
                                />
                        </form>
                    </Grid>
                    <Grid item>
                        <FormLabel component="legend">Location</FormLabel>
                    </Grid>
                    <Grid item>
                        <Select
                            labelId="location-label"
                            required
                            variant="outlined"
                            value={location}
                            onChange={(event) => this.setState({location: `${event.target.value}`})}>
                                {locations.map((loc: location) => (
                                    <MenuItem value={loc.location_name} key={loc.location_name}>{loc.location_name}</MenuItem>
                                ))}
                        </Select>
                    </Grid>
                </Grid>
                <Grid container item xs={10} alignContent={'stretch'} alignItems={"baseline"}>
                    <Grid item xs={3}>
                        <FormLabel component="legend">Site Tester</FormLabel>
                    </Grid>
                    <Grid item>
                        <Select
                            labelId="site_tester-label"
                            required
                            variant="outlined"
                            value={site_tester}
                            onChange={(event) => this.setState({site_tester: `${event.target.value}`})}>
                                {testers.map((tes: tester) => (
                                    <MenuItem value={tes.username} key={tes.username}>{tes.name}</MenuItem>
                                ))}
                        </Select>
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
                        <Button variant="contained" color="primary" onClick={() => this.create_testing_site()}>
                            Create
                        </Button>
                    </Grid>
                </Grid>
                {error ?? <p className={'error'}>{error}</p>}
            </Grid>
        );
    }

}

type createTestingSiteState = {
    loading: boolean,
    error: string,
    success: string,
    site_name: string,
    street_address: string,
    city: string,
    site_state: string,
    zip_code: string,
    location: string,
    locations: location[],
    site_tester: string,
    testers: tester[]
}

type appointment = {
    appt_date: string,
    appt_time: string,
    test_site: string,
    location: string,
    username: string
}

type tester = {
    username: string,
    name: string
}

type location = {
    location_name: string
}

const empty_tester = {
    username: '',
    name: '',
}

type createTestingSiteProps = {
    user: user
}

export default CreateTestingSite;