import { Colors } from 'react-native/Libraries/NewAppScreen';
import {SafeAreaView, StyleSheet, View, Text, Pressable, Alert, NativeModules, NativeEventEmitter} from 'react-native';
import * as React from 'react';

// const [funcSwitch, setFuncSwitch] = React.useState('on');
let funcSwitchVar = '1';
export function setFuncSwitchGlobal(switchNumber : string){
    funcSwitchVar = switchNumber;
    //console.log('made it to global switch');
}
//test
export function getUIStyles(type){ //on off switch for styles
    let funcSwitch = funcSwitchVar; //on // this needs to be controlled exterally

    //console.log('getUIStyles was run!')

    // if (funcSwitch === 'on'){
    //     return 'on';
    // }
    // if (funcSwitch === 'off'){
    //     return 'off';
    // }

    //always on vv
    

    if(type === 'textColor' && funcSwitch !== 'black'){
        return 'on';
    }
    if(type === 'textSize'){
        return '1';
    }

    if (funcSwitch === 'black'){
        
        if(type === 'color'){ //A
            return 'black';
        }
        if(type === 'sound') { //B
            return 'off';
        }
        if(type === 'shape') { //C
            return '-1';
        }
        if(type === 'text') { //D
            return '-1';
        }

    }

    //full factorial design below:
    //A - color, B - sound, C - shape, D - textSize
    if (funcSwitch === '1'){

        if(type === 'color'){ //A
            return '-1';
        }
        if(type === 'sound') { //B
            return '-1';
        }
        if(type === 'shape') { //C
            return '-1';
        }
        if(type === 'text') { //D
            return '-1';
        }
    }
    if (funcSwitch === '2'){

        if(type === 'color'){
            return '-1';
        }
        if(type === 'sound') {
            return '-1';
        }
        if(type === 'shape') {
            return '-1';
        }
        if(type === 'text') {
            return '1';
        }
    }
    if (funcSwitch === '3'){

        if(type === 'color'){
            return '-1';
        }
        if(type === 'sound') {
            return '-1';
        }
        if(type === 'shape') {
            return '1';
        }
        if(type === 'text') {
            return '-1';
        }
    }
    if (funcSwitch === '4'){

        if(type === 'color'){
            return '-1';
        }
        if(type === 'sound') {
            return '-1';
        }
        if(type === 'shape') {
            return '1';
        }
        if(type === 'text') {
            return '1';
        }
    }
    if (funcSwitch === '5'){

        if(type === 'color'){
            return '-1';
        }
        if(type === 'sound') {
            return '1';
        }
        if(type === 'shape') {
            return '-1';
        }
        if(type === 'text') {
            return '-1';
        }
    }
    if (funcSwitch === '6'){

        if(type === 'color'){
            return '-1';
        }
        if(type === 'sound') {
            return '1';
        }
        if(type === 'shape') {
            return '-1';
        }
        if(type === 'text') {
            return '1';
        }
    }
    if (funcSwitch === '7'){

        if(type === 'color'){
            return '-1';
        }
        if(type === 'sound') {
            return '1';
        }
        if(type === 'shape') {
            return '1';
        }
        if(type === 'text') {
            return '-1';
        }
    }
    if (funcSwitch === '8'){

        if(type === 'color'){
            return '-1';
        }
        if(type === 'sound') {
            return '1';
        }
        if(type === 'shape') {
            return '1';
        }
        if(type === 'text') {
            return '1';
        }
    }
    if (funcSwitch === '9'){

        if(type === 'color'){
            return '1';
        }
        if(type === 'sound') {
            return '-1';
        }
        if(type === 'shape') {
            return '-1';
        }
        if(type === 'text') {
            return '-1';
        }
    }
    if (funcSwitch === '10'){

        if(type === 'color' ){
            return '1';
        }
        if(type === 'sound') {
            return '-1';
        }
        if(type === 'shape') {
            return '-1';
        }
        if(type === 'text') {
            return '1';
        }
    }
    if (funcSwitch === '11'){

        if(type === 'color'){
            return '1';
        }
        if(type === 'sound') {
            return '-1';
        }
        if(type === 'shape') {
            return '1';
        }
        if(type === 'text') {
            return '-1';
        }
    }
    if (funcSwitch === '12'){

        if(type === 'color'){
            return '1';
        }
        if(type === 'sound') {
            return '-1';
        }
        if(type === 'shape') {
            return '1';
        }
        if(type === 'text') {
            return '1';
        }
    }
    if (funcSwitch === '13'){

        if(type === 'color'){
            return '1';
        }
        if(type === 'sound') {
            return '1';
        }
        if(type === 'shape') {
            return '-1';
        }
        if(type === 'text') {
            return '-1';
        }
    }
    if (funcSwitch === '14'){

        if(type === 'color'){
            return '1';
        }
        if(type === 'sound') {
            return '1';
        }
        if(type === 'shape') {
            return '-1';
        }
        if(type === 'text') {
            return '1';
        }
    }
    if (funcSwitch === '15'){

        if(type === 'color'){
            return '1';
        }
        if(type === 'sound') {
            return '1';
        }
        if(type === 'shape') {
            return '1';
        }
        if(type === 'text') {
            return '-1';
        }
    
    }
    if (funcSwitch === '16'){

        if(type === 'color'){
            return '1';
        }
        if(type === 'sound') {
            return '1';
        }
        if(type === 'shape') {
            return '1';
        }
        if(type === 'text') {
            return '1';
        }
    
    }

    return funcSwitch;
}

export function getTextColor(currentState){ // use to change bar text color
    var toggle = getUIStyles('textColor');

    var color = Colors.white;//returns white if toggle is off
    if(toggle === 'on'){
        color = currentState === '-1' ? '696969' : Colors.white;
    }
    if(toggle === 'black'){
        color = '#000000';
    }
    
    return color;
}

