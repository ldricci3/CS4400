import React from 'react';
import {user, userType, testingSite} from '../utils';
import { Link, Redirect } from 'react-router-dom';
import {Promise} from "bluebird";
import Grid from '@material-ui/core/Grid';
import Select from "@material-ui/core/Select";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { green } from '@material-ui/core/colors';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from "@material-ui/core/FormControl";
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import { MDBDataTable } from 'mdbreact';
var _ = require('lodash');


class ReassignTester extends React.Component<reassignTesterProps, reassignTesterState> {
    constructor(props: reassignTesterProps) {
        super(props);

        this.state = {
            loading: false,
            error: '',
            allSites: [],
            testers: [],
            originalTesters: []
        }
    }

    componentDidMount() {
        this.loadTesters();
        this.loadTestingSites();
    }
 
    loadTesters() {
        const path = `http://localhost:8080/view_testers?`;

        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                console.log(result);

                let testers: tester[] = [];

                result.result.forEach((e: any) => {
                    testers.push({
                        fullName: e.name,
                        username: e.username,
                        phoneNumber: e.phone_number,
                        sites: e.assigned_sites === null ? [] : e.assigned_sites.split(","),
                        selectedNewSite: ''
                    })
                })

                this.setState({testers: testers, originalTesters: _.cloneDeep(testers)})
            })
            .catch((err) => this.setState({error: err}))
    }

    loadTestingSites() {
        const path = `http://localhost:8080/get_testing_sites`;

        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                this.setState({allSites: result.result})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    selectSite(siteName: string, username: string) {
        let testers: tester[] = _.cloneDeep(this.state.testers);
        const index = testers.findIndex((t) => t.username === username);
        testers[index].selectedNewSite = siteName;
        this.setState({testers: testers});
    }

    addSite(username: string) {
        let testers: tester[] = _.cloneDeep(this.state.testers);
        const index = testers.findIndex((t) => t.username === username);
        testers[index].sites.push(testers[index].selectedNewSite);
        testers[index].selectedNewSite = '';
        this.setState({testers: testers});
    }

    removeSite(siteName: string, username: string) {
        let testers: tester[] = _.cloneDeep(this.state.testers);
        const index = testers.findIndex((t) => t.username === username);
        testers[index].sites = testers[index].sites.filter((s) => s !== siteName);
        this.setState({testers: testers});
    }

    areSitesChanged(testers: tester[], originalTesters: tester[]) {
        for (let i = 0; i < testers.length; i++) {
            if (JSON.stringify(testers[i].sites) !== JSON.stringify(originalTesters[i].sites)) {
                return true;
            }
        }

        return false;
    }

    updateAssignedSites(testers: tester[], originalTesters: tester[]) {
        let paths: string[] = [];

        for (let i: number = 0; i < testers.length; i++) {
            const addedSites: string[] = testers[i].sites.filter((e) => !originalTesters[i].sites.includes(e));
            const removedSites: string[] = originalTesters[i].sites.filter((e) => !testers[i].sites.includes(e));
            
            addedSites.forEach((site: string) => paths.push(`http://localhost:8080/assign_tester?'${testers[i].username}','${site}'`));
            removedSites.forEach((site: string) => paths.push(`http://localhost:8080/unassign_tester?'${testers[i].username}','${site}'`));
        }
        
        Promise.map(paths, (path: string) => {
            return fetch(path)
        })
        .then((results: any[]) => {
            results.forEach((result) => {
                result.json().then((result: any) => {
                    if (result.code === 'ER_SIGNAL_EXCEPTION') {
                        const user = result.sql.substring(41).split("'")[0];
                        const location = result.sql.substring(41).split("'")[2];
                        if (result.sqlMessage === 'This tester is the only one at this site') {
                            alert(`Cannot remove ${user} from ${location} because ${user} is the only tester currently assigned to ${location}`);
                        } else if (result.sqlMessage === 'There are too many tests at this location to remove this tester') {
                            alert(`There are too many tests at ${location} to remove ${user}`);
                        }
                    }
                });
            });
            
            this.loadTesters();
        })
    }

    render() {
        const {
            loading,
            error,
            testers,
            originalTesters,
            allSites } = this.state;

        console.log(this.state);

        if (this.props.user.role !== userType.ADMIN) {
            return (<Redirect to='/home'/>);
        }

        let newTesters: tester[] = [];
        testers.forEach((t) => newTesters.push({
            username: t.username,
            fullName: t.fullName,
            phoneNumber: t.phoneNumber,
            sites: t.sites,
            selectedNewSite: t.selectedNewSite
        }))

        let rows: any[] = [];

        testers.forEach((e: tester) => {
            rows.push({
                username: e.username,
                fullName: e.fullName,
                phoneNumber: e.phoneNumber,
                sites: <List component="nav" disablePadding>
                            {e.sites.map((site: string) => (
                                <ListItem key={site}>
                                    <ListItemText primary={site} />
                                    <Tooltip title={"Remove " + site}>
                                        <IconButton color="secondary" onClick={() => this.removeSite(site, e.username)}>
                                            <HighlightOffIcon />
                                        </IconButton>
                                    </Tooltip>
                                </ListItem>
                            ))}
                            {e.sites.length === 0 && <ListItem><ListItemText primary={"Unassigned"}/></ListItem>}
                            <Divider/>
                            <ListItem>
                                <FormControl className={'formControl'} fullWidth>
                                    <InputLabel id="housing-type-label">New Site</InputLabel>
                                    <Select
                                        labelId="housing-type-label"
                                        required
                                        value={e.selectedNewSite}
                                        onChange={(event) => this.selectSite(`${event.target.value}`, e.username)}>
                                        {allSites.filter((site) => !e.sites.includes(site.site_name)).map((e: testingSite) => (
                                            <MenuItem value={e.site_name} key={e.site_name}>
                                                {e.site_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Tooltip title={"Add " + e.selectedNewSite}>
                                    <IconButton 
                                        style={{ color: green[500] }} 
                                        disabled={e.selectedNewSite === ''}
                                        onClick={() => this.addSite(e.username)}>
                                        <AddCircleOutlineIcon />
                                    </IconButton>
                                </Tooltip>
                            </ListItem>
                        </List>
            })
        })

        const data = {
            columns: [
                {
                    label: 'Username',
                    field: 'username',
                    width: 150
                },
                {
                    label: 'Name',
                    field: 'fullName',
                    width: 150
                },
                {
                    label: 'Phone Number',
                    field: 'phoneNumber',
                    width: 150
                },
                {
                    label: 'Assigned Sites',
                    field: 'sites',
                    width: 150
                },
            ],
            rows: rows
        }

        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'pageTitle'}>Reassign Testers</h1>
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

                <Grid container item xs={10} justify={"space-between"}>
                    <Grid item>
                        <Link to="/home">
                            <Button variant="contained" color="primary">
                                Back (Home)
                            </Button>
                        </Link>
                    </Grid>

                    <Grid item>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => this.updateAssignedSites(testers, originalTesters)} 
                            disabled={!this.areSitesChanged(testers, originalTesters)}>
                            Update
                        </Button>
                    </Grid>
                </Grid>
                
                {error && <p className={error}>{error}</p>}
            </Grid>
        );
    }

}

type reassignTesterState = {
    loading: boolean,
    error: string,
    allSites: testingSite[],
    testers: tester[]
    originalTesters: tester[]
}

type reassignTesterProps = {
    user: user
}

type tester = {
    username: string,
    fullName: string,
    phoneNumber: string,
    sites: string[],
    selectedNewSite: string
}

export default ReassignTester;