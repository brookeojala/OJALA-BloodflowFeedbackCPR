import React, { Component, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Pressable } from 'react-native';
import Sound from 'react-native-sound'
import tickSoundFile from './metronome.wav'

var tickSound = new Sound(tickSoundFile, '', (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
});

function startStop(component) {
    // console.log('click');

    if (component.state.ButtonText === 'Start') {
        component.setState({ isPlaying: true });
        component.setState({ timer: 0 });
        component.setState({ ButtonText: 'Stop' });
        var id = setInterval(() => { tickSound.play() }, 60000 / component.state.bpm);
        component.setState({ soundID: id });
    } else {
        component.setState({ isPlaying: false });
        component.setState({ timer: 0 });
        component.setState({ ButtonText: 'Start' });
        clearInterval(component.state.soundID);
    }
}

export default class Metronome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bpm: 110,
            isPlaying: false,
            ButtonText: 'Start',
            timer: 0,
            started: false
        }
        Sound.setCategory('Playback', 'default'); //playback and default work for every soundtype
        // var obj = this;
        // var id = setInterval(() => { obj.tick(1) }, 1);
    }

    tick(deltaT) {
        if (this.state.isPlaying) {
            this.state.timer -= deltaT;
            //this.setState({ timer: this.state.timer - deltaT }); // ms
            if (this.state.timer <= 0) {
                tickSound.play();
                // console.log("played");
                this.state.timer += 60000 / this.state.bpm;
                //this.setState({ timer: this.state.timer + 60000 / this.state.bpm }); // add ms per beat
            }
        }
    }

    // handleBpmChange = event => {
    //     const bpm = event.target.value;
    //     this.setState([bpm]);
    // }


    render() {


        return (
            <Pressable onPress={() => {
                console.log('button clicked');
                return startStop(this);

            }} style={styles.metronome}>
                <View style={styles.metronome}>
                    <View>
                        <Text style={styles.metronomeText}>{this.state.bpm} BPM</Text>
                        {/* <input
                        type='range'
                        min='100'
                        max='240'
                        value={bpm}
                        onChange={this.handleBpmChange} /> */}
                    </View>

                    <Text style={styles.metronomeText}>
                        {this.state.ButtonText}
                    </Text>

                </View>
            </Pressable>
        )
    }
}
const styles = StyleSheet.create({
    metronome: {
        textAlign: 'center',
        alignItems: 'center',
        //position: 'absolute',
        width: 300,
        backgroundColor: 'white',
        marginHorizontal: 40,
        borderRadius: 12,
    },
    metronomeText: {
        fontSize: 25,
    }
})
