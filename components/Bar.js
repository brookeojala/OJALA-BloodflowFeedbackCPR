import { Animated, View, StyleSheet, Pressable, Text } from 'react-native'
import React, { Component } from 'react'
//import metronone from './metronome.wav'
import Sound from 'react-native-sound'
//import MetronomeModule from "react-native-metronome-module";

export default class Bar extends Component {
    constructor(props) {
        super(props);
        this.stretchAnimation = new Animated.Value(240);
        var newAnimDuration = (60000 / this.props.bpm) / 2;

        this.state = {
            animationDuration: newAnimDuration//default animationDuration 273
        }
    }

    updateDuration() {
        var newAnimDuration = (60000 / this.props.bpm) / 2;
        this.setState({ animationDuration: newAnimDuration });
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
            this.updateDuration();//bpmToDuration(this);
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
                {/* <Pressable onPress={() => {
                    console.log(' - button clicked');
                    return decreaseBpm(this), this.componentDidMount();
                }}>

                    <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
                        -
                    </Text>

                </Pressable>

                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
                    {this.props.bpm}
                </Text>

                <Pressable onPress={() => {
                    console.log('+ button clicked');
                    return increaseBpm(this), this.componentDidMount();
                }}>

                    <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
                        +
                    </Text>

                </Pressable> */}

            </View>
        )
    }

}