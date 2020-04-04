import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
const chordIdentifier = require('./chordIdentifier');
const synth = require('./synthclient');
window.synth = synth; // for using in console

console.log('fark');
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// input: array of keystates which are either empty or true
// goal: call chordIdentifier and pass it the index of all the keys that are true
// then do some react bullshit to display it (eventually);

