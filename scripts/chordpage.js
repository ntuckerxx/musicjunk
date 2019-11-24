
requirejs(["midilistener", "keyboardstate", "chordIdentifier"], function(MidiListener, KeyboardState, chordIdentifier){
    // watch for keyboard state changes.  Call "update" whenever it changes.
    var ks = new KeyboardState();
    ks.addEventListener("change", function(e) {
        update(e.detail.keystates, e.detail.knobstates, e.detail.sliderstates);
    });

    // update(): given a sparse array of keystates, e.g.
    // [,,,,,,,true,,,,true,,,true]
    // that indicates which keys are down, display the keys, comma-separated
    //
    // todo: when chordIdentifier is functional, change this to
    // pass the array of key numbers to chordIdentifier and showDisplay() the result
    function update(keystates, knobstates, sliderstates) {
        keys = [];
        $(".piano *").removeClass("pressed")
        for(var k in keystates) {
            var keySelector = `.key${k%12}`
            $(keySelector).addClass("pressed");
            keys.push(k);
        }
        // console.log("identifying chord result: ", chordIdentifier.identifyChord(keys));
        //just for fun, change the size and color of the text according to knobs and sliders
        changeStyle(knobstates[0], sliderstates[0], sliderstates[1], sliderstates[2]);
        if(keys.length == 0) {
            showDisplay("--");
        } else {
            var possibleChords = chordIdentifier.identifyChord(keys);
            showDisplay(possibleChords.join(", "));
        }
    }

    // set the inner html of the element with selector ".displayText" to 'str'
    function showDisplay(str) {
        $(".displayText").html(str)
    }
    // change the size and color of the display text
    function changeStyle(sizeval, r, g, b) {
        sizeFactor = (sizeval + 10) / 32;
        $(".displayText").css("font-size", (sizeFactor*100) + "%");
        $(".displayText").css("color", `rgb(${r*2},${g*2},${b*2})`);
    }
});

