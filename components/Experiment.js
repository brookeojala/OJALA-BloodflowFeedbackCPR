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

    /*bloodFlowSequence2 = ['0', '2', '1', '1' ,'0', '1', '0', '1', '0', '1', '2', '0', '1', '2', '0', '2', '1', '1', '0',
     '1', '1', '1' ,'1', '1', '1', '0', '0', '1', '0', '1', '1']; */
    /*bloodFlowSequence3 = ['0', '2', '0', '1', '0', '0', '2', '2' ,'2','0', '0', '2', '0', '2', '0', '0', '2', '2', '1',
         '1', '1', '1', '2', '2', '0', '1', '0', '0', '0', '2', '2', '1'];*/
    bloodFlowSequence = ['1', '2', '0', '2', '2', '2', '0', '1', '0', '1', '2', '2', '0', '0', '1', '2', '0', '1', '0', '2', '0', '2', '2', '1', '2',
        '1', '1', '1', '0', '2', '1', '2']; //32 randomly generated numbers //distribution: 0:9, 1:10, 2:13
    UISequence = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'
        , '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32'];

    sequencePosition = 0;
    completedRuns = 1;
    ticksRan = 0;

    showScreen(timer) {
        numberOfRuns = 65;


        if (this.props.demoToggle) {
            numberOfRuns = 7;
            this.bloodFlowSequence = ['2', '0', '1', '0', '2', '1'];
            this.UISequence = ['3', '15', '7', '2', '9'];
        }
        if (this.completedRuns > numberOfRuns) { // should be 16
            //stop experiment
            //timer.stop();
            //timer.reset();
            //console.log('done');
            sequencePosition = 0;
            this.completedRuns = 1;
            this.props.endSession();
            //set to finish screen
        }
        else if (this.completedRuns % 2 != 0) {
            // for 3 ticks before moving on
            durationOfBlack = 3;
            if (this.ticksRan === 0) {
                this.props.setCurrentState('1');
                this.props.setUIState('black');
                //console.log('black screen');
                this.ticksRan += 1;
            } else if (this.ticksRan < (durationOfBlack - 1)) {
                this.ticksRan += 1;
            } else {
                this.completedRuns += 1;
                //console.log('run completed for a total of ' + this.compeletedRuns);
                this.ticksRan = 0;
            }
            //console.log('tick count:' + timer.tickCount);


        }
        else if (this.completedRuns % 2 === 0) {
            //for 6 ticks before moving on
            durationOn = 10;
            //the order of this matters!! Current state needs to be correct before switch is changed (style sheet reload)
            if (this.ticksRan === 0) {
                this.props.setCurrentState(this.bloodFlowSequence[this.sequencePosition]);
                this.props.setUIState(this.UISequence[this.sequencePosition]);
                //console.log('tick count:' + timer.tickCount);
                //console.log('blood flow level: ' + this.bloodFlowSequence[this.sequencePosition] + ' UI sequence ' + this.UISequence[this.sequencePosition]);
                this.ticksRan += 1;
            } else if (this.ticksRan < (durationOn - 1)) {
                this.ticksRan += 1;
            } else {
                this.completedRuns += 1;
                this.sequencePosition += 1;
                this.ticksRan = 0;
            }

        }

        else {
            //this.props.setCurrentState('off');
            console.log('Error, out of bounds of timer'); // it is logging everything after 1
            console.log('completed runs is:' + this.compeletedRuns);


        }


    }

    render() {
        return null
    }
}
