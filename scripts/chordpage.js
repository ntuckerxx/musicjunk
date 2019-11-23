
requirejs(["midilistener", "keyboardstate"], function(MidiListener, KeyboardState){
    // watch for keyboard state changes.  Call "update" whenever it changes.
    var ks = new KeyboardState();
    ks.addEventListener("change", function(e) {
        update(e.detail.keystates);
    });

    // update(): given a sparse array of keystates, e.g.
    // [,,,,,,,true,,,,true,,,true]
    // that indicates which keys are down, display the keys, comma-separated
    //
    // todo: when chordIdentifier is functional, change this to
    // pass the array of key numbers to chordIdentifier and showDisplay() the result
    function update(keystates) {
        keys = [];
        for(var k in keystates) {
            keys.push(k);
        }
        if(keys.length == 0) {
            showDisplay("--");
        } else {
            showDisplay(keys.join(", "));
        }
    }

    // set the inner html of the element with selector ".display" to 'str'
    function showDisplay(str) {
        $(".display").html(str)
    }
});

