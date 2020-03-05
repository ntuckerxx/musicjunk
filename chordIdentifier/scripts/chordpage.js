var chordID = null;
requirejs(["midilistener", "keyboardstate", "chordIdentifier"], function(MidiListener, KeyboardState, chordIdentifier){
    // watch for keyboard state changes.  Call "update" whenever it changes.
    // watch for keyboard state changes.  Call "update" whenever it changes.
    var ks = new KeyboardState();
    ks.addEventListener("change", function(e) {
        update(e.detail.keystates, e.detail.knobstates, e.detail.sliderstates);
    });

    // find piano element with jquery
    // attach event handler to it
    $(".piano").on("click", pianoClicked);

    // handle piano being clicked:
    // return an array of keys that are being currently being pressed
    // return the note that was clicked as the chosen root note
    function pianoClicked(e) {
        
        console.log("piano clicked: ", e.target.dataset.note);
        var pressedKeys = $(".piano .pressed");
        console.log("pressedKeys: ", pressedKeys);
        var root = parseInt(e.target.dataset.note, 10);
        console.log("root: ", root);
        
        // extract values from the key events that were pushed
        // make array of numbers by pulling the ".dataset.note" value off of each pressed key
        var keyNumberValues = [];
        for (i=0; i<pressedKeys.length; i++) {
            var numberString = pressedKeys[i].dataset.note;
            var intValue = parseInt(numberString, 10);
            keyNumberValues.push(intValue);
        }
        console.log("keyNumberValues: ", keyNumberValues);
        
        // if root value exists inside keyNumberValues, rootOffset is 0.
        let rootOffsetNeeded = true;
        for (i=0; i<keyNumberValues.length; i++) {
            if (keyNumberValues[i] === root) {
                rootOffsetNeeded = false;
                console.log("keyNumberValues[i]: ", keyNumberValues[i]);
                console.log("root: ", root);
            }
        }
        console.log("rootOffsetNeeded: ", rootOffsetNeeded);

        // sort the key number values
        var sortedKeyValues = keyNumberValues.sort(function(a,b){return a-b});
        console.log("sortedKeyValues: ", sortedKeyValues);
        
        // grab chord quality from user input
        var chordQuality = prompt("Enter Chord Quality");
        console.log("chordQuality: ", chordQuality);
        
        // calculate the intervals between the sortedKeyValues
        var intervalsArray = getIntervals(sortedKeyValues, root);

        // calculate root offset if needed
        let rootOffset = 0;
        if (rootOffsetNeeded) {
            rootOffset = (root - sortedKeyValues[0]);
        }
        console.log("rootOffset: ", rootOffset);

        chordIdentifier.addToTree(intervalsArray, chordQuality, rootOffset);

    };
    



    function getIntervals(noteNumberArray, rootNumber) {
        let extendedArray = [];


        // identify index of root note
        let rootNoteIndex = noteNumberArray.indexOf(rootNumber);
        if (rootNoteIndex === -1) {
            rootNoteIndex = 0;
        }
        console.log("rootNoteIndex: ", rootNoteIndex);
        

        // append notes from root note index to end of noteNumberArray
        for (i=rootNoteIndex; i<noteNumberArray.length; i++) {
            extendedArray.push(noteNumberArray[i]);
        }
        
        // append extended values of notes that were originally below root note
        for (i=0; i<rootNoteIndex; i++) {
            extendedArray.push(noteNumberArray[i] + 12)
        }
        console.log("extendedArray: ", extendedArray);

        let result = [];

        // loop through to retrieve intervals
        for (i=0; i<extendedArray.length-1; i++) {
            result.push(extendedArray[i+1] - extendedArray[i])
        }
        console.log("result of getIntervals: ", result);
        return result;
    };

    window.getIntervals=getIntervals;

    

    chordID = chordIdentifier;
    // update(): given a sparse array of keystates, e.g.
    // [,,,,,,,true,,,,true,,,true]
    // that indicates which keys are down, display the keys, comma-separated
    //
    // todo: when chordIdentifier is functional, change this to
    // pass the array of key numbers to chordIdentifier and showDisplay() the result
    function update(keystates, knobstates, sliderstates) {
        var keys = [];
        var highestKey = undefined;
        $(".piano *").removeClass("pressed")
        for(var k in keystates) {
            highestKey = k;
            var keySelector = `.key${k%12}`
            $(keySelector).addClass("pressed");
            keys.push(k);
        }
        // console.log(JSON.stringify(keys));
        // console.log("identifying chord result: ", chordIdentifier.identifyChord(keys));
        //just for fun, change the size and color of the text according to knobs and sliders
        changeStyle(knobstates[0], sliderstates[0], sliderstates[1], sliderstates[2]);
        if(keys.length == 0) {
            clearDisplay();
        } else {
            var possibleChords = chordIdentifier.identifyChord(keys);
            displayChords(possibleChords, chordIdentifier.getNoteName(highestKey));
        }
    };


    // change the size and color of the display text
    function changeStyle(sizeval, r, g, b) {
        // sizeFactor = (sizeval + 10) / 32;
        // $(".displayText").css("font-size", (sizeFactor*100) + "%");
        $(".displayText").css("color", `rgb(${r*2},${g*2},${b*2})`);
    };

    function clearDisplay() {
        $(".display").html("--");
    };

    function displayChords(chordList, melodyNote) {
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
        var melodyNoteElement = $("<span class='melodyNote'>" + melodyNote + "</span>");
        display.append(melodyNoteElement);
    };
});

