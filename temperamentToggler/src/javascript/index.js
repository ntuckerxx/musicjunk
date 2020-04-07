import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
const chordIdentifier = require('./chordIdentifier');
const synth = require('./synthclient');
window.synth = synth; // for using in console
const MidiListener = require('./midilistener');
let program = 0;
const ml = new MidiListener();
ml.addEventListener('midi', (e) => {
  switch(e.detail.data[0]) {
    case 144:
      console.log("noteOn");
      // note on
      synth.noteOn(0, e.detail.data[1], e.detail.data[2]);
      break;
    case 128:
      // note off
      synth.noteOff(0, e.detail.data[1]);
      break;
    case 153:
      //pad on
      switch(e.detail.data[1]) {
        case 40:
          synth.equaltuning();
          break;
      case 36:
          synth.pythtuning();
          break;
      case 51:
          synth.badtuning();
          break;
    }
    case 137:
      //pad off
      break;
    case 176:
      switch(e.detail.data[1]) {
        case 21:
          synth.tweakinterval(7, e.detail.data[2]);
          break;
        case 26:
          synth.tweakinterval(3, e.detail.data[2]);
          break;
        case 27:
          synth.tweakinterval(6, e.detail.data[2]);
          break;
        case 28:
          synth.tweakinterval(10, e.detail.data[2]);
          break;
        case 103:
          if(e.detail.data[2] == 127) {
            program--;
            synth.program(0, program).then(() => { console.log("program set to ", program);});
          }
          break;
        case 102:
          if(e.detail.data[2] == 127) {
            program++;
            synth.program(0, program).then(() => { console.log("program set to ", program);});
          }
          break;
      }
      break;
    default:
      console.log("unhandled midi: ", e.detail.data);
      break;
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

