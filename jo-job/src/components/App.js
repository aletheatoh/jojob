import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Add from './LogTab/Add'
import Update from './LogTab/Update'
import Delete from './LogTab/Delete';

import styled from 'styled-components';
import Tabs, { Tab } from 'material-ui/Tabs';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';

import LogTab from './LogTab/LogTab';
import StorageUnitTab from './StorageUnitTab/StorageUnitTab';
import RentalTruckTab from './RentalTruckTab/RentalTruckTab';
import LayoutPlanTab from './LayoutPlanTab/LayoutPlanTab';

import List, { ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText} from 'material-ui/List';

import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter } from 'material-ui/Table';

const HomePageWrapper = styled.main`
  font-family: 'Alegreya Sans SC', sans-serif;
`;

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3}}>
    {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
   flexGrow: 1,
   height: 430,
   zIndex: 1,
   overflow: 'hidden',
   position: 'relative',
   display: 'flex',
 },
  tabsIndicator: {
    backgroundColor: '#EF5350',
  },
  tabRoot: {
    display: 'block',
    marginRight: theme.spacing.unit * 3,
    '&:hover': {
      color: '#FF6F00',
      opacity: 1,
    },
    '&$tabSelected': {
      color: '#FF6F00'
    },
    '&:focus': {
      color: '#FF6F00',
    },
    color: '#212121',
    opacity: 1
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  tabSelected: {},
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  toolbar: theme.mixins.toolbar,
});

class App extends React.Component {

  constructor() {
    super();
    this.state = {value: 'one'};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, value) {
    this.setState({ value });
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <HomePageWrapper>
      <div>
      <AppBar position="static" style={{backgroundColor: '#795548'}}>
      <Tabs style={{fontSize: 18}} centered value={value} onChange={this.handleChange} classes={{ indicator: classes.tabsIndicator }}>
      <Tab value='one' label="Bookkeeping" classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
      <Tab value='two' label="Storage Unit" classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
      <Tab value='three' label="Rental Truck" classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
      <Tab value='four' label="Layout Planning" classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
      </Tabs>
      </AppBar>
      {value === 'one' && <TabContainer><LogTab/></TabContainer>}
      {value === 'two' && <TabContainer><StorageUnitTab/></TabContainer>}
      {value === 'three' && <TabContainer><RentalTruckTab/></TabContainer>}
      {value === 'four' && <TabContainer><LayoutPlanTab/></TabContainer>}
      </div>
      </HomePageWrapper>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
