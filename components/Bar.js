import { Animated, View } from 'react-native'
import React, { Component } from 'react'
//import metronone from './metronome.wav'
import Sound from 'react-native-sound'
//import MetronomeModule from "react-native-metronome-module";

export default class Bar extends Component {
    constructor(props) {
        super(props);
        this.stretchAnimation = new Animated.Value(240);
        // this.start = {
        //     playing: true,
        //     count: 0,
        //     bpm: 110,
        //     beatsPerMeasure: 4,
        // }
        // this.metronone = new Sound(metronone);
    }
    // startStop = () => {
    //     if (this.state.playing) {
    //         // Stop the timer
    //         clearInterval(this.timer);
    //         this.setState({
    //             playing: false
    //         });
    //     } else {
    //         // Start a timer with the current BPM
    //         this.timer = setInterval(this.playClick, (60 / this.state.bpm) * 1000);
    //         this.setState({
    //             count: 0,
    //             playing: true
    //             // Play a click "immediately" (after setState finishes)
    //         }, this.playClick);
    //     }
    // }
    // playClick = () => {
    //     const { count, beatsPerMeasure } = this.state;

    //     // The first beat will have a different sound than the others
    //     if (count % beatsPerMeasure === 0) {
    //         this.metronone.play();
    //     } else {
    //         this.metronone.play();
    //     }

    //     // Keep track of which beat we're on
    //     this.setState(state => ({
    //         count: (state.count + 1) % state.beatsPerMeasure
    //     }));
    // }
    // playingMetronome() {
    // MetronomeModule.setBPM(110);
    // MetronomeModule.setShouldPauseOnLostFocus(true);
    // MetronomeModule.start();
    //}

    componentDidMount() {
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.stretchAnimation, {
                    toValue: 48, //placeholder
                    duration: 273,
                    useNativeDriver: false,
                }),
                Animated.timing(this.stretchAnimation, {
                    toValue: 240,
                    duration: 273,
                    useNativeDriver: false,
                })
            ]),
            {
                iterations: this.props.repeat_count
            }
        ).start();

        // if (await MetronomeModule.isPlaying()) {
        //     const bpm = await MetronomeModule.getBPM();
        //     console.log(`Metronome playing at ${bpm}bpm!`);

        // }
    }
    componentDidUpdate(prevProps) {
        if ((this.props.color !== prevProps.color)) // check if color changed
        {
            this.componentDidMount();
        }
    }
    render() {
        //this.startStop;
        return (
            <View style={{ ...this.props.style }}>
                <Animated.View style={{ height: this.stretchAnimation }}>
                    {this.props.children}
                </Animated.View>

            </View>
        )
    }
}