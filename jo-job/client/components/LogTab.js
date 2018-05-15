import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Add from './Add'
import Update from './Update'
import Delete from './Delete';

import Button from 'material-ui/Button';

import {CSVLink} from 'react-csv';

import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

const headers = [
  {label: 'Name', key: 'name'},
  {label: 'Boxes', key: 'boxes'},
  {label: 'Move In', key: 'moveIn'},
  {label: 'Move Out', key: 'moveOut'},
];

const styles = theme => ({
  root: {
    width: '80%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 1000,
    maxWidth: 1000,
    textAlign: 'center',
    color: 'black',
    margin: '0 auto'
  },
});

class LogTab extends React.Component  {

  constructor() {
    super();
    this.state = {data: [], cost: []};
    this.getData = this.getData.bind(this);
    this.getCost = this.getCost.bind(this);
  }

  componentDidMount() {
    this.getData(this);
    this.getCost(this);
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
    const { classes, headers } = this.props;

    return (
      <div style={{textAlign: 'center'}}>
      {
        this.state.cost.map(function(item){
          return <div id="total-cost" style={{display: 'inline-block', verticalAlign: 'top', width: 150}}>
          <h4 style={{textAlign: 'center', marginTop: 12, marginBottom: 5, fontSize: 20}}>Total Cost: ${item.total}</h4>
          <div> Storage: ${item.storage}</div>
          </div>
        })
      }
      <div style={{textAlign: 'center', display: 'inline-block'}}>
      <Add/>
      <CSVLink data={this.state.data} headers={headers}>
          Download me
      </CSVLink>
      </div>
      <div style={{textAlign: 'center'}} class="logtab-container">
      <Table className={classes.table} id="table-to-excel">
      <TableHead style={{fontSize: 15, color: 'black'}}>
      <TableRow>
      <TableCell style={{textAlign: 'center'}} className='button-col' ></TableCell>
      <TableCell style={{textAlign: 'center'}} className='desc-col'>Name</TableCell>
      <TableCell style={{textAlign: 'center'}} className='button-col' numeric>Boxes</TableCell>
      <TableCell style={{paddingLeft: 4, paddingRight: 4, textAlign: 'center'}} className='button-col' numeric>Move Out Date</TableCell>
      <TableCell style={{paddingLeft: 4, paddingRight: 4, textAlign: 'center'}}  className='button-col' numeric>Move In Date</TableCell>
      <TableCell style={{textAlign: 'center'}}  className='button-col' numeric>Contribution</TableCell>
      <TableCell style={{textAlign: 'center'}} className='button-col' numeric>Update</TableCell>
      <TableCell style={{textAlign: 'center'}} className='button-col' numeric>Delete</TableCell>
      </TableRow>
      </TableHead>
      <TableBody>
      {
        this.state.data.map(function(log){
          return  <TableRow>
          <TableCell style={{textAlign: 'center'}} component="th" scope="row" className='counterCell' numeric></TableCell>
          <TableCell style={{textAlign: 'center', padding: '4px 5px 4px 5px'}} className='desc-col'>
          {log.name}
          </TableCell>
          <TableCell style={{textAlign: 'center'}} className='button-col' numeric>{log.boxes}</TableCell>
          <TableCell style={{textAlign: 'center', padding: '4px 5px 4px 5px'}} className='button-col'>{log.moveOut}</TableCell>
          <TableCell style={{textAlign: 'center', padding: '4px 5px 4px 5px'}} className='button-col'>{log.moveIn}</TableCell>
          <TableCell style={{textAlign: 'center'}} className='button-col'>${log.contribution}</TableCell>
          <TableCell style={{textAlign: 'center'}} className='button-col'><Update log={log}/></TableCell>
          <TableCell style={{textAlign: 'center'}} className='button-col'><Delete id={log._id} log={log}/></TableCell>
          </TableRow>
        })
      }
      </TableBody>
      </Table>
      </div>
      </div>
    );
  }
}

LogTab.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LogTab);
