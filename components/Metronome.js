import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Pressable } from 'react-native';
import Sound from 'react-native-sound'
import sound1Hi from './metronome.wav'
import sound1Lo from './Perc_MetronomeQuartz_lo.wav'
import sound2Hi from './Perc_Clackhead_lo.wav'
import sound2Lo from './Perc_Clackhead_hi.wav';

import { TaskTimer } from 'tasktimer';
/*
    Metronome.js:
    Metronome component, bpm variable is passed from parent file via props

    State variables:
    setBpm: setter function to change the bpm via the props setter
    isPlaying: boolean for if the metronome is playing
    ButtonText: text displayed on the metronome

*/
// default sound, lives up here for simplicity
let tickSound = new Sound(sound1Hi, '', (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
});


function setSound(component) {
    let chosenTickSoundFile = sound1Hi;
    if ((component.props.tickSoundFile) === 1) {
        chosenTickSoundFile = sound1Hi;
        console.log(component.props.tickSoundFile);
    }
    if ((component.props.tickSoundFile) === 2) {
        chosenTickSoundFile = sound1Lo;
        console.log(component.props.tickSoundFile);
    }

    tickSound = new Sound(chosenTickSoundFile, '', (error) => {
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }
    });
}

function startStopNew(component) {
    if (component.state.ButtonText === 'Start') {
        component.setState({ isPlaying: true });
        component.setState({ ButtonText: 'Stop' });
        //set timer
        component.state.timer.interval = ((60000 / component.props.bpm));
        component.state.timer.start();
        console.log('tick');
    } else {
        component.setState({ isPlaying: false });
        component.setState({ ButtonText: 'Start' });
        //reset interval by clearing id
        component.state.timer.stop();
    }
}

function resetMetronome(component) {
    if (component.state.isPlaying) {
        component.state.timer.interval = ((60000 / component.props.bpm));
        component.state.timer.start();
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
            timer: props.timer,
            tickSoundFile: props.tickSoundFile,
        }
        Sound.setCategory('Playback', 'default'); //playback and default work for every soundtype
        setSound(this);
        this.state.timer.on('tick', () => {
            //console.log('tick count: ' + this.state.timer.tickCount);
            //console.log('elapsed time: ' + timer.time.elapsed + ' ms.');
            tickSound.play();
        });
    }
    componentDidMount() { //this runs when the component is mounted
        resetMetronome(this); //metronome starts on load-up
    }
    componentDidUpdate(prevProps) {
        if (this.props.tickSoundFile !== prevProps.tickSoundFile) // check if bpm changed, update if changed
        {
            setSound(this);
        }
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
