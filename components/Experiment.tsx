import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Pressable } from 'react-native';
import { TaskTimer } from 'tasktimer';
//import {debugRefresher} from './StatusDisplay';


//functions go here
// export function shuffle<T>(array: T[]): T[] { //tsx way to shuffle 
//     let currentIndex = array.length,  randomIndex;

//     // While there remain elements to shuffle.
//     while (currentIndex != 0) {

//       // Pick a remaining element.
//       randomIndex = Math.floor(Math.random() * currentIndex);
//       currentIndex--;

//       // And swap it with the current element.
//       [array[currentIndex], array[randomIndex]] = [
//         array[randomIndex], array[currentIndex]];
//     }

//     return array;
// };
// function randomizedSequence() {
//     let arr = ['0', '1', '2'];
//     shuffle(arr);
//     return arr;
// }
// function setStateValue(value) {
//     //give value to status display

//     //if value changes send a new one
// }
// export function runTrial() {
//     let timer = new TaskTimer(5 * 1000); // 5 sec in milliseconds
//     let arrPosition = 0;
//     timer.on('tick', () => {
//         if (arrPosition === 3) {
//             //black screen
//             setStateValue('black');
//         }
//         if (arrPosition > 3) {
//             timer.clear();
//         }
//         setStateValue(order[arrPosition]);
//         arrPosition += 1;

//     });
//     timer.start();

// }
const timer = new TaskTimer(1000);
//the below timer code relies on the fact that the timer will be precise with the delays and the tasks wont get out of alignment and start overlapping
// this might be a dangerous way to code this,, any other ideas???? I need it to go one task after another...
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

export function executeRun(){
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
