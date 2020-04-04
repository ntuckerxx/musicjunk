
function removeDuplicates(someArray) {
    result = [];
    for (var i in someArray) {
        if (!(result.includes(someArray[i]))) {
            result.push(someArray[i]);
        }
    }
    return result;
}

function getMelodyNote(inputArray) {
    let melodyNote = inputArray[inputArray.length-1];
    return melodyNote;
};

function getNoteName(n) {
    return noteLetters[n % 12];
};


function addToTree(intervalArray, chordQuality, offset) {
    var node = chordTree;
    let i = 0;
    for (i=0; i<intervalArray.length; i+=1) {
        var nextInterval = intervalArray[i];
        // console.log("nextInterval: ", nextInterval);
        if (!node.children) {
            node.children = {};
        }
        if (!node.children[nextInterval]) {
            node.children[nextInterval] = {};
        }
        node = node.children[nextInterval];          
        // console.log("current node: ", node);

    }
    
    if (node.chordQuality) {
        // console.log("node.chordQuality = true");
        // console.log("node.chordQuality: ", node.chordQuality);
        if (Array.isArray(node.chordQuality)) {
            // console.log("node.chordQuality is an array");
            if (offset) {
                node.chordQuality.push({"name": chordQuality, "rootOffset": offset});
            } else {
                node.chordQuality.push(chordQuality);
            }
        } else if (typeof(node.chordQuality === "string")) {
            // console.log("node.chordQuality is a string");
            let existingChordQuality = node.chordQuality;
            node.chordQuality = [];
            node.chordQuality.push(existingChordQuality);
            if (offset) {
                node.chordQuality.push({"name": chordQuality, "rootOffset": offset});
            } else {
                node.chordQuality.push(chordQuality);
            }
        }
    } else {
        console.log("creating new chordQuality where non existed before.");
        if (offset) {
            node.chordQuality = {"name": chordQuality, "rootOffset": offset};
        } else {
            node.chordQuality = chordQuality;
        }
    }
    console.log("HERE IS YOUR NEW CHORD TREE: const chordTree = ", JSON.stringify(chordTree, null, "    "), chordTree);
    
    return chordTree;
};


