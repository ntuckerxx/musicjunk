//KeyboardState
//KeyboardState creates a MidiListener and watches all events, keeping track of which keys
//are currently held down.  Every time a key goes up or down, KeyboardState will emit a
//"change" event where event.detail.keystates is a sparse array contanining a true value
//for every key that is currently held down
define(function(require, exports, module) {
    var MidiListener = require("midilistener");

    class KeyboardState extends EventTarget {
        constructor() {
            super();

            this.keystates = [];
            this.ml = new MidiListener()
            this.ml.addEventListener("midi", function(e) {
                var data = e.detail.data;
                if(data[0] == 144) {
                    this.keydown(data[1]);
                } else if(data[0] == 128) {
                    this.keyup(data[1]);
                }
            }.bind(this));
        }
        
        keydown(k) {
            this.keystates[k] = true;
            this.update();
        }
        keyup(k) {
            delete this.keystates[k];
            this.update();
        }
        update() {
            this.dispatchEvent(new CustomEvent('change', { detail: {keystates: this.keystates} }));
        }
    };
    module.exports = KeyboardState;
})