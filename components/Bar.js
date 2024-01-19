import { Animated, View } from 'react-native'
import React, { Component } from 'react'

export default class Bar extends Component {
    constructor(props) {
        super(props);
        this.stretchAnimation = new Animated.Value(400);
    }

    componentDidMount() {
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.stretchAnimation, {
                    toValue: 50, //placeholder
                    duration: 273,
                    useNativeDriver: false,
                }),
                Animated.timing(this.stretchAnimation, {
                    toValue: 400,
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
        return (
            <View style={{ ...this.props.style }}>
                <Animated.View style={{ height: this.stretchAnimation }}>
                    {this.props.children}
                </Animated.View>

            </View>
        )
    }
}