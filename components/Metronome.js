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
        //create rate of tickSound by setting the intervals of pause
        var id = setInterval(() => { tickSound.play() }, 60000 / component.props.bpm);
        //interval is stored as id
        component.setState({ soundID: id });
    } else {
        component.setState({ isPlaying: false });
        component.setState({ timer: 0 });
        component.setState({ ButtonText: 'Start' });
        //reset interval by clearing id
        clearInterval(component.state.soundID);
    }
}

function resetMetronome(component) {
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
            isPlaying: false,
            ButtonText: 'Start',
            timer: 0,
            started: false
        }
        Sound.setCategory('Playback', 'default'); //playback and default work for every soundtype
    }

    // tick(deltaT) {
    //     if (this.state.isPlaying) {
    //         this.state.timer -= deltaT;
    //         //this.setState({ timer: this.state.timer - deltaT }); // ms
    //         if (this.state.timer <= 0) {
    //             tickSound.play();
    //             // console.log("played");
    //             this.state.timer += 60000 / this.props.bpm;
    //             //this.setState({ timer: this.state.timer + 60000 / this.props.bpm }); // add ms per beat
    //         }
    //     }
    // }

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
        //display: 'flex',
        //flexDirection: 'row',
        textAlign: 'center',
        alignItems: 'center',
        width: 300,
        backgroundColor: 'white',
        marginHorizontal: 40,
        borderRadius: 12,
        //flexDirection: 'row',
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
