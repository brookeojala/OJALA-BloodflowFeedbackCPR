import React, { Component, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Pressable } from 'react-native';
import Sound from 'react-native-sound'
import tickSoundFile from './metronome.wav'
import { TaskTimer } from 'tasktimer';
/*
    Metronome.js:
    Metronome component, bpm variable is passed from parent file via props

    State variables:
    setBpm: setter function to change the bpm via the props setter
    isPlaying: boolean for if the metronome is playing
    ButtonText: text displayed on the metronome

*/

const timer = new TaskTimer(60000 / 110);

timer.on('tick', () => {
    console.log('tick count: ' + timer.tickCount);
    //console.log('elapsed time: ' + timer.time.elapsed + ' ms.');
    tickSound.play();
});

function startStopNew(component) {
    if (component.state.ButtonText === 'Start') {
        component.setState({ isPlaying: true });
        component.setState({ ButtonText: 'Stop' });
        //set timer
        timer.interval = ((60000 / component.props.bpm));
        timer.start();
        console.log('tick');
        //interval is stored as id
        //component.setState({ soundID: id });
    } else {
        component.setState({ isPlaying: false });
        component.setState({ ButtonText: 'Start' });
        //reset interval by clearing id
        timer.stop();
    }
}
var tickSound = new Sound(tickSoundFile, '', (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
});

// async function startStop(component) {
//     // console.log('click');

//     if (component.state.ButtonText === 'Start') {
//         component.setState({ isPlaying: true });
//         component.setState({ ButtonText: 'Stop' });
//         //create rate of tickSound by setting the intervals of pause
//         var id = setInterval(() => { tickSound.play() }, ((60000 / component.props.bpm))) //((60000 / component.props.bpm) * 0.035))
//         console.log('tick');
//         //interval is stored as id
//         component.setState({ soundID: id });
//     } else {
//         component.setState({ isPlaying: false });
//         component.setState({ ButtonText: 'Start' });
//         //reset interval by clearing id
//         clearInterval(component.state.soundID);
//     }
// }

async function resetMetronome(component) {
    // if (component.state.isPlaying) {
    //     clearInterval(component.state.soundID);
    //     var id = setInterval(() => { tickSound.play() }, 60000 / component.props.bpm);
    //     component.setState({ soundID: id });
    // }
    if (component.state.isPlaying) {

        timer.interval = ((60000 / component.props.bpm));
        timer.start();
        // component.setState({ soundID: id });
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
                        return startStopNew(this);
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
