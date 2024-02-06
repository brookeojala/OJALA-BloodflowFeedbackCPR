import { Animated, View, StyleSheet } from 'react-native'
import React, { Component } from 'react'
//import metronone from './metronome.wav'
import Sound from 'react-native-sound'
//import MetronomeModule from "react-native-metronome-module";

export default class Bar extends Component {
    constructor(props) {
        super(props);
        this.stretchAnimation = new Animated.Value(240);
    }
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