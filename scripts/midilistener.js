define(function(require, exports, module) {
//
// MidiListener, when created, iterates through all the imidi input devices and
// listens for events on each.  Whenever it gets a midi event on any device, it
// emits its own "midi" event describing the device.  Use it by instantiating
// MidiListener and attaching a "midi" event handler on it:
//
// var myListener = new MidiListener();
// myListener.addEventListener("midi", function(event){
//     // handle midi events here. 
//});

class MidiListener extends EventTarget {
    constructor() {
        super();
        this.ins = [];
        this.outs = [];

        if (navigator.requestMIDIAccess) {
            console.log('This browser supports WebMIDI!');
        
            navigator.requestMIDIAccess().then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));
        
        } else {
            throw('WebMIDI is not supported in this browser.');
        }
        
    }
    getMessage(message) {
        //console.log("got message: ", message);
        //console.log("this: ", this);
        this.dispatchEvent(new CustomEvent('midi', { detail: message }));
        //this.dispatchEvent(message.constructor(message.type, message));
        //console.log("dispatched event");
    }    
    // Function to run when requestMIDIAccess is successful
    onMIDISuccess(midiAccess) {
        var inputs = midiAccess.inputs;
        var outputs = midiAccess.outputs;
    
        // Attach MIDI event "listeners" to each input
        for (var input of midiAccess.inputs.values()) {
            console.log("attaching message handler to input ", input);
            input.onmidimessage = this.getMessage.bind(this);
            this.ins.push(input);
        }
        for (var output of midiAccess.outputs.values()) {
            console.log("found output ", output);
            this.outs.push(output);
        }

        midiAccess.onstatechange = this.onStateChange.bind(this);
    }
    onMIDIFailure() {
        console.log('Error: Could not access MIDI devices.');
    }
    onStateChange(e) {
        if(e.port.state == "connected" && e.port.type == "input") {
            console.log("input attached!");
            e.port.onmidimessage = this.getMessage.bind(this);
        }
    }
}

module.exports = MidiListener;
});