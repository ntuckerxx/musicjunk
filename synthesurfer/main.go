package main

import (
	"fmt"
	"log"

	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sqweek/fluidsynth"
)

const audioFrequency = 44100
const soundfontPath = "/Users/ntucker/Downloads/Nice-Keys-Ultimate-V2.3.sf2"

type note struct {
	Channel  uint8 `json:"channel"`
	Note     uint8 `json:"note"`
	Velocity uint8 `json:"velocity"`
}

type tuningParams struct {
	Root   int         `json:"root"`
	Octave [12]float64 `json:"octave"`
}

type programParams struct {
	Channel uint8 `json:"channel"`
	Program uint8 `json:"program"`
}

type tuning struct {
	id     fluidsynth.TuningId
	name   string
	values [128]float64
}

func setTuning(synth fluidsynth.Synth, t tuningParams) error {
	tid := fluidsynth.TuningId{Bank: 0, Program: 0}
	var values [128]float64

	for i := 0; i < 128; i++ {
		if i > 0 {
			interval := t.Octave[(i-1)%12]
			values[i] = values[i-1] + interval
		} else {
			values[i] = 0
		}
	}

	log.Printf("Activating key tuning: %#v", values)
	result := synth.ActivateKeyTuning(tid, "surftuning", values, true)
	if result != 0 {
		return fmt.Errorf("Failed to activate key tuning: %d", result)
	}
	synth.ActivateTuning(0, tid, true)

	return nil
}

func main() {

	fmt.Printf("creating settings\n")
	settings := fluidsynth.NewSettings()
	settings.SetNum("synth.gain", float64(0.7))
	settings.SetNum("synth.sample-rate", float64(audioFrequency)) // this should match your openAL config
	// customise more settings here if you like; see "FluidSettings" in the documentation for a full list
	fmt.Printf("starting fluidsynth\n")
	synth := fluidsynth.NewSynth(settings)
	fmt.Printf("loading soundfont\n")
	soundfontID := synth.SFLoad(soundfontPath, true)
	fmt.Printf("loaded soundfont: %v\n", soundfontID)
	driver := fluidsynth.NewAudioDriver(settings, synth)
	fmt.Printf("created audio driver: %v\n", driver)

	r := gin.Default()
	r.POST("/noteOn", func(c *gin.Context) {
		var json note
		if err := c.ShouldBindJSON(&json); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		synth.NoteOn(json.Channel, json.Note, json.Velocity)
		resultItem := gin.H{"message": "ok"}
		c.JSON(200, resultItem)
	})
	r.POST("/noteOff", func(c *gin.Context) {
		var json note
		if err := c.ShouldBindJSON(&json); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		synth.NoteOff(json.Channel, json.Note)
		resultItem := gin.H{"message": "ok"}
		c.JSON(200, resultItem)
	})
	r.POST("/program", func(c *gin.Context) {
		var j programParams
		if err := c.ShouldBindJSON(&j); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		synth.ProgramChange(j.Channel, j.Program)
		resultItem := gin.H{"message": "ok"}
		c.JSON(200, resultItem)
	})
	r.POST("/tuning", func(c *gin.Context) {
		var json tuningParams
		if err := c.ShouldBindJSON(&json); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		resultItem := gin.H{}
		resultCode := 200
		err := setTuning(synth, json)
		if err != nil {
			resultCode = 500
			resultItem["error"] = err.Error()
		} else {
			resultItem["message"] = "ok"
		}
		c.JSON(resultCode, resultItem)
	})

	r.Run() // listen and serve on 0.0.0.0:8080
}
