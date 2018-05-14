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
    backgroundColor: '#F5F5F5',
  },
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
      <div className={classes.root}>
      <AppBar position="static" style={{backgroundColor: '#F5F5F5'}}>
      <Tabs centered value={value} onChange={this.handleChange} style={{color: 'black'}}>
      <Tab value='one' label="Log" />
      <Tab value='two' label="Storage Unit" />
      <Tab value='three' label="Rental Truck" />
      </Tabs>
      </AppBar>
      {value === 'one' && <TabContainer><LogTab/></TabContainer>}
      {value === 'two' && <TabContainer><StorageUnitTab/></TabContainer>}
      {value === 'three' && <TabContainer>Rental Truck</TabContainer>}
      </div>
      </HomePageWrapper>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
