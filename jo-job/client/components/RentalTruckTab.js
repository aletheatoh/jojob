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

import { comparePrice, compareReviews } from './helpers'

import TextField from 'material-ui/TextField';

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
    maxWidth: 600,
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
      handlingRequest: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.addToLog = this.addToLog.bind(this);
    this.getCost = this.getCost.bind(this);
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
        oldTruck: parseFloat(response.data[0].truck)
      });
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  addToLog(price) {
    const priceFloat = parseFloat(price.replace('$',''));
    axios.post('/addCost',
    querystring.stringify({
      storage: this.state.oldStorage,
      truck: priceFloat,
      total: (priceFloat + this.state.oldStorage)
    }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(function(response) {
      console.log('success')
    });
  }

  handleClick(event) {
    this.setState({
      handlingRequest: true
    });
    var pickUp = this.state.pickUp;

    var endpoint = `http://localhost:8000/uhaul?pickup=${pickUp}`;

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

        return (
          <SearchResults>
          <Card style={{margin: '0 auto'}} className={classes.card}>
          <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
          {result.truckType}
          </Typography>
          <div style={{position: 'relative'}}>
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
          <CardActions style={{textAlign: 'right'}}>
          <Button onClick={() => this.addToLog(result.price)} size="small" color="primary">
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
      <SearchResults>
      </SearchResults>
    );

    if (this.state.handlingRequest) {
      return (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '47%',
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

      return (
        <div>
        <SearchBox>
        <form className={classes.root} autoComplete="off">

        <TextField
        className={classNames(classes.margin, classes.textField)}
        style={{textAlign: 'left'}}
        id="pickUp"
        name="pickUp"
        label="Pickup Date"
        type="date"
        value={this.state.pickUp}
        defaultValue={this.state.pickUp}
        onChange={this.handleTextChange}
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

RentalTruckTab.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RentalTruckTab);
