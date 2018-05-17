import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';
import Button from 'material-ui/Button';
import axios from 'axios';
import {Link} from 'react-router-dom';
var querystring = require('querystring');

import AddIcon from 'material-ui-icons/Add';
import EditIcon from 'material-ui-icons/Edit';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import { CircularProgress } from 'material-ui/Progress';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import Input, { InputLabel, InputAdornment } from 'material-ui/Input';

import { FormControl } from 'material-ui/Form';

const theme = createMuiTheme({
  palette: {
    primary: {main: '#9C27B0'},
  },
});

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    flexBasis: 200,
  },
});

class Add extends React.Component {

  constructor() {
    super();
    this.state = {
      name: '',
      boxes: '',
      moveIn: '',
      moveOut: '',
      messageFromServer: '',
      modalIsOpen: false,
      handlingRequest: false
    }

    this.onClick = this.onClick.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.insertNewLog = this.insertNewLog.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({
      modalIsOpen: true
    });
  }

  closeModal(e) {
    this.setState({
      modalIsOpen: false,
      name: '',
      boxes: '',
      moveIn: '',
      moveOut: '',
      messageFromServer: ''
    });
  }

  onClick(e) {
    this.setState({
      handlingRequest: true
    });
    this.insertNewLog(this);
  }

  insertNewLog(e) {
    axios.post('/insert',
    querystring.stringify({
      name: e.state.name,
      boxes: e.state.boxes,
      moveIn: e.state.moveIn,
      moveOut: e.state.moveOut
    }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(function(response, event) {
      e.setState({
        messageFromServer: response.data,
        handlingRequest: false
      });
    });
  }

  handleTextChange(e) {
    if (e.target.name == "name") {
      this.setState({
        name: e.target.value
      });
    }
    if (e.target.name == "boxes") {
      this.setState({
        boxes: e.target.value
      });
    }

    if (e.target.name == "moveIn") {
      this.setState({
        moveIn: e.target.value
      });
    }

    if (e.target.name == "moveOut") {
      this.setState({
        moveOut: e.target.value
      });
    }
  }

  render() {

    const { classes } = this.props;

    if(this.state.messageFromServer == ''){
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
        return (
          <div style={{display: 'inline-block'}}>
          <MuiThemeProvider theme={theme}>
          <Button variant="fab" color="primary" onClick={this.openModal} aria-label="add" >
            <img src="../img/add-user.svg" style={{width: 33}}/>
          </Button>
          </MuiThemeProvider>
          <Dialog
          className={classes.root}
          open={this.state.modalIsOpen}
          onClose={this.closeModal}
          aria-labelledby="form-dialog-title"
          >
          <DialogTitle id="form-dialog-title">Add Person</DialogTitle>
          <DialogContent>
          <FormControl className={classes.margin}>
          <InputLabel style={{textAlign: 'left'}} htmlFor="name">Name</InputLabel>
          <Input type="text" id="name" name="name" value={this.state.name} onChange={this.handleTextChange}/>
          </FormControl>
          <FormControl className={classes.margin}>
          <InputLabel style={{textAlign: 'left'}} htmlFor="boxes">Boxes</InputLabel>
          <Input type="number" id="boxes" name="boxes" value={this.state.boxes} onChange={this.handleTextChange}/>
          </FormControl>
          <TextField
          className={classNames(classes.margin, classes.textField)}
          style={{textAlign: 'left'}}
          id="moveIn"
          name="moveIn"
          label="Move In"
          type="date"
          value={this.state.moveIn}
          defaultValue={this.state.moveIn}
          onChange={this.handleTextChange}
          InputLabelProps={{
            shrink: true,
            textAlign: 'left'
          }}
          />
          <TextField
          className={classNames(classes.margin, classes.textField)}
          style={{textAlign: 'left'}}
          id="moveOut"
          name="moveOut"
          label="Move Out"
          type="date"
          value={this.state.moveOut}
          defaultValue={this.state.moveOut}
          onChange={this.handleTextChange}
          InputLabelProps={{
            shrink: true,
            textAlign: 'left'
          }}
          />
          </DialogContent>
          <DialogActions>
          <Button onClick={this.closeModal} color="primary">
          Cancel
          </Button>
          <Button onClick={this.onClick} color="primary">
          Submit
          </Button>
          </DialogActions>
          </Dialog>

          </div>
        )
      }
    }
    else{
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
        {this.state.messageFromServer}
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
  }
}

Add.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Add);
