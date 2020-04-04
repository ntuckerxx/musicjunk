package main

import (
	"fmt"

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

type tuning struct {
	id     fluidsynth.TuningId
	name   string
	values [128]float64
}

func main() {

	fmt.Printf("creating settings\n")
	settings := fluidsynth.NewSettings()
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
	r.Run() // listen and serve on 0.0.0.0:8080
}
