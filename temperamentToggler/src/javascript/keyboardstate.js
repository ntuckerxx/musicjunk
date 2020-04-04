//KeyboardState
//KeyboardState creates a MidiListener and watches all events, keeping track of which keys
//are currently held down.  Every time a key goes up or down, KeyboardState will emit a
//"change" event where event.detail.keystates is a sparse array contanining a true value
//for every key that is currently held down
var MidiListener = require("./midilistener");

class KeyboardState extends EventTarget {
    constructor() {
        super();

        this.keystates = [];
        this.knobs = [64,64,64,64,64,64,64,64];
        this.sliders = [0,0,0,0,0,0,0,0];
        this.ml = new MidiListener()
        this.ml.addEventListener("midi", function(e) {
            var data = e.detail.data;

            if(data[0] == 144) {
                this.keydown(data[1]);
            } else if(data[0] == 128) {
                this.keyup(data[1]);
            } else if(data[0] == 176 && (data[1] >= 21 && data[1] <= 28)) {
                var knobNum = data[1] - 21;
                this.knobs[knobNum] = data[2];
                this.update();
            } else if(data[0] == 176 && (data[1] >= 41 && data[1] <= 48)) {
                var sliderNum = data[1] - 41;
                this.sliders[sliderNum] = data[2];
                this.update();
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
        var detail = {
            keystates: this.keystates,
            knobstates: this.knobs,
            sliderstates: this.sliders
        };
        this.dispatchEvent(new CustomEvent('change', { detail: detail }));
    }
};
module.exports = KeyboardState;