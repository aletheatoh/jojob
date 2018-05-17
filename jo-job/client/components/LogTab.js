import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Add from './Add'
import Update from './Update'
import Delete from './Delete';

import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import DownloadIcon from 'material-ui-icons/Save';

import {CSVLink} from 'react-csv';

import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter } from 'material-ui/Table';

const headers = [
  {label: 'Name', key: 'Name'},
  {label: 'Boxes', key: 'Boxes'},
  {label: 'Move In', key: 'Move In'},
  {label: 'Move Out', key: 'Move Out'},
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

  // unsafe so should change
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
      <div style={{textAlign: 'center'}}>
      <Add/>
      <div style={{display: 'inline-block', paddingLeft: 10}}>
      <CSVLink data={this.state.data} headers={headers}>
      <Button variant="fab" color="secondary" aria-label="download" >
      <DownloadIcon size="large" />
      </Button>
      </CSVLink>
      </div>
      </div>
      <div style={{textAlign: 'center'}} class="logtab-container">
      <Table className={classes.table} id="table-to-excel">
      <TableHead>
      <TableRow>
      <TableCell style={{textAlign: 'center', fontSize: 14, color: 'black'}} className='button-col' ></TableCell>
      <TableCell style={{textAlign: 'center', fontSize: 14, color: 'black'}} className='desc-col'>Name</TableCell>
      <TableCell style={{textAlign: 'center', fontSize: 14, color: 'black'}} className='button-col' numeric>Boxes</TableCell>
      <TableCell style={{paddingLeft: 4, paddingRight: 4, textAlign: 'center', fontSize: 14, color: 'black'}} className='button-col' numeric>Move Out Date</TableCell>
      <TableCell style={{paddingLeft: 4, paddingRight: 4, textAlign: 'center', fontSize: 14, color: 'black'}}  className='button-col' numeric>Move In Date</TableCell>
      <TableCell style={{textAlign: 'center', fontSize: 14, color: 'black'}}  className='button-col' numeric>Contribution</TableCell>
      <TableCell style={{textAlign: 'center', fontSize: 14, color: 'black'}} className='button-col' numeric>Update</TableCell>
      <TableCell style={{textAlign: 'center', fontSize: 14, color: 'black'}} className='button-col' numeric>Delete</TableCell>
      </TableRow>
      </TableHead>
      <TableBody>
      {
        this.state.data.map(function(log){
          return  <TableRow>
          <TableCell style={{textAlign: 'center'}} component="th" scope="row" className='counterCell' numeric></TableCell>
          <TableCell style={{textAlign: 'center'}} className='desc-col'>
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
      <TableFooter>
      {
        this.state.cost.map(function(item){
          return <TableRow>
          <TableCell style={{fontSize: 16, color: 'black', padding: 0, paddingRight: 10}} colSpan={1}>
            <div style={{display: 'inline-block'}}>
              <img src="../img/storage-unit.svg" style={{width: 38}}/>
            </div>
            <div style={{display: 'inline-block', verticalAlign: 'top', paddingLeft: 5, paddingTop: 15}}>
              <div style={{verticalAlign: 'middle'}}>${item.storage}</div>
            </div>
          </TableCell>
          <TableCell style={{fontSize: 16, color: 'black', padding: 0, paddingLeft: 10, paddingTop: 3}} colSpan={2}>
          <div style={{display: 'inline-block'}}>
            <img src="../img/delivery-truck.svg" style={{width: 48}}/>
          </div>
          <div style={{display: 'inline-block', verticalAlign: 'top', paddingLeft: 5, paddingTop: 15}}>
            <div>${item.truck}</div>
          </div>
          </TableCell>
          <TableCell style={{textAlign: 'right', fontSize: 20, fontWeight: 'bold', color: 'black'}} colSpan={5}>Total Cost: ${item.total}</TableCell>
          </TableRow>
        })
      }
      </TableFooter>
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
