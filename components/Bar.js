import { Animated, View, StyleSheet } from 'react-native'
import React, { Component } from 'react'
//import metronone from './metronome.wav'
import Sound from 'react-native-sound'
//import MetronomeModule from "react-native-metronome-module";

function bpmToDuration(componenet) { // converts bpm to ms per beat
    var duration = 60000 / componenet.bpm; //ms per beat
    componenet.setState({ animationDuration: (duration / 2) }); // halved for the two parts of the animation (up/down)

}

export default class Bar extends Component {
    constructor(props) {
        super(props);
        this.stretchAnimation = new Animated.Value(240);

        this.state = {
            bpm: 110, //default bpm 110
            animationDuration: 273 //default animationDuration 273
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