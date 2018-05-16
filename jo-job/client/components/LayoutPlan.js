import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import Button from 'material-ui/Button';

import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter } from 'material-ui/Table';

import List, { ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText} from 'material-ui/List';

import StorageDnD from './StorageDnD';

const styles = theme => ({
  list: {
    fontWeight: 'bold'
  }
});

class LayoutPlan extends React.Component  {

  constructor() {
    super();
    this.state = {data: [], cost: []};
    this.getData = this.getData.bind(this);
    this.getCost = this.getCost.bind(this);
  }

  componentDidMount() {
    this.getData(this);
    this.getCost(this);
    console.log('received props')
  }

  componentWillReceiveProps(nextProps) {
    this.getData(this);
    this.getCost(this);
    console.log('receiving props again')
  }

  getData(ev){
    axios.get('/getAll')
    .then(function(response) {
      console.log(response.data)
      ev.setState({data: response.data});
    });
  }

  getCost(ev){
    axios.get('/getCost')
    .then(function(response) {
      ev.setState({cost: response.data});
    });
  }

  render() {

    const { classes } = this.props;

    const ListContainer = this.state.data ? (
      this.state.data.map((log, index) => {

        return (
          <ListItem>
          <ListItemText
          primary={log.name}
          />
          <ListItemSecondaryAction>
          <ListItemText
          primary={log.boxes}
          className={classes.list}
          />
          </ListItemSecondaryAction>
          </ListItem>
        )
      })
    ) : (
      <ListItem>
      <ListItemText
      primary="There are no entries"
      />
      </ListItem>
    );

    return (
      <div>
      <div style={{textAlign: 'center', width: 280}}>
      <List>
      <ListItem>
      <ListItemText
      primary="No. of Boxes"
      className={classes.list}
      />
      </ListItem>
      {ListContainer}
      </List>
      </div>
      <StorageDnD logs={this.state.data}/>
      </div>
    );
  }
}

LayoutPlan.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LayoutPlan);
