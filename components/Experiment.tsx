import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Pressable } from 'react-native';
import { TaskTimer } from 'tasktimer';
//import {debugRefresher} from './StatusDisplay';

//TODO: How to make this talk to statusdisplay
//make experiment an class/object and export to StatusDisplay

// give setters, tell statusdisplay to change based on internal task timer

const timer = new TaskTimer(1000);
//the below timer code relies on the fact that the timer will be precise with the delays and the tasks wont get out of alignment and start overlapping
// this might be a dangerous way to code this,, any other ideas???? I need it to go one task after another...

//one timer that figures out which function to call OR function does different things depending on what tick its on

//this doesnt align proper vvvvvvv
const task1 = {
    id: 'trial',
    tickDelay: 0,
    tickInterval: 5,
    totalRuns: 16,
    callback() {
        executeTrial()
    }
};

const task2 = {
    id: 'blackScreen',
    tickDelay: 5,
    tickInterval: 5,
    totalRuns: 16,
    callback(){
        setBlack()
    }
}

timer.add(task1);
timer.add(task2);

// how do variables work in tsx, if I change these in a function will it changed globally?? not sure not to do this


let [UISetting, setUISetting] = React.useState(1);
let [bloodCounter, setBloodCounter] = React.useState(0);
let randomizedSequence = [1, 0, 2, 1, 1, 0, 2, 2, 1, 2, 1, 0, 2, 2, 0, 0]; // this can change (16/3 = 5 r1)

export function executeRun(){ //keep in experiment class (no export)
    timer.start();
    //after done end experiment
    
    
    //previous idea: vvvvvv

    // while (UISetting <= 16){ //ends when UISetting is above 16
    //     let bloodFlowLevel = randomizedSequence[bloodCounter];
        
    //     //display app screen for 5 seconds with bloodFlowLevel and UISetting
    //     //display black for 5 seconds
    //     UISetting += 1;
    // }


    //end experiment

}
function setBlack(){
    //set UI Style to black with a (countdown?) and silence (reset?)
}
function executeTrial(){
    //turn on interface with given the blood flow setting from randomizedSequence and the UI setting number



    setBloodCounter(setBloodCounter + 1);
    setUISetting(UISetting + 1);
}
//not component make into an object? like task timer

export default class Experiment extends Component {
    //make task timer that changes UI setting every 5 seconds

    //get variables from status display
    //get UIState, setUIState // controlling UI setting
}
