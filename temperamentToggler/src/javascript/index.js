import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
const chordIdentifier = require('./chordIdentifier');
const synth = require('./synthclient');
window.synth = synth; // for using in console
const MidiListener = require('./midilistener');

const ml = new MidiListener();
ml.addEventListener('midi', (e) => {
  if(e.detail.data[0] == 144) {
    console.log("noteOn");
    // note on
    synth.noteOn(0, e.detail.data[1], e.detail.data[2]);
  } else if(e.detail.data[0] == 128) {
    // note off
    synth.noteOff(0, e.detail.data[1]);
  } else {
    console.log("unhandled midi: ", e.detail.data);
  }
});


console.log('fark');
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// input: array of keystates which are either empty or true
// goal: call chordIdentifier and pass it the index of all the keys that are true
// then do some react bullshit to display it (eventually);