function identifyChord(inputArray) {
    

    extendedArray = removeDuplicates(inputArray.map(x => x%12)).sort(function(a,b){return a-b});


    // console.log("inputArray = ", inputArray)
    // console.log("extendedArray = ", extendedArray);
    let numSlices = extendedArray.length;
    

    for (i=0; i<inputArray.length-1; i++) {
        let newNote = extendedArray[i] + 12;
        extendedArray.push(newNote);
    }



    // console.log("extendedArray = ", extendedArray);
    
    let intervalArray = [];
    for (i=0; i<(extendedArray.length-1); i++) {
        intervalArray.push(extendedArray[i+1] - extendedArray[i])
    }
    
    let treeRoutes = [];
    for (i=0; i<(numSlices); i++) {
        treeRoutes[i] = intervalArray.slice(i, (numSlices-1+i));
    }
    // console.log("treeRoutes: ", treeRoutes);

    results = [];
    for (var i in treeRoutes) {
        // console.log("traversing route: ", treeRoutes[i]);
        result = traverseTree(treeRoutes[i]);
        // console.log("current result: ", result);
        if (result) {
            var firstNote = extendedArray[i];
            var qualities = getChordQualities(result.chordQuality);
            // console.log("qualities: ", qualities);
            for (var j in qualities) {
                var rootNote;
                if (qualities[j].rootOffset) {
                    rootNote = firstNote + qualities[j].rootOffset;
                } else {
                    rootNote = firstNote;
                }                
                // console.log("rootNote: ", rootNote);
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
            chordQuality: {"name": "minor 2nd", interval: true},
            children: {
                // major 2nd
                2: {
                    chordQuality: "min/add♭9",
                    children: {
                        // major 3rd
                        4: {
                            chordQuality: "min/add♭9"
                        }
                    }
                },
                // minor 3rd
                3: {
                    chordQuality: [
                        "add♭9",
                        {"name": "add♯9", rootOffset: 9},
                    ],
                    children: {
                        // major 2nd
                        2: {
                            chordQuality: "♭9/♯11",
                            children: {
                                // minor 2nd
                                1: {
                                    chordQuality: "9/♯11"
                                }
                            }
                        }
                    }
                },
                // major 3rd
                4: {
                    chordQuality: "sus4/♭9",
                    children: {
                        // major 2nd
                        2: {
                            chordQuality: "sus4/♭9"
                        }
                    }
                },
                // tritone
                6: {
                    chordQuality: "5/add♭9"
                }
            }
        },
        // major 2nd
        2: {
            chordQuality : {"name": "major 2nd", interval: true},
            children: {
                // minor 2nd
                1: {
                    chordQuality: "min/add9",
                    children: {
                        // major 3rd
                        4: {
                            chordQuality: "min/add9"
                        },
                        // tritone
                        6: {
                            chordQuality: "min6/9"
                        }
                    }
                },
                // major 2nd
                2: {
                    chordQuality: "/add9",
                    children: {
                        // major 2nd
                        2: {
                            chordQuality: "9/♯11",
                            children: {
                                // minor 2nd
                                1: {
                                    chordQuality: "9/♯11"
                                }
                            }
                        },
                        // minor 3rd
                        3: {
                            chordQuality: [
                                "add9",
                                {"name": "min7/add11", "rootOffset": 9}
                            ],
                            children: {
                                // major 2nd
                                2: {
                                    chordQuality: "6/9"
                                },
                                // minor 3rd
                                3: {
                                    chordQuality: "9"
                                },
                                // major 3rd
                                4: {
                                    chordQuality: "maj9"
                                }
                            }
                        },
                        // major 3rd
                        4: {
                            chordQuality: "aug9"
                        },
                        // tritone
                        6: {
                            chordQuality: "9"
                        },
                        // perfect 5th
                        7: {
                            chordQuality: "maj7/9"
                        }
                    }
                },
                // perfect 4th
                5: {
                    chordQuality: "sus2"
                }
            }
        },
        // minor 3rd
        3: {
            chordQuality: {"name": "minor 3rd", interval: true},
            children: {
                // minor 2nd
                1: {
                    chordQuality: "♯9",
                    children: {
                        // minor 3rd
                        3: {
                            chordQuality: "♯9",
                            children: {
                                // minor 3rd
                                3: {
                                    chordQuality: "7/♯9"
                                }
                            }
                        },
                        // triton
                        6: {
                            chordQuality: "7/♯9"
                        }
                    }
                },
                // major 2nd
                2: {
                    chordQuality: "min/add11",
                    children: {
                        // major 2nd
                        2: {
                            chordQuality: "min/add11"
                        }
                    }
                },
                // minor 3rd
                3: {
                    chordQuality: [
                        "dim",
                        {name: "7", rootOffset: 8}
                    ],
                    children: {
                        // minor 2nd
                        1: {
                            chordQuality: "min/♯11"
                        },
                        // minor 3rd
                        3: {
                            chordQuality: "dim7"
                        },
                        // major 3rd
                        4: {
                            chordQuality: "min7/♭5"
                        }
                    }    
                },
                // major 3rd
                4: {
                    chordQuality: "minor",
                    children: {
                        // minor 2nd
                        1: {
                            chordQuality: "min/♭13"
                        },
                        // major 2nd
                        2: {
                            chordQuality: "min6"
                        },
                        // minor 3rd
                        3: {
                            chordQuality: "min7"
                        },
                        // major 3rd
                        4: {
                            chordQuality: "min/maj7"
                        }
                    }
                },
                // perfect 4th
                5: {
                    chordQuality: "min/♭13"
                },
                // tritone
                6: {
                    chordQuality: ["min6", "dim7"]
                },
                // perfect 5th
                7: {
                    chordQuality: ["m7", "min7/♭5"]
                }
            }
        },
        // major 3rd
        4: {
            chordQuality: {"name": "major 3rd", interval: true},
            children: {
                // major 2nd
                2: {
                    chordQuality: "♭5",
                    children: {
                        // minor 2nd
                        1: {
                            chordQuality: "♯11",
                            children: {
                                // minor 3rd
                                3: {
                                    chordQuality: "7/♯11"
                                },
                                // major 3rd
                                4: {
                                    chordQuality: "maj7/♯11"
                                }
                            }
                        },
                        // major 3rd
                        4: {
                            chordQuality: "7/♭5"
                        },
                        // perfect 4th (augmented 3rd)
                        5: {
                            chordQuality: "maj7/♭5" 
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
                            chordQuality: "6",
                            children: {
                                // minor 2nd
                                1: {
                                    chordQuality: "7/add13"
                                }
                            }
                        },
                        // minor 2nd
                        1: {
                            chordQuality: "♭13"
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
                        },
                        // minor 3rd
                        3: {
                            chordQuality: "aug/maj7"
                        }
                    }
                },
                // perfect 4th
                5: {
                    chordQuality: "6",
                    children: {
                        // minor 2nd
                        1: {
                            chordQuality: "7/add13"
                        }
                    }
                },
                // tritone
                6: {
                    chordQuality: "7"
                },
                // perfect 5th
                7: {
                    chordQuality: "maj7"
                }
            }
        },
        // perfect 4th
        5: {
            chordQuality: {"name": "perfect 4th", interval: true},
            children: {
                // minor 2nd
                1: {
                    children: {
                        // minor 2nd
                        1: {
                            chordQuality: "♯11/sus4"
                        }
                    }
                },
                // major 2nd
                2: {
                    chordQuality: "sus4"
                },
                // perfect 4th
                5: {
                    chordQuality: "7/sus4"
                },
                // tritone
                6: {
                    chordQuality: "maj7/sus4"
                },
                // perfect 5th
                7: {
                    chordQuality: "sus4"
                }
            }
        },
        // triton
        6: {
            chordQuality: [
                {"name": "tritone", interval: true},
                {"name": "maj7/sus4", "rootOffset": 7},
                {"name": "7", "rootOffset": 2}
            ],
            children: {
                // minor 2nd
                1: {
                    chordQuality: "5/♯11"
                }
            }
        },
        // perfect 5th
        7: {
            chordQuality: {"name": "perfect 5th", interval: true},
            children: {
                // minor 3rd
                3: {
                    chordQuality: "5/7"
                },
                // major 3rd
                4: {
                    chordQuality: "5/maj7"
                }
            }
        },
        // minor 6th
        8: {
            chordQuality: {"name": "minor 6th", interval: true}
        },
        // major 6th
        9: {
            chordQuality: {"name": "major 6th", interval: true}
        },
        // minor 7th
        10: {
            chordQuality: [
                {name: "minor 7th", interval: true},
                {name: "7"}
            ]
        },
        // major 7th
        11: {
            chordQuality: [
                {name: "major 7th", interval: true},
                {name: "maj7"}
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


module.exports = {
    identifyChord: identifyChord,
    traverseTree: traverseTree,
    getNoteName: getNoteName,
    addToTree: addToTree
};