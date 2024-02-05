import React, { Component, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Pressable } from 'react-native';
import Sound from 'react-native-sound'
import tickSound from './metronome.wav'

var tick = new Sound(tickSound, '', (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
});
async function looping(isLooping) {

    (async () => {
        while (isLooping) {
            setTimeout(tick.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            }), 100);
        }
    })();
    //tick.stop();
}
function startStop(component) {
    console.log('click');
    //component.setState({ isPlaying: !isPlaying });

    if (component.state.ButtonText === 'Start') {
        component.setState({ ButtonText: 'Stop' });
        //tick.setNumberOfLoops(-1);
        looping(true);

    } else {
        component.setState({ ButtonText: 'Start' });
        looping(false);
        //tick.stop();
    }




    // this.tick.play(success => {
    //     if (success) {
    //         console.log('successfully finished playing');
    //     } else {
    //         console.log('playback failed due to audio decoding errors');
    //     }
    // });
}

export default class Metronome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bpm: '110',
            //isPlaying: 'false',
            ButtonText: 'Start'
        }
        Sound.setCategory('Playback', 'default'); //playback and default work for every soundtype
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
