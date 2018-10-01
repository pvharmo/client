import React from 'react';
import { Router, Route, Switch, NavLink } from "react-router-dom";
import { createBrowserHistory } from "history";
import { socket } from './socket';

import Membres from "./components/membres/Membres.jsx";
import Depannages from "./components/depannages/Depannages.jsx";
import Admin from "./components/admin/Admin.jsx";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Drawer from '@material-ui/core/Drawer';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Gavel from '@material-ui/icons/Gavel';
import People from '@material-ui/icons/People';
import Dashboard from '@material-ui/icons/Dashboard';
import SettingsSharp from '@material-ui/icons/SettingsSharp';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const hist = createBrowserHistory();
const drawerWidth = 230;

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  appbar: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  },
  drawerStyle: {
    width: drawerWidth,
  },
  mainContainer: {
    marginLeft: drawerWidth + 16,
    marginRight: 16,
    marginTop: 21
  }
};

class App extends React.Component {
  constructor() {
    super();

    socket.on("loggedIn", ()=>{this.setState({login: false});});
    socket.on("loggin-error", ()=>{this.setState({loginError: true});});

    this.state = {
      auth: true,
      anchorEl: null,
      loginError: false,
      login: true,
      password: ""
    };
  }

  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handlePassword = (event) => {
    this.setState({password: event.target.value});
  };

  login() {
    socket.emit('authentication', {password: this.state.password});
  }

  render() {
    const { classes } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <Router history={hist}>
        <div className={classes.root}>
          <Dialog
            open={this.state.login}
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            >
            <DialogTitle id="confirmation-dialog-title">Connexion</DialogTitle>
            <DialogContent>
              {this.state.loginError && "Une erreur s'est produite"}
              <TextField type="password" onChange={this.handlePassword.bind(this)} />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.login.bind(this)} color="primary">
                Se connecter
              </Button>
            </DialogActions>
          </Dialog>
          <AppBar position="static"
            className={classes.appbar}>
            <Toolbar>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton>
              <div className={classes.flex}></div>
              {auth && (
                <div>
                  <IconButton
                    aria-owns={open ? 'menu-appbar' : null}
                    aria-haspopup="true"
                    onClick={this.handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={this.handleClose}
                  >
                    <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                    <MenuItem onClick={this.handleClose}>My account</MenuItem>
                  </Menu>
                </div>
              )}
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" classes={{paper: classes.drawerStyle}}>
            <List
              component="nav"
              subheader={<ListSubheader component="div">Menu</ListSubheader>}>
              <a target="_blank" href="http://172.104.213.198:8080/" rel="noreferrer noopener">
                <ListItem button>
                  <ListItemIcon>
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText inset primary="Tableau de bord" />
                </ListItem>
              </a>
              <NavLink to="/membres">
                <ListItem button>
                  <ListItemIcon>
                    <People />
                  </ListItemIcon>
                  <ListItemText inset primary="Membres" />
                </ListItem>
              </NavLink>
              <NavLink to="/depannages">
                <ListItem button>
                  <ListItemIcon>
                    <Gavel />
                  </ListItemIcon>
                  <ListItemText inset primary="Dépannages" />
                </ListItem>
              </NavLink>
              <NavLink to="/administration">
                <ListItem button>
                  <ListItemIcon>
                    <SettingsSharp />
                  </ListItemIcon>
                  <ListItemText inset primary="Administration" />
                </ListItem>
              </NavLink>
            </List>
          </Drawer>
          <div className={classes.mainContainer} >
            <Switch>
              <Route path="/membres" component={Membres} />
              <Route path="/depannages" component={Depannages} />
              <Route path="/administration" component={Admin} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default withStyles(styles)(App);
