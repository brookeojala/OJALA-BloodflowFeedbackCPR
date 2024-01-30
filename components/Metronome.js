import React, { Component, useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Sound from 'react-native-sound'
import tick from './metronome.wav'

//var Sound = require('react-native-sound');


export default class Metronome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bpm: '110',
            isPlaying: 'false',
            ButtonText: 'Start'
        }
        // const [isPlaying, setIsPlaying] = useState(true);
        // const [bpm, setBpm] = useState(110);


        Sound.setCategory('Playback');
        this.tick = new Sound('./metronome.wav', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            //loaded sucessfully
            console.log('duration in seconds: ' + tick.getDuration() + 'number of seconds');

            //play the sound with an onEnd callback
            this.tick.play(success => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });
    }

    // handleBpmChange = event => {
    //     const bpm = event.target.value;
    //     this.setState([bpm]);
    // }
    startStop() {
        console.log();
        this.setState({ isPlaying: !isPlaying });
        if (this.state.isPlaying) {
            this.state.ButtonText = "Stop";
        } else {
            this.state.ButtonText = "Start";
        }



        // this.tick.play(success => {
        //     if (success) {
        //         console.log('successfully finished playing');
        //     } else {
        //         console.log('playback failed due to audio decoding errors');
        //     }
        // });
    }

    render() {




        // const { playing, bpm } = this.state;


        return (
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
                <Pressable onPress={this.state.startStop}>
                    <Text style={styles.metronomeText}>
                        {this.state.ButtonText}
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
