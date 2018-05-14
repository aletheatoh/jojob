import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';

class Delete extends React.Component {

  constructor(){
    super();
    this.state={id:''};
    this.onClick = this.onClick.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    this.setState({
      id: this.props.log._id
    })
  }

  onClick(e){
    this.delete(this);
  }

  delete(e){
    axios.get('/delete?id='+e.state.id)
    .then(function(response, event) {
      event.preventDefault();
    });
  }

  render(){
    return (
      <IconButton color="primary" onClick={this.onClick} aria-label="delete" >
        <Link to={{pathname: '/', search: '' }} style={{ textDecoration: 'none' }}>
        <DeleteIcon size="small" />
        </Link>
      </IconButton>
    )
  }
}

export default Delete;
