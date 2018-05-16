import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Add from './Add'
import Update from './Update'
import Delete from './Delete';

import styled from 'styled-components';
import Tabs, { Tab } from 'material-ui/Tabs';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';

import LogTab from './LogTab';
import StorageUnitTab from './StorageUnitTab';
import RentalTruckTab from './RentalTruckTab';
import LayoutPlan from './LayoutPlan';

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
  tabsIndicator: {
    backgroundColor: 'red',
  },
  tabRoot: {
    marginRight: theme.spacing.unit * 3,
    '&:hover': {
      color: '#FF6D00',
      opacity: 1,
    },
    '&$tabSelected': {
      color: '#FF6D00'
    },
    '&:focus': {
      color: '#FF6D00',
    },
    color: '#212121',
    opacity: 1
  },
  tabSelected: {},
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
      <AppBar position="static" style={{backgroundColor: 'rgba(255, 251, 151, 0.70)'}}>
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
      {value === 'four' && <TabContainer><LayoutPlan/></TabContainer>}
      </div>
      </HomePageWrapper>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
