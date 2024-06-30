import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Pressable } from 'react-native';
import { TaskTimer } from 'tasktimer';
//import {debugRefresher} from './StatusDisplay';


//make experiment an class/object and export to StatusDisplay

// give setters, tell statusdisplay to change based on internal task timer


//the below timer code relies on the fact that the timer will be precise with the delays and the tasks wont get out of alignment and start overlapping
// this might be a dangerous way to code this,, any other ideas???? I need it to go one task after another...

//one timer that figures out which function to call OR function does different things depending on what tick its on


//timer does not stop when terminated
//needs to reset when paued and also the process needs to end when the end of the array is reached

//add a countdown and start and end screen?? 
//remove any modules from the screen?



export default class Experiment extends Component {
    //make task timer that changes UI setting every 5 seconds

    //get variables from status display
    //get UIState, setUIState // controlling UI setting

    //
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        //const timer = new TaskTimer(5000);
        this.props.experimentTimer.on('tick', () => this.showScreen(this.props.experimentTimer));
        this.executeRun(this.props.experimentTimer);
    }

    executeRun(timer) {
        if (this.props.experimentToggle) {
            timer.start();
        }
    }

    bloodFlowSequence = ['1', '0', '2', '1', '1', '0', '2', '2', '1', '2', '1', '0', '2', '2', '0', '0']; // this can change (16/3 = 5 r1)
    UISequence = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
    sequencePosition = 0;

    showScreen(timer) {
        if (timer.tickCount > 8) { // should be 16
            //stop experiment
            //timer.stop();
            //timer.reset();
            console.log('done');
            sequencePosition = 0;
            this.props.endSession();
            //set to finish screen
        }
        else if (timer.tickCount % 2 == 0) {
            this.props.setUIState('black');
            this.props.setCurrentState('1');
            console.log('tick count:' + timer.tickCount);
            console.log('black screen');
        }
        else if (timer.tickCount % 2 != 0) {
            this.props.setUIState(this.UISequence[this.sequencePosition]);
            this.props.setCurrentState(this.bloodFlowSequence[this.sequencePosition]);
            console.log('tick count:' + timer.tickCount);
            console.log('blood flow level: ' + this.bloodFlowSequence[this.sequencePosition] + ' UI sequence ' + this.UISequence[this.sequencePosition]);
            this.sequencePosition += 1;
        }

        else {
            //this.props.setCurrentState('off');
            console.log('Error, out of bounds of timer'); // it is logging everything after 1

        }


    }

    render() {
        return null
    }
}