export function getText(currentState){ //use to change text in bar
    var toggle = getUIStyles('text'); // switch between on and off for the text

    var text = '';// returns blank if toggle is off
    if(toggle === '1'){
        var text = currentState === '0' ? 'LOW' 
        : currentState === '1' ? 'OK' 
        : currentState === '2' ? 'GOOD': 
        currentState === '3' ? 'no connection...' : 'waiting ...';

    }

    return text;
}
export function getTextSize(){ //not being used
    var toggle = getUIStyles('textSize');
    var size = 40;
    if(toggle === '1'){
        size = 55;
    }
    if(toggle === '-1'){
        size = 0;
    }

    return size;
}
export function getIsDynamic(){
    var toggle = getUIStyles('shape');
    let isDynamic = false;

    if(toggle === '1'){ //dynamic
        isDynamic = true;
    }
    if(toggle === '-1'){ // static
        isDynamic = false;
    }
    return isDynamic;
}
// export function getAnimationHeight(){ // in progress
//     var toggle = getUIStyles('shapeSize');
//     let animationHeight = 249;
// }

export function getRate(bpm){
    var rate = bpm;
    return rate;
}

export function getBarColor(currentState){ //use to change bar color
    var toggle = getUIStyles('color'); //on is for dynamic color, off is for grey, any other input will be transparent

    var color = '#c0c0c000';// if toggle is off, defaults to grey
    if(toggle === 'off'){
        color = '#c0c0c0';
    }
    // if(toggle === 'on'){
    //     color = currentState === '0' ? '#7f1d1d' : currentState === '1' ? 
    //     '#713f12' : currentState === '2' ? '#14532d' : '#c0c0c0';
    // }
    // if(toggle === '-1'){
    //     color = currentState === '0' ? '#b91c1c' : currentState === '1' ? 
    //     '#a16207' : currentState === '2' ? '#15803d' : '#c0c0c0';
    // }
    // if(toggle === 'test'){
    //     color = currentState === '0' ? '#dc2626' : currentState === '1' ? 
    //     '#ca8a04' : currentState === '2' ? '#16a34a' : '#c0c0c0';
    // }

    //inverted vv

    if(toggle === '1' || 'on'){
        color = currentState === '0' ? '#ef4444' : currentState === '1' ? 
        '#eab308' : currentState === '2' ? '#22c55e' : '#a9a9a9';
    }if(toggle === '-1'){
        color = currentState === '0' ? '#ef4444' : currentState === '1' ? 
        '#eab308' : currentState === '2' ? '#22c55e' : '#a9a9a9';
    }
    if(toggle === 'black'){
        color = '#000000';
    }
    
    return color;
}

export function getBackgroundColor(currentState){ // use to change background color
    var toggle = getUIStyles('color');

    var color = '#a9a9a9'; // defaults to grey if toggle is off
    // if(toggle === 'on'){
    //     color = currentState === '0' ? '#ef4444' : currentState === '1' ? 
    //     '#eab308' : currentState === '2' ? '#22c55e' : '#a9a9a9';
    // }if(toggle === '-1'){
    //     color = currentState === '0' ? '#ef4444' : currentState === '1' ? 
    //     '#eab308' : currentState === '2' ? '#22c55e' : '#a9a9a9';
    // }
    /// inverted vv

    if(toggle === '1' || 'on'){
        color = currentState === '0' ? '#7f1d1d' : currentState === '1' ? 
        '#a16207': currentState === '2' ? '#14532d' : '#c0c0c0';
    }
    if(toggle === '-1'){
        color = currentState === '0' ? '#b91c1c' : currentState === '1' ? 
        '#e69900' : currentState === '2' ? '#15803d' : '#c0c0c0';
    }
    if(toggle === 'black'){
        color = '#000000';
    }

    return color;
}
export function getSound() {
    var toggle = getUIStyles('sound'); // high pitch
    if (toggle === '1') {
        return 1;
    }if(toggle === 'off' || toggle === '-1'){ //no sound
        return -1;
    }else { // low pitch
        return 2;
    }
}
// export function getBottomPosition(){ // bruh why is this not working?
//     var toggle = getUIStyles('position');
//     if (toggle === '1'){
//         return 300;
//     }if(toggle === '-1'){
//         return 130;
//     }else{
//         return 200;
//     }
// }


export function getStyles(currentState, bpm) {
    return StyleSheet.create({//styles for the app
        bar: {
            textAlign: 'center',
            alignItems: 'center',
            position: 'absolute',
            //bottom: getBottomPosition(), // changes where bottom of bar animation is
            bottom: 130,
            width: 300,
            backgroundColor: getBarColor(currentState),
            marginHorizontal: 40,
            borderRadius: 15,
        },
        container: {
            alignItems: 'center', 
            position: 'absolute',
            bottom: 0,
            left: 0,
            //backgroundColor: Colors.red, // for debug
        },
        background: {
            backgroundColor : getBackgroundColor(currentState),
            flex: 1,
        },
        exitText: {
            fontSize: 25,
            fontWeight: 'bold',
        },
        text: {
            fontSize: getTextSize(), // original 40
            fontWeight: 'bold',
            letterSpacing: 0.25,
            color: getTextColor(currentState),
            position: 'absolute',
            bottom: 0,
        },
        button: {
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 20,
            backgroundColor: '#FFFAFA',
            margin: 20,
            marginTop: 740, // changes how far down the end session button is
            borderRadius: 12,
            width: 350,
            position: 'absolute',
            height: 75,
            
        },
        blinking : {
            position: 'absolute',
            bottom: 0,
            //left: 0,
            alignItems: 'center'
        }
    });
}




