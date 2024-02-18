import React, { Component, useState } from 'react'
//import { Animated, View, StyleSheet } from 'react-native'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Pressable, Animated } from 'react-native';
import Sound from 'react-native-sound'
import tickSoundFile from './metronome.wav'

var tickSound = new Sound(tickSoundFile, '', (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
});
function bpmToDuration(componenet) { // converts bpm to ms per beat
    var duration = 60000 / componenet.bpm; //ms per beat
    componenet.setState({ animationDuration: (duration / 2) }); // halved for the two parts of the animation (up/down)

}

function startStop(component) {
    // console.log('click');

    if (component.state.ButtonText === 'Start') {
        component.setState({ isPlaying: true });
        component.setState({ timer: 0 });
        component.setState({ ButtonText: 'Stop' });
        //create rate of tickSound by setting the intervals of pause
        var id = setInterval(() => { tickSound.play() }, 60000 / component.state.bpm);
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
function increaseBpm(component) {
    //set new bpm
    var newBPM = component.state.bpm + 1;
    component.setState({ bpm: newBPM });
    //reset rate of tickSound
    clearInterval(component.state.soundID);
    var id = setInterval(() => { tickSound.play() }, 60000 / component.state.bpm);
    component.setState({ soundID: id });

}
function decreaseBpm(component) {
    var newBPM = component.state.bpm - 1;
    if (newBPM >= 2) {
        //set new bpm if above 2
        component.setState({ bpm: newBPM });
        //reset rate of tick sound
        clearInterval(component.state.soundID);
        var id = setInterval(() => { tickSound.play() }, 60000 / component.state.bpm);
        component.setState({ soundID: id });
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
            started: false,
            animationDuration: 273 //default animationDuration 273
        }
        Sound.setCategory('Playback', 'default'); //playback and default work for every soundtype
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
    componentDidMount() {

        //bpmToDuration(this); // set new bpm when componenet updates

        Animated.loop(

            Animated.sequence([
                Animated.timing(this.stretchAnimation, {
                    toValue: 48, //placeholder
                    duration: this.state.animationDuration,
                    useNativeDriver: false,
                }),
                Animated.timing(this.stretchAnimation, {
                    toValue: 240,
                    duration: this.state.animationDuration,
                    useNativeDriver: false,
                })
            ]),
            {
                iterations: this.props.repeat_count
            }
        ).start();

    }
    componentDidUpdate(prevProps) {
        if ((this.props.bpm !== prevProps.bpm)) // check if bpm changed
        {
            bpmToDuration(this);
            this.componentDidMount();
        }
    }

    render() {


        return (

            <View style={styles.metronome}>
                <View>
                    <Text style={styles.metronomeText}>
                        {this.state.bpm} BPM
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

                <View style={{ ...this.props.style }}>

                    <Animated.View style={{ height: this.stretchAnimation }}>
                        {this.props.children}
                    </Animated.View>

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
