import React from 'react';
import {Button} from 'react-bootstrap';
import Modal from 'react-modal';
import axios from 'axios';
import {Link} from 'react-router-dom';
var querystring = require('querystring');

import AddIcon from 'material-ui-icons/Add';
import IconButton from 'material-ui/IconButton';

class Add extends React.Component {

  constructor() {
    super();
    this.state = {
      name: '',
      boxes: '',
      moveIn: '',
      moveOut: '',
      messageFromServer: '',
      modalIsOpen: false
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

  closeModal() {
    this.setState({
      modalIsOpen: false,
      name: '',
      boxes: '',
      moveIn: '',
      moveOut: '',
      messageFromServer: ''
    });
  }

  // componentDidMount() {
  //   this.setState({
  //     month: this.props.selectedMonth
  //   });
  //   this.setState({
  //     year: this.props.selectedYear
  //   });
  // }

  onClick(e) {
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
    }).then(function(response) {
      e.setState({
        messageFromServer: response.data
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

    if(this.state.messageFromServer == ''){
      return (
        <div>
        <IconButton color="secondary" onClick={this.openModal} aria-label="add" >
          <AddIcon size="large" />
        </IconButton>
        <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        contentLabel="Add Log"
        className="Modal">
        <Link to={{pathname: '/', search: '' }} style={{ textDecoration: 'none' }}>
        <Button bsStyle="danger" bsSize="mini" onClick={this.closeModal}><span className="closebtn glyphicon glyphicon-remove"></span></Button>
        </Link><br/>
        <fieldset>
        <label for="description">Name:</label><input type="text" id="name" name="name" value={this.state.name} onChange={this.handleTextChange}></input>
        <label for="boxes">Boxes:</label><input type="number" id="boxes" name="boxes" value={this.state.boxes} onChange={this.handleTextChange}></input>
        <label for="moveOut">Move Out:</label><input type="date" id="moveOut" name="moveOut" value={this.state.moveOut} onChange={this.handleTextChange}></input>
        <label for="moveIn">Move In:</label><input type="date" id="moveIn" name="moveIn" value={this.state.moveIn} onChange={this.handleTextChange}></input>
        </fieldset>
        <div className='button-center'>
        <br/>
        <Button bsStyle="success" bsSize="small" onClick={this.onClick}>Add New Log</Button>
        </div>
        </Modal>
        </div>
      )
    }
    else{
      return (
        <div>
        <Button bsStyle="success" bsSize="small" onClick={this.openModal}><span className="glyphicon glyphicon-plus"></span></Button>
        <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        contentLabel="Add Log"
        className="Modal">
        <div className='button-center'>
        <h3>{this.state.messageFromServer}</h3>
        <Link to={{pathname: '/', search: '' }} style={{ textDecoration: 'none' }}>
        <Button bsStyle="success" bsSize="mini" onClick={this.closeModal}>Close the Dialog</Button>
        </Link>
        </div>
        </Modal>
        </div>
      )
    }
  }
}

export default Add;
