import React, { Component } from 'react';
const KeyboardState = require('./keyboardstate');
var ks = new KeyboardState();

// ks.addEventListener("change", function(e) {
//   // update(e.detail.keystates, e.detail.knobstates, e.detail.sliderstates);
//   // console.log('e.detail.keystates: ', e.detail.keystates);
//   let pressedKeys = [];
//   for (let key in e.detail.keystates) {
//     pressedKeys.push(key);
//     // console.log(chordIdentifier.identifyChord(pressedKeys));
//     App.changeNotes(chordIdentifier.identifyChord(pressedKeys));  
//   }
// });


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentKeys: [
        {chordQuality: "major", rootNote: "C", description: "Cmajor"},
        {chordQuality: "min/♭13", rootNote: "E", description: "Emin/♭13"}
      ]
    };
  };
  
  componentDidMount() {
    console.log()
  }

  updateKeys(arrayOfKeys) {
    console.log('arrayOfKeys: ', arrayOfKeys);
  };

  render() {
    const { currentKeys } = this.state;
    return (
      <div>
        ${JSON.stringify(currentKeys)}
      </div>
    )
  }
};

export default App;