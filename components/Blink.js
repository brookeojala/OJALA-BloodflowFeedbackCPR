import React, { Component } from 'react'
import { Animated, View } from 'react-native'


export default class Blink extends Component {

    constructor(props) {
        super(props);
        this.fadeAnimation = new Animated.Value(1);
    }

    componentDidMount() {
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.fadeAnimation, {
                    toValue: 0,
                    duration: this.props.duration,
                    useNativeDriver: true,
                }),
                Animated.timing(this.fadeAnimation, {
                    toValue: 1,
                    duration: this.props.duration,
                    useNativeDriver: true,
                })
            ]),
            {
                iterations: this.props.repeat_count
            }
        ).start();
    }
    componentDidUpdate(prevProps) {
        if ((this.props.duration !== prevProps.duration)) // Check if it's a new duration and refreshes the component
        {
            this.componentDidMount();
        }
    }

    render() {
        return (
            <View style={{ ...this.props.style }}>
                <Animated.View style={{ opacity: this.fadeAnimation }}>
                    {this.props.children}
                </Animated.View>
            </View>
        )
    }
}