import React, { Component, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Pressable } from 'react-native';
import Sound from 'react-native-sound'
import tickSoundFile from './metronome.wav'
/*
    Metronome.js:
    Metronome component, bpm variable is passed from parent file via props

    State variables:
    setBpm: setter function to change the bpm via the props setter
    isPlaying: boolean for if the metronome is playing
    ButtonText: text displayed on the metronome

*/
// var tickSound = new Sound(tickSoundFile, '', (error) => {
//     if (error) {
//         console.log('failed to load the sound', error);
//         return;
//     }
//     // loaded successfully
//     console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

//     // Play the sound with an onEnd callback
//     tickSound.play((success) => {
//         if (success) {
//             console.log('successfully finished playing');
//         } else {
//             console.log('playback failed due to audio decoding errors');
//         }
//     });
// });
var tickSound = new Sound(tickSoundFile, '', (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
});

async function startStop(component) {
    // console.log('click');

    if (component.state.ButtonText === 'Start') {
        component.setState({ isPlaying: true });
        component.setState({ ButtonText: 'Stop' });
        //create rate of tickSound by setting the intervals of pause
        var id = setInterval(() => { tickSound.play() }, ((60000 / component.props.bpm))) //((60000 / component.props.bpm) * 0.035))
        console.log('tick');
        //interval is stored as id
        component.setState({ soundID: id });
    } else {
        component.setState({ isPlaying: false });
        component.setState({ ButtonText: 'Start' });
        //reset interval by clearing id
        clearInterval(component.state.soundID);
    }
}

async function resetMetronome(component) {
    if (component.state.isPlaying) {
        clearInterval(component.state.soundID);
        var id = setInterval(() => { tickSound.play() }, 60000 / component.props.bpm);
        component.setState({ soundID: id });
    }
}

function increaseBpm(component) {
    //set new bpm
    var newBPM = component.props.bpm + 1;
    component.state.setBpm(newBPM);
    //reset rate of tickSound
    resetMetronome(component);

}
function decreaseBpm(component) {
    var newBPM = component.props.bpm - 1;
    if (newBPM >= 1) {
        //set new bpm if above 1
        component.state.setBpm(newBPM);
        //reset rate of tick sound
        resetMetronome(component);
    }
}
export default class Metronome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setBpm: props.setBpm,
            isPlaying: true,
            ButtonText: 'Stop',
        }
        Sound.setCategory('Playback', 'default'); //playback and default work for every soundtype
    }
    componentDidMount() { //this runs when the component is mounted
        resetMetronome(this); //metronome starts on load-up
    }

    render() {


        return (

            <View style={styles.metronome}>
                <View>
                    <Text style={styles.metronomeText}>
                        {this.props.bpm} BPM
                    </Text>

                </View>
                <View style={styles.selector}>
                    <Pressable onPress={() => {
                        console.log(' - button clicked');
                        return decreaseBpm(this);
                    }} style={styles.buttons}>

                        <Text style={styles.plusMinus}>
                            -
                        </Text>

                    </Pressable>

                    <Pressable onPress={() => {
                        console.log('start/stop button clicked');
                        return startStop(this);
                    }}
                        style={styles.buttons}>

                        <Text style={styles.metronomeText}>
                            {this.state.ButtonText}
                        </Text>
                    </Pressable>

                    <Pressable onPress={() => {
                        console.log('+ button clicked');
                        return increaseBpm(this);
                    }} style={styles.buttons}>

                        <Text style={styles.plusMinus}>
                            +
                        </Text>

                    </Pressable>
                </View>

            </View>

        )
    }
}
const styles = StyleSheet.create({
    metronome: {
        textAlign: 'center',
        alignItems: 'center',
        width: 300,
        backgroundColor: 'white',
        marginHorizontal: 40,
        borderRadius: 12,
    },
    buttons: {
        //backgroundColor: 'red', // for debug
        marginHorizontal: 30
    },
    metronomeText: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    selector: {
        flexDirection: 'row',
    },
    plusMinus: {
        fontSize: 30,
        fontWeight: 'bold',
    }
})
