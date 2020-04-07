const synthEndpoint = "http://localhost:8080"

// internal utility for building urls to synth endpoints
// url('/noteOn') -> "http://localhost:8080/noteOn"
function url(path) {
    return `${synthEndpoint}${path}`
}

function noteOn(channel, note, velocity) {
    return fetch(url('/noteOn'), {"method":"POST", "body":JSON.stringify({channel, note, velocity}), "mode":"no-cors"});
}

function noteOff(channel, note) {
    return fetch(url('/noteOff'), {"method":"POST", "body":JSON.stringify({channel, note}), "mode":"no-cors"});
}

function program(channel, program) {
    return fetch(url('/program'), {"method":"POST", "body":JSON.stringify({channel, program}), "mode":"no-cors"});
}

function equaltuning() {
    return tuning(0, [100,100,100,100,100,100,100,100,100,100,100,100]);
}

function badtuning() {
    return tuning(0, [90,90,90,90,90,90,90,90,90,90,90,90]);
}

function pythtuning() {
    return tuning(0, [114,90,114,90,90,114,90,114,90,114,90,90]);
}
var lastoctave = null;
var lastroot = null;
var tweaks = [];
function tuning(root, octave) {
    lastoctave = octave;
    return fetch(url('/tuning'), {"method":"POST", "body":JSON.stringify({root,octave}), "mode":"no-cors"});
}
function tweakinterval(n, val) {
    if(n <= 0 || n>11) {
        throw "bad note index to tweak";
    }
    var newoctave = lastoctave.slice();
    tweaks[n-1] = 50 * (val/127.0) - 25;
    for(var i in tweaks) {
        i = Number(i);
        if(tweaks[i] && (tweaks[i] != 0)) {
            newoctave[i] += tweaks[i];
            newoctave[i+1] -= tweaks[i];
            console.log(`tweaking ${i} and ${i+1} by ${tweaks[i]}`);
        }
    }
    console.log("tweaks: ", tweaks);
    console.log("setting new intervals: ", newoctave);
    return fetch(url('/tuning'), {"method":"POST", "body":JSON.stringify({root: 0,octave: newoctave}), "mode":"no-cors"});
}

module.exports = {
    noteOn,
    noteOff,
    tuning,
    equaltuning,
    badtuning,
    pythtuning,
    program,
    tweakinterval
};