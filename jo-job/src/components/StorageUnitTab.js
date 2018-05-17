import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';

import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
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

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import { CircularProgress } from 'material-ui/Progress';

import { comparePrice, compareReviews } from './Helpers'

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
    maxWidth: 620,
  },
});

class StorageUnitTab extends React.Component  {

  constructor() {
    super();
    this.state = {
      city: '',
      unitSize: '',
      order: '',
      data: '',
      oldTotal: '',
      oldStorage: '',
      oldTruck: '',
      oldUnitSize: '',
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
      console.log(response.data)
      ev.setState({
        oldTotal: parseFloat(response.data[0].total),
        oldStorage: parseFloat(response.data[0].storage),
        oldTruck: parseFloat(response.data[0].truck),
        oldUnitSize: response.data[0].unitSize,
        oldTruckType: response.data[0].truckType,
      });
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  closeModal(e) {
    this.setState({
      modalIsOpen: false
    });
  }

  addToLog(event, price) {
    this.setState({
      handlingRequest: true
    });
    const priceFloat = parseFloat(price.replace('$',''));
    axios.post('/addCost',
    querystring.stringify({
      storage: priceFloat,
      truck: this.state.oldTruck,
      total: (priceFloat + this.state.oldTruck),
      unitSize: this.state.unitSize,
      truckType: this.state.oldTruckType
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
    var unitSize = this.state.unitSize;
    var order = this.state.order;

    var endpoint = `http://localhost:8000/sparefoot?order=${order}&unit_size=${unitSize}`;

    axios.get(endpoint)
    .then(response => {  // <== Change is here
      if (order === "price") {
        // sort according to price
        response.data.results.sort(comparePrice);
        this.setState({
          data:response.data.results,
          handlingRequest: false
        })
      }
      if ( order === "reviews") {
        // sort according to reviews
        response.data.results.sort(compareReviews);
        this.setState({
          data:response.data.results,
          handlingRequest: false
        })
      }
      else {
        this.setState({
          data:response.data.results,
          handlingRequest: false
        })
      }
    })

    event.preventDefault();
  }

  render() {

    const { classes } = this.props;

    const renderData = (this.state.data != '') ? (
      this.state.data.map((result, index) => {

        const promotion = result.promotion ? result.promotion : 'No promotion';
        const reviews = result.reviews ? result.reviews : 'No reviews';

        return (
          <SearchResults>
          <Card style={{margin: '0 auto'}} className={classes.card}>
          <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
          {result.name}
          </Typography>
          <div style={{position: 'relative'}}>
          <div style={{display: 'inline-block'}}>
          <Typography gutterBottom variant="subheading" color="textSecondary">
          {result.address}
          </Typography>
          </div>
          <div style={{display: 'inline-block', position: 'absolute', top: 0, right: 20}}>
          <Typography gutterBottom variant="subheading" color='black'>
          <PhoneIcon style={{verticalAlign: 'middle'}} size="large"/> {result.contact}
          </Typography>
          </div>
          </div>
          <ResultDetail>
          <h5 style={{fontWeight: 'bold', marginTop: 8, marginBottom: 6}}>Distance</h5>
          <Typography component="p">
          {result.distance}
          </Typography>
          </ResultDetail>
          <ResultDetail>
          <h5 style={{fontWeight: 'bold', marginTop: 8, marginBottom: 6}}>Price</h5>
          <Typography component="p">
          {result.price}
          </Typography>
          </ResultDetail>
          <ResultDetail>
          <h5 style={{fontWeight: 'bold', marginTop: 8, marginBottom: 6}}>Reviews</h5>
          <Typography component="p">
          {reviews}
          </Typography>
          </ResultDetail>
          <ResultDetail>
          <h5 style={{fontWeight: 'bold', marginTop: 8, marginBottom: 6}}>Promotion</h5>
          <Typography component="p">
          {promotion}
          </Typography>
          </ResultDetail>
          </CardContent>
          <CardActions style={{textAlign: 'right'}}>
          <Button onClick={(event) => this.addToLog(event, result.price)} style={{textAlign: 'right'}} size="small" color="primary">
          Add to Log
          </Button>
          <Button style={{textAlign: 'right'}} size="small" color="primary" href={result.link} target="_blank">
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
        <img src="../img/storage-unit.svg" style={{width: 320, paddingTop: 10}}/>
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
          <form className={classes.root} autoComplete="off">
          <FormControl className={classes.formControl} style={{margin: '0 auto'}}>
          <InputLabel htmlFor="unitSize-simple" style={{textAlign: 'left', fontWeight: 100, fontSize: 15}}>Unit Size</InputLabel>
          <Select
          value={this.state.unitSize}
          onChange={this.handleChange}
          inputProps={{
            name: 'unitSize',
            id: 'unitSize-simple',
          }}
          >
          <MenuItem style={{fontSize: 15}} value=''>
          <em>None</em>
          </MenuItem>
          <MenuItem style={{fontSize: 15}} value={'20-37'}>5 x 5</MenuItem>
          <MenuItem style={{fontSize: 15}} value={'37-62'}>5 x 10</MenuItem>
          <MenuItem style={{fontSize: 15}} value={'62-87'}>5 x 15</MenuItem>
          <MenuItem style={{fontSize: 15}} value={'87-125'}>10 x 10</MenuItem>
          <MenuItem style={{fontSize: 15}} value={'125-175'}>10 x 15</MenuItem>
          <MenuItem style={{fontSize: 15}} value={'175-250'}>10 x 20</MenuItem>
          <MenuItem style={{fontSize: 15}} value={'250-999'}>10 x 30</MenuItem>
          </Select>
          </FormControl>
          <FormControl className={classes.formControl} style={{margin: '0 auto', padding: 0}}>
          <InputLabel htmlFor="order-simple" style={{textAlign: 'left', fontWeight: 100, fontSize: 15}}>Order By</InputLabel>
          <Select
          value={this.state.order}
          onChange={this.handleChange}
          inputProps={{
            name: 'order',
            id: 'order-simple',
          }}
          >
          <MenuItem style={{fontSize: 15}} value=''>
          <em>None</em>
          </MenuItem>
          <MenuItem style={{fontSize: 15}} value={'price'}>Price</MenuItem>
          <MenuItem style={{fontSize: 15}} value={'recommended'}>Recommended</MenuItem>
          <MenuItem style={{fontSize: 15}} value={'distance'}>Distance</MenuItem>
          <MenuItem style={{fontSize: 15}} value={'reviews'}>Reviews</MenuItem>
          </Select>
          </FormControl>
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


StorageUnitTab.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StorageUnitTab);
