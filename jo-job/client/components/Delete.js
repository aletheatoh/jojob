import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';
import { CircularProgress } from 'material-ui/Progress';

import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

class Delete extends React.Component {

  constructor(){
    super();
    this.state = {
      id:'',
      messageFromServer: '',
      modalIsOpen: false,
      handlingRequest: false
    };
    this.onClick = this.onClick.bind(this);
    this.delete = this.delete.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.setState({
      id: this.props.log._id
    })
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

  onClick(e){
    this.setState({
      modalIsOpen: true,
      handlingRequest: true
    });
    this.delete(this);
  }

  delete(e){
    axios.get('/delete?id='+e.state.id)
    .then(function(response, event) {
      console.log(response.data) // this works
      e.setState({
        messageFromServer: response.data,
        modalIsOpen: true,
        handlingRequest: false
      });
    });
  }

  render() {

    if (this.state.messageFromServer == ''){

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
          <IconButton color="primary" onClick={this.onClick} aria-label="delete" style={{marginLeft: 5}}>
          <DeleteIcon size="small" />
          </IconButton>
        )
      }
    }
    else {
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

Delete.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default Delete;
