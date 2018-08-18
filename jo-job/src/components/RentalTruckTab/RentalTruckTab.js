import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';

import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import axios from 'axios';
var querystring = require('querystring');

import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import PhoneIcon from 'material-ui-icons/Phone';

import { CircularProgress } from 'material-ui/Progress';

import { comparePrice, compareReviews } from '../Helpers'

import base_url from '..../server/server.js'

import TextField from 'material-ui/TextField';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

const SearchBox = styled.div`
text-align: center;
width: 600px;
margin: 0 auto;
font-size: 15px;
`;

const SearchResults = styled.div`
width: 700px;
margin: 0 auto;
padding-top: 10px;
`;

const ResultDetail = styled.div`
width: 140px;
text-align: center;
display: inline-block;
vertical-align: top;
`;

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  card: {
    maxWidth: 500,
  },
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    flexBasis: 200,
  },
});

class RentalTruckTab extends React.Component  {

  constructor() {
    super();
    this.state = {
      city: '',
      pickUp: '',
      time: '',
      oldTotal: '',
      oldStorage: '',
      oldTruck: '',
      oldUnitSize: '',
      oldStorageLink: '',
      oldTruckType: '',
      modalIsOpen: false,
      handlingRequest: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.addToLog = this.addToLog.bind(this);
    this.getCost = this.getCost.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.getCost(this);
  }

  // unsafe so should change
  componentWillReceiveProps(nextProps) {
    this.getCost(this);
    console.log('receiving props again')
  }

  getCost(ev){
    axios.get('/getCost')
    .then(function(response) {
      ev.setState({
        oldTotal: parseFloat(response.data[0].total),
        oldStorage: parseFloat(response.data[0].storage),
        oldTruck: parseFloat(response.data[0].truck),
        oldUnitSize: response.data[0].unitSize,
        oldTruckType: response.data[0].truckType,
        oldStorageLink: response.data[0].storageLink
      });
    });
  }

  handleChange(event) {
    this.setState({
      pickUp: event.target.value
    });
    console.log(event.target.name);
    console.log(event.target.value);
  }

  closeModal(e) {
    this.setState({
      modalIsOpen: false
    });
  }

  addToLog(price, truckType) {
    this.setState({
      handlingRequest: true
    });
    const priceFloat = parseFloat(price.replace('$',''));
    axios.post('/addCost',
    querystring.stringify({
      storage: this.state.oldStorage,
      truck: priceFloat,
      total: (priceFloat + this.state.oldStorage),
      truckType: truckType,
      unitSize: this.state.oldUnitSize,
      storageLink: this.state.oldStorageLink
    }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(response => {  // <== Change is here
      this.setState({
        handlingRequest: false,
        modalIsOpen: true
      })
    })
  }

  handleClick(event) {
    this.setState({
      handlingRequest: true
    });
    var pickUp = this.state.pickUp;
    console.log(pickUp);
    var endpoint = `${base_url}/uhaul?pickup=${pickUp}`;

    axios.get(endpoint)
    .then(response => {  // <== Change is here
      this.setState({
        data:response.data.results,
        handlingRequest: false
      })
    })

    event.preventDefault();
  }

  render() {

    const { classes } = this.props;

    const renderData = this.state.data ? (
      this.state.data.map((result, index) => {

        const img = '../img/' + result.truckType + '.png';

        return (
          <SearchResults>
          <Card style={{margin: '0 auto', position: 'relative'}} className={classes.card}>
          <div style={{display: 'inline-block'}}>
          <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
          {result.truckType}
          </Typography>
          <div>
          <div style={{display: 'inline-block'}}>
          <Typography gutterBottom variant="subheading" color="textSecondary">
          {result.suitableFor}
          </Typography>
          </div>
          </div>
          <Typography component="p" style={{fontSize: 24, fontWeight: 'bold'}}>
          {result.price}
          </Typography>
          <Typography component="p">
          + {result.mileCharge}
          </Typography>
          </CardContent>
          </div>
          <div style={{display: 'inline-block'}}>
          <div style={{position: 'absolute', right: 50, bottom: 50}}>
          <img src={img} style={{width: 150}}/>
          </div>
          </div>
          <CardActions style={{textAlign: 'right'}}>
          <Button onClick={() => this.addToLog(result.price, result.truckType)} size="small" color="primary">
          Add to Log
          </Button>
          <Button size="small" color="primary">
          Go to Site
          </Button>
          </CardActions>
          </Card>
          </SearchResults>
        )
      })
    ) : (
      <SearchResults style={{textAlign: 'center'}}>
      <div style={{margin: '0 auto'}}>
        <img src="../img/delivery-truck.svg" style={{width: 350}}/>
      </div>
      </SearchResults>
    );

    if (this.state.handlingRequest) {
      return (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: '-50px',
          marginLeft: '-50px',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10
        }}>
        <CircularProgress style={{ width: '10vw', height: '10vw' }} />
        </div>
      )
    }
    else {

      if (this.state.modalIsOpen === true){
        return (
          <div>
          <Dialog
          open={this.state.modalIsOpen}
          onClose={this.closeModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title">{"Success!"}</DialogTitle>
          <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Successfully added to log!
          </DialogContentText>
          </DialogContent>
          <DialogActions>
          <Link to={{pathname: '/', search: '' }} style={{ textDecoration: 'none' }}>
          <Button onClick={this.closeModal} color="primary">
          Close
          </Button>
          </Link>
          </DialogActions>
          </Dialog>
          </div>
        )
      }

      else {


        return (
          <div>
          <SearchBox>
          <form className={classes.root} autoComplete="off" style={{margin: '0 auto'}}>

          <TextField
          className={classNames(classes.margin, classes.textField)}
          style={{textAlign: 'center', margin: '0 auto'}}
          id="pickUp"
          name="pickUp"
          label="Pickup Date"
          type="date"
          defaultValue={this.state.pickUp}
          onChange={this.handleTextChange}
          formatDate={(date) => moment(date).format('MM-DD-YYYY')}
          InputLabelProps={{
            shrink: true,
            textAlign: 'left'
          }}
          />

          </form>
          <Button color="primary" onClick={this.handleClick} >Search</Button>
          </SearchBox>
          {renderData}
          </div>
        )
      }

    }
  }
}

RentalTruckTab.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RentalTruckTab);
