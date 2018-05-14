import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Add from './Add'
import Update from './Update'
import Delete from './Delete';

import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class LogTab extends React.Component  {

  constructor() {
    super();
    this.state = {data: []};
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData(this);
  }

  componentWillReceiveProps(nextProps) {
    this.getData(this);
  }

  getData(ev){
    axios.get('/getAll')
    .then(function(response) {
      ev.setState({data: response.data});
    });
  }

  render() {
    return (
      <div class="logtab-container" style={{textAlign: 'center', margin: 'auto'}}>
      <Add/>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell className='button-col' ></TableCell>
            <TableCell className='desc-col'>Name</TableCell>
            <TableCell className='button-col' numeric>Boxes</TableCell>
            <TableCell className='button-col' numeric>Move Out Date</TableCell>
            <TableCell className='button-col' numeric>Move In Date</TableCell>
            <TableCell className='button-col' numeric>Update</TableCell>
            <TableCell className='button-col' numeric>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          this.state.data.map(function(log){
            return  <TableRow>
            <TableCell component="th" scope="row" className='counterCell' numeric></TableCell>
            <TableCell className='desc-col'>
              {log.name}
            </TableCell>
            <TableCell className='button-col' numeric>{log.boxes}</TableCell>
            <TableCell className='button-col'>{log.moveOut}</TableCell>
            <TableCell className='button-col'>{log.moveIn}</TableCell>
            <TableCell className='button-col'><Update log={log} /></TableCell>
            <TableCell className='button-col'><Delete id={log._id} log={log} /></TableCell>
            </TableRow>
          })
        }
        </TableBody>
      </Table>
      </div>
    );
  }
}

LogTab.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LogTab);
