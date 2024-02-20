import { Animated, View, StyleSheet, Pressable, Text } from 'react-native'
import React, { Component } from 'react'
/*
    Bar.js :
    compressing bar animation component, bpm variable is passed via props from parent

    State varibles:
    animaionDuration: duration for animation 

    Animation variables:
    toValue: how many pixels the animation stretches
    duration: how long it takes to stretch
    useNativeDriver: TODO
 */
export default class Bar extends Component {
    constructor(props) {
        super(props);
        this.stretchAnimation = new Animated.Value(48);
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

        Animated.loop(

            Animated.sequence([
                Animated.timing(this.stretchAnimation, {
                    toValue: 240, //placeholder
                    duration: this.state.animationDuration,
                    useNativeDriver: false,
                }),
                Animated.timing(this.stretchAnimation, {
                    toValue: 48,
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
        if ((this.props.bpm !== prevProps.bpm)) // check if bpm changed, update if changed
        {
            this.updateDuration();
            this.componentDidMount();
        }
    }
    render() {
        return (
            <View style={{ ...this.props.style }}>

                <Animated.View style={{ height: this.stretchAnimation }}>
                    {this.props.children}

                </Animated.View>

            </View>
        )
    }

}