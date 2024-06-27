import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Pressable } from 'react-native';
import { TaskTimer } from 'tasktimer';
//import {debugRefresher} from './StatusDisplay';


//make experiment an class/object and export to StatusDisplay

// give setters, tell statusdisplay to change based on internal task timer


//the below timer code relies on the fact that the timer will be precise with the delays and the tasks wont get out of alignment and start overlapping
// this might be a dangerous way to code this,, any other ideas???? I need it to go one task after another...

//one timer that figures out which function to call OR function does different things depending on what tick its on

//let [UISetting, setUISetting] = React.useState(1);
//let [bloodCounter, setBloodCounter] = React.useState(0);
let randomizedSequence = [1, 0, 2, 1, 1, 0, 2, 2, 1, 2, 1, 0, 2, 2, 0, 0]; // this can change (16/3 = 5 r1)



export default class Experiment extends Component {
    //make task timer that changes UI setting every 5 seconds

    //get variables from status display
    //get UIState, setUIState // controlling UI setting
    constructor(props) {
        super(props);
        this.state = {
            setCurrentState: props.setCurrentState,
        }

    }


    componentDidMount() {
        const timer = new TaskTimer(5000);
        timer.on('tick', () => this.showScreen(timer));
        this.executeRun(timer);
    }
    executeRun(timer) {
        if (this.props.experimentToggle) {
            timer.start();
        }

    }

    showScreen(timer) {
        if (timer.tickCount % 2 == 0) {
            this.props.setCurrentState('off');
        }
        else if (timer.tickCound % 2 != 0) {
            this.props.setCurrentState('2');
        }
        else {
            this.props.setCurrentState('off');
            console.log('tick count:' + timer.tickCount); // it is logging everything after 1
        }


    }
    setBlack() {
        //set UI Style to black with a (countdown?) and silence (reset?)
    }
    executeTrial() {
        //turn on interface with given the blood flow setting from randomizedSequence and the UI setting number



        setBloodCounter(bloodCounter + 1);
        setUISetting(UISetting + 1);
    }



    render() {
        return null
    }
}
