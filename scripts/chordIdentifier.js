define(function(require, exports, module) {
    function removeDuplicates(someArray) {
        result = [];
        for (var i in someArray) {
            if (!(result.includes(someArray[i]))) {
                result.push(someArray[i]);
            }
        }
        return result;
    }
    
    function identifyChord(inputArray) {
        extendedArray = removeDuplicates(inputArray.map(x => x%12)).sort(function(a,b){return a-b});
    
    
        console.log("inputArray = ", inputArray)
        console.log("extendedArray = ", extendedArray);
        let numSlices = extendedArray.length;
        
    
        for (i=0; i<inputArray.length-1; i++) {
            let newNote = extendedArray[i] + 12;
            extendedArray.push(newNote);
        }
    
    
    
        console.log("extendedArray = ", extendedArray);
        
        let intervalArray = [];
        for (i=0; i<(extendedArray.length-1); i++) {
            intervalArray.push(extendedArray[i+1] - extendedArray[i])
        }
        
        let treeRoutes = [];
        for (i=0; i<(numSlices); i++) {
            treeRoutes[i] = intervalArray.slice(i, (numSlices-1+i));
        }
        console.log("treeRoutes: ", treeRoutes);
    
        results = [];
        for (var i in treeRoutes) {
            console.log("traversing route: ", treeRoutes[i]);
            result = traverseTree(treeRoutes[i]);
            console.log("current result: ", result);
            if (result) {
                var firstNote = extendedArray[i];
                var qualities = getChordQualities(result.chordQuality);
                console.log("qualities: ", qualities);
                for (var j in qualities) {
                    var rootNote;        
                    if (qualities[j].rootOffset) {
                        rootNote = firstNote + qualities[j].rootOffset;
                    } else {
                        rootNote = firstNote;
                    }                
                    console.log("rootNote: ", rootNote);
                    var letter = noteLetters[rootNote % 12];
                    var quality = qualities[j].name;
                    var maybeSpace = qualities[j].interval ? " " : "";
                    results.push({"chordQuality": quality, "rootNote": letter, "description": letter+maybeSpace+quality});
                }
            }
        }
        return results;
    };
    
    const noteLetters = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
    
    
    function getChordQualities(entry) {
        result = [];
        if (!(entry instanceof Array)) {
            entry = [entry];
        }
        
        for (var i in entry) {
            if (typeof entry[i] === "string") {
                result.push({"name": entry[i], "rootOffset": 0});
            }
            else {
                result.push(entry[i]);
            }
        }
        return result
    }
    
    
    module.exports = {
        identifyChord: identifyChord,
        traverseTree: traverseTree
    };
    
    
    function sortNotes(notesArray) {
        let result = [];
        for (var num in array) {
            while (num > 12) {
                num = num-12;
            }
            var included = result.includes(num)
            if (!included) {
                result.push(num);
            }
        }
        result.sort()
        return result;
    };
    
    
    
    const chordTree = {
        children: {
            // minor 2nd
            1: {
                chordQuality: {"name": "minor 2nd", "interval": true},
                children: {
                    // minor 3rd
                    3: {
                        chordQuality: "#9",
                        // addb9 if root is bottom note (root, b9, 3rd)                         <--- should probably be default
                        // minMaj7 if second note is root (major 7th, root, minor 3rd)
                        // #9 if missing root note (#11, 3rd, 5th)
                    }
                }
            },
            // major 2nd
            2: {
                chordQuality : {"name": "major 2nd", "interval": true},
                children: {
                    // minor 2nd
                    1: {
                        chordQuality: "min-add9",
                        children: {
                            // major 3rd
                            3: {
                                chordQuality: "min-add9"
                            }
                        }
                    },
                    // major 2nd
                    2: {
                        chordQuality: "add9",
                        children: {
                            // minor 3rd
                            3: {
                                chordQuality: [
                                    "add9",
                                    {"name": "min7add11", "rootOffset": 9}
                                ] // min7add11 if it's missing it's root note (3rd, 11th, 5th, minor 7th)
                            }
                        }
                    }
                }
            },
            // minor 3rd
            3: {
                chordQuality: {"name": "minor 3rd", "interval": true},
                children: {
                    // minor 3rd
                    3: {
                        chordQuality: "dim",
                        children: {
                            // minor 2nd
                            1: {
                                chordQuality: "min#11"
                            },
                            // minor 3rd
                            3: {
                                chordQuality: "dim7"
                            },
                            // major 3rd
                            4: {
                                chordQuality: "min7b5"
                            }
                        }    
                    },
                    // major 3rd
                    4: {
                        chordQuality: "minor",
                        children: {
                            2: {
                                chordQuality: "min6"
                            },
                            // minor 3rd
                            3: {
                                chordQuality: "min7"
                            }
                        }
                    }
                },
            },
            // major 3rd
            4: {
                chordQuality: {"name": "major 3rd", "interval": true},
                children: {
                    // major 2nd
                    2: {
                        chordQuality: "b5",
                        children: {
                            // minor 2nd
                            1: {
                                chordQuality: "#11"
                            },
                            // major 3rd
                            4: {
                                chordQuality: "7b5"
                            },
                            // perfect 4th (augmented 3rd)
                            5: {
                                chordQuality: "maj7b5" 
                            }
                        }
                    },
                    // minor 3rd
                    3: {
                        chordQuality: "major",
                        children: {
                            // major 3rd
                            4: {
                                chordQuality: "maj7",
                                children: {
                                    // 
                                }
                            },
                            // minor 3rd
                            3: {
                                chordQuality: "7"
                            },
                            // major 2nd
                            2: {
                                chordQuality: "6"
                            },
                            // minor 2nd
                            1: {
                                chordQuality: "b13"
                            }
                        }
                    },
                    // major 3rd
                    4: {
                        chordQuality: "aug",
                        children: {
                            // major 2nd
                            2: {
                                chordQuality: "aug7"
                            }
                        }
                    },
                    // perfect 5th
                    7: {
                        chordQuality: "maj7"
                    }
                }
            },
            // perfect 4th
            5: {
                chordQuality: {"name": "perfect 4th", "interval": true},
                children: {
                    // minor 2nd
                    1: {
                        children: {
                            // minor 2nd
                            1: {
                                chordQuality: "#11sus4"
                            }
                        }
                    },
                    // tritone
                    6: {
                        chordQuality: "maj7sus4"
                    }
                }
            },
            // triton
            6: {
                chordQuality: [
                    {"name": "tritone", "interval": true},
                    {"name": "maj7sus4", "rootOffset": 7},
                    {"name": "7", "rootOffset": 2}
                ]
            }
        }
    };
    
    
    
    function traverseTree(intervalArray) {
        return traverseTree_r(intervalArray, chordTree);
    };
    
    
    function traverseTree_r(intervalArray, subTree) {
        let nextInterval = intervalArray[0];
        let remainingIntervals = intervalArray.slice(1);
        let childTree = subTree.children && subTree.children[nextInterval];
        if (!childTree) {
            return null;
        }
        if (remainingIntervals.length > 0) {
            return traverseTree_r(remainingIntervals, childTree);
        }
        else {
            if (childTree.chordQuality) {
                return childTree;
            } else {
                return null;
            }
        }
    };
});