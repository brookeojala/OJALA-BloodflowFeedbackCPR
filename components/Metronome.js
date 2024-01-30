import React, { Component, useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Sound from 'react-native-sound'
import tick from './metronome.wav'

//var Sound = require('react-native-sound');


export default class Metronome extends Component {
    constructor(props) {
        super(props);


        Sound.setCategory('Playback');
        var tick = new Sound('metronome.wav', './metronome.wav', (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            //loaded sucessfully
            console.log('duration in seconds: ' + tick.getDuration() + 'number of seconds');

            //play the sound with an onEnd callback
            tick.play(success => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });
    }

    handleBpmChange = event => {
        const bpm = event.target.value;
        this.setState([bpm]);
    }
    startStop = () => {
        this.tick.play();
    }

    render() {
        const [isPlaying, setIsPlaying] = useState(true);
        const [bpm, setBpm] = useState(110);



        // const { playing, bpm } = this.state;


        return (
            <View style={styles.metronome}>
                <View>
                    <Text style={styles.metronomeText}>{bpm} BPM</Text>
                    {/* <input
                        type='range'
                        min='100'
                        max='240'
                        value={bpm}
                        onChange={this.handleBpmChange} /> */}
                </View>
                <Pressable onClick={this.startStop}>
                    <Text style={styles.metronomeText}>
                        {isPlaying ? 'Stop' : 'Start'}
                    </Text>
                </Pressable>
            </View>
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
