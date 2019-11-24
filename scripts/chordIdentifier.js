define(function(require, exports, module) {

function identifyChord(inputArray) {
    extendedArray = inputArray.map(x => x%12).sort(function(a,b){return a-b});
    
    console.log("inputArray = ", inputArray)
    console.log("extendedArray = ", extendedArray);

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
    let numSlices = intervalArray.length-1;
    for (i=0; i<(numSlices); i++) {
        treeRoutes[i] = intervalArray.slice(i, (inputArray.length-1+i));
    }
    console.log("treeRoutes: ", treeRoutes);

    results = [];
    for (var i in treeRoutes) {
        console.log("traversing route: ", treeRoutes[i]);
        result = traverseTree(treeRoutes[i]);
        console.log("current result: ", result);
        if (result) {
            results.push(result.chordQuality);
        }
    }
    return results;
};

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
            intervalName: "minor 2nd",
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
            intervalName : "major 2nd",
            children: {
                // major 2nd
                2: {
                    chordQuality: "add9",
                    children: {
                        // minor 3rd
                        3: {
                            chordQuality: ["add9", "min7add11"] // min7add11 if it's missing it's root note (3rd, 11th, 5th, minor 7th)
                        }
                    }
                }
            }
        },
        // minor 3rd
        3: {
            intervalName: "minor 3rd",
            children: {
                // minor 3rd
                3: {
                    chordQuality: "dim",
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
                },
                // major 3rd
                4: {
                    chordQuality: "minor"
                }
            },
        },
        // major 3rd
        4: {
            intervalName: "major 3rd",
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
                            chordQualtiy: "7b5"
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
            intervalName: "perfect 4th",
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