import React from 'react';
import {user, userType, testingSite, defaultUser} from '../utils';
import { Link, Redirect } from 'react-router-dom';
import {Promise} from "bluebird";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
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
import './TesterChangeSite.css';
import { Divider } from '@material-ui/core';

class TesterChangeSite extends React.Component<testerChangeSiteProps, testerChangeSiteState> {
    constructor(props: testerChangeSiteProps) {
        super(props);

        this.state = {
            loading: false,
            error: '',
            assignedSites: [],
            originalAssignedSites: [],
            allSites: [],
            selectedNewSite: ''
        }
    }

    componentDidMount() {
        this.loadAssignedSites();
        this.loadTestingSites();
    }

    loadAssignedSites() {
        const path = `http://localhost:8080/tester_assigned_sites?'${this.props.user.username}'`;

        fetch(path)
            .then((res) => res.json())
            .then((result) => {
                const sites: string[] = [];
                result.result.forEach((e: any) => sites.push(e.site_name))

                this.setState({assignedSites: sites, originalAssignedSites: sites});
            })
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

    updateAssignedSites(oldSites: string[], newSites: string[]) {
        const addedSites: string[] = newSites.filter((e) => !oldSites.includes(e));
        const removedSites: string[] = oldSites.filter((e) => !newSites.includes(e));

        let paths: string[] = [];
        addedSites.forEach((site: string) => paths.push(`http://localhost:8080/assign_tester?'${this.props.user.username}','${site}'`));
        removedSites.forEach((site: string) => paths.push(`http://localhost:8080/unassign_tester?'${this.props.user.username}','${site}'`));

        Promise.map(paths, (path: string) => {
            return fetch(path)
        })
        .then((results: any[]) => {
            this.loadAssignedSites();
        })
    }

    render() {
        const {
            loading,
            error,
            originalAssignedSites,
            assignedSites,
            selectedNewSite,
            allSites } = this.state;

        console.log(this.state);

        const unassignedSites: testingSite[] = allSites.filter((e) => !assignedSites.includes(e.site_name));

        if (this.props.user.username === defaultUser.username || (this.props.user.role !== userType.ADMIN && !this.props.user.isSiteTester)) {
            return (<Redirect to={'/home'}></Redirect>)
        }

        return (
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12}>
                    <h1 className={'pageTitle'}>Tester Change Testing Site</h1>
                </Grid>

                <Paper elevation={1}>
                    <Grid container item xs={12} className={'testerChangeSitePaper'}>
                        <Grid item xs={12}>
                            <h4>Username: {this.props.user.username}</h4>
                            <h4>Full Name: {this.props.user.firstName} {this.props.user.lastName} </h4>
                        </Grid>
                        <Grid item xs={6}>
                            <h4>Assigned Sites:</h4>
                        </Grid>
                        <Grid item xs={6} className={"sitesListContainer"}>
                            <List component="nav" disablePadding>
                                {assignedSites.map((site: string) => (
                                    <ListItem key={site}>
                                        <ListItemText primary={site} />
                                        <Tooltip title={"Remove " + site}>
                                            <IconButton color="secondary" onClick={() => this.setState({assignedSites: assignedSites.filter((e) => e != site)})}>
                                                <HighlightOffIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </ListItem>
                                ))}
                                {assignedSites.length === 0 && <ListItem><ListItemText primary={"Unassigned"}/></ListItem>}
                                <Divider/>
                                <ListItem>
                                    <FormControl className={'formControl'} fullWidth>
                                        <InputLabel id="housing-type-label">New Site</InputLabel>
                                        <Select
                                            labelId="housing-type-label"
                                            required
                                            value={selectedNewSite}
                                            onChange={(event) => this.setState({selectedNewSite: `${event.target.value}`})}>
                                            {unassignedSites.map((e: testingSite) => (
                                                <MenuItem value={e.site_name} key={e.site_name}>
                                                    {e.site_name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Tooltip title={"Add " + selectedNewSite}>
                                        <IconButton 
                                            style={{ color: green[500] }} 
                                            disabled={selectedNewSite === ''}
                                            onClick={() => this.setState({assignedSites: assignedSites.concat(selectedNewSite), selectedNewSite: ''})}>
                                            <AddCircleOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </Paper>
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
                            onClick={() => this.updateAssignedSites(originalAssignedSites, assignedSites)} 
                            disabled={JSON.stringify(originalAssignedSites)==JSON.stringify(assignedSites)}>
                            Update
                        </Button>
                    </Grid>
                </Grid>
                
                {error && <p className={error}>{error}</p>}
            </Grid>
        );
    }
}

type testerChangeSiteState = {
    loading: boolean,
    error: string,
    originalAssignedSites: string[],
    assignedSites: string[],
    allSites: testingSite[],
    selectedNewSite: string
}

type testerChangeSiteProps = {
    user: user
}

export default TesterChangeSite;