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
function randomizeSequence() {
    let arr = ['0', '1', '2'];
    shuffle(arr);
    return arr;
}
function setStateValue(value) {
    //give value to status display

    //if value changes send a new one
}
export function runTrial() {
    //run a randomized 3 levels and change layout
    let order = randomizeSequence();
    let timer = new TaskTimer(5 * 1000); // 5 sec in milliseconds
    let arrPosition = 0;
    timer.on('tick', () => {
        if (arrPosition === 3) {
            //black screen
            setStateValue('black');
        }
        if (arrPosition > 3) {
            timer.clear();
        }
        setStateValue(order[arrPosition]);
        arrPosition += 1;

    });
    timer.start();

}
