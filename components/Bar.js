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
        let newAnimDuration = (60000 / this.props.bpm) / 2;
        //let newToValue = 500; // something wrong with initializing like this
        // this doesnt actually do anything it just defaults to the given value
        this.state = {
            animationDuration: newAnimDuration,//default animationDuration 273
            timer: props.timer,
            toValue: 249,
        }
        this.updateToValue();
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
    updateToValue() {
        let newToValue = 249;
        if (this.props.isDynamic === true) {
            if (this.props.currentState === '0') {
                newToValue = 449;
            };
            if (this.props.currentState === '1') {
                newToValue = 349;
            };
            if (this.props.currentState === '2') {
                newToValue = 249;
            };
        }

        this.setState({ toValue: newToValue }); // default to 249 if the state is unknown
    }
    componentDidMount() {

        Animated.loop(

            Animated.sequence([
                Animated.timing(this.stretchAnimation, {
                    toValue: this.state.toValue, //placeholder 240 // this needs to change with the level in the dynamic mode
                    duration: this.state.animationDuration,
                    useNativeDriver: false,
                }),
                Animated.timing(this.stretchAnimation, {
                    toValue: 57, //48 originally. Aded 9 pixels to help formatting with bigger text
                    duration: this.state.animationDuration,
                    useNativeDriver: false,
                })
            ]),
            {
                iterations: this.props.repeat_count
            }
        ).start();
        this.updateToValue();

    }
    componentDidUpdate(prevProps) {
        if ((this.props.bpm !== prevProps.bpm)) // check if bpm changed, update if changed
        {
            this.updateDuration();
            this.componentDidMount();
        }
        if (this.props.isDynamic !== prevProps.isDynamic) {
            //check if state changes and change the height of animation
            this.updateToValue();
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