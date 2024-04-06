import { Animated, View, StyleSheet, Pressable, Text } from 'react-native'
import React, { Component } from 'react'
import { TaskTimer } from 'tasktimer';
/*
    Bar.js :
    compressing bar animation component, bpm variable is passed via props from parent

    State varibles:
    animaionDuration: duration for animation 

    Animation variables:
    toValue: how many pixels the animation stretches
    duration: how long it takes to stretch
    useNativeDriver: determines if the native code can preform the animation of the UI thread
 */

export default class Bar extends Component {
    constructor(props) {
        super(props);
        this.stretchAnimation = new Animated.Value(48);
        var newAnimDuration = (60000 / this.props.bpm) / 2;

        this.state = {
            animationDuration: newAnimDuration,//default animationDuration 273
            timer: props.timer,
        }

        this.state.timer.on('tick', () => {
            //console.log('tick count: ' + this.state.timer.tickCount);
            //console.log('elapsed time: ' + timer.time.elapsed + ' ms.');
            this.componentDidMount();
        });

    }

    updateDuration() {
        var newAnimDuration = (60000.0 / this.props.bpm) / 2.0;
        this.setState({ animationDuration: newAnimDuration });
        this.state.timer.interval = (60000 / this.props.bpm);

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