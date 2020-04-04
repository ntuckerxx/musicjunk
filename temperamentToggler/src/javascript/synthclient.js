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

function tune() {
    throw "not implemented yet"
}

module.exports = {
    noteOn,
    noteOff,
    tune
};