// import React from 'react';
// import ReactDOM from 'react-dom';
// import './css/App.css';
// import App from './components/App';
//
// ReactDOM.render(<App />, document.getElementById('root'));
//
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import Routes from './routes'

ReactDOM.render(
  <HashRouter>
    <Routes />
  </HashRouter>, document.getElementById('root')
);
