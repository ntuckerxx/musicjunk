
requirejs(["midilistener", "keyboardstate", "chordIdentifier"], function(MidiListener, KeyboardState, chordIdentifier){
    // watch for keyboard state changes.  Call "update" whenever it changes.
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
        console.log(JSON.stringify(keys));
        // console.log("identifying chord result: ", chordIdentifier.identifyChord(keys));
        //just for fun, change the size and color of the text according to knobs and sliders
        changeStyle(knobstates[0], sliderstates[0], sliderstates[1], sliderstates[2]);
        if(keys.length == 0) {
            showDisplay("--");
        } else {
            var possibleChords = chordIdentifier.identifyChord(keys);
            displayChords(possibleChords);
        }
    }

    // set the inner html of the element with selector ".displayText" to 'str'
    function showDisplay(str) {
        $(".displayText").html()
    };
    
    // change the size and color of the display text
    function changeStyle(sizeval, r, g, b) {
        // sizeFactor = (sizeval + 10) / 32;
        // $(".displayText").css("font-size", (sizeFactor*100) + "%");
        $(".displayText").css("color", `rgb(${r*2},${g*2},${b*2})`);
    };

    function displayChords(chordList) {
        // delete child elemenst from the element with class "display"
        var display = $(".display");
        display.empty();
        // for each item in chord list:
            // create an item of class "rootNote" amd a class of "chordQuality"
            // append those two items to the display element
        for (var i in chordList) {
            var rootNote = $("<span class='noteLetter'>" + chordList[i].rootNote + "</span>");
            var chordQuality = $("<span class='chordQuality'>" + chordList[i].chordQuality + "</span>");
            display.append($("<div>").append(rootNote, chordQuality));
        }
    };
});

