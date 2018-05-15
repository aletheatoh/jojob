import React from 'react';

import axios from 'axios';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';
var querystring = require('querystring');

import EditIcon from 'material-ui-icons/Edit';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import Input, { InputLabel, InputAdornment } from 'material-ui/Input';

import { FormControl } from 'material-ui/Form';

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

class Update extends React.Component {

  constructor() {
    super();
    this.state = {
      id: '',
      name: '',
      boxes: '',
      moveIn: '',
      moveOut: '',
      contribution: '',
      messageFromServer: '',
      modalIsOpen: false
    }

    this.update = this.update.bind(this);
    this.onClick = this.onClick.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.setState({
      id: this.props.log._id,
      name: this.props.log.name,
      boxes: this.props.log.boxes,
      moveOut: this.props.log.moveOut,
      moveIn: this.props.log.moveIn,
      contribution: this.props.log.contribution,
    });
  }

  openModal() {
    this.setState({
      modalIsOpen: true
    });
  }

  closeModal(e) {
    this.setState({
      modalIsOpen: false,
      messageFromServer: ''
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

    if (e.target.name == "contribution") {
      this.setState({
        contribution: e.target.value
      });
    }
  }

  onClick(e) {
    this.update(this);
  }

  update(e) {
    axios.post('/update',
    querystring.stringify({
      _id: e.state.id,
      name: e.state.name,
      boxes: e.state.boxes,
      moveIn: e.state.moveIn,
      moveOut: e.state.moveOut,
      contribution: e.state.contribution
    }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(function(response, event) {
      e.setState({
        messageFromServer: response.data
      });
    });
  }

  render() {
     const { classes } = this.props;

    if(this.state.messageFromServer == ''){
      return (
        <div>
        <IconButton color="secondary" onClick={this.openModal} aria-label="edit" style={{marginLeft: 5}}>
          <EditIcon size="small" />
        </IconButton>
        <Dialog
          className={classes.root}
          open={this.state.modalIsOpen}
          onClose={this.closeModal}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Update Entry</DialogTitle>
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
            <FormControl className={classes.margin}>
            <InputLabel style={{textAlign: 'left'}} htmlFor="contribution">Amount</InputLabel>
              <Input
                id="contribution"
                value={this.state.contribution}
                onChange={this.handleTextChange}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeModal} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onClick} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
        </div>
      )
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
Update.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Update);
