import { Colors } from 'react-native/Libraries/NewAppScreen';
import {SafeAreaView, StyleSheet, View, Text, Pressable, Alert, NativeModules, NativeEventEmitter} from 'react-native';

//functions for changing UI
export function getUIStyles(type){ //on off switch for styles
    var funcSwitch = 'on'; //on 
    if (funcSwitch === 'on'){
        return 'on';
    }
    if (funcSwitch === 'off'){
        return 'off';
    }
    if (funcSwitch === '1'){
        if(type === 'color'){
            return 'on';
        }
        if(type === 'text'){
            return 'on';
        }
        if(type === 'bgColor'){
            return 'off';
        }
        if(type === 'barColor'){
            return 'off';
        }
        if(type === 'sound') {
            return '2';
        }
    }

    return funcSwitch;
}

export function getTextColor(currentState){ // use to change bar text color
    var toggle = getUIStyles('color');

    var color = Colors.white;//returns white if toggle is off
    if(toggle === 'on'){
        color = currentState === '-1' ? '696969' : Colors.white;
    }

    return color;
}

export function getText(currentState){ //use to change text in bar
    var toggle = getUIStyles('text'); // switch between on and off for the text

    var text = '';// returns blank if toggle is off
    if(toggle === 'on'){
        var text = currentState === '0' ? 'LOW' 
        : currentState === '1' ? 'OK' 
        : currentState === '2' ? 'ADEQUATE': 
        currentState === '3' ? 'no connection...' : 'waiting ...';

    }

    return text;
}

export function getRate(bpm){
    var rate = bpm;
    return rate;
}

export function getBarColor(currentState){ //use to change bar color
    var toggle = getUIStyles('barColor'); //on is for dynamic color, off is for grey, any other input will be transparent

    var color = '#c0c0c000';// if toggle is off, defaults to grey
    if(toggle === 'off'){
        color = '#c0c0c0';
    }
    if(toggle === 'on'){
        color = currentState === '0' ? 'darkred' : currentState === '1' ? 
        '#c69035' : currentState === '2' ? '#5cb85c' : '#c0c0c0';
    }

    return color;
}

export function getBackgroundColor(currentState){ // use to change background color
    var toggle = getUIStyles('bgColor');

    var color = '#a9a9a9'; // defaults to grey if toggle is off
    if(toggle === 'on'){
        color = currentState === '0' ? '#ff0000' : currentState === '1' ? 
        'goldenrod' : currentState === '2' ? 'green' : '#a9a9a9';
    }

    return color;
}

export function getStyles(currentState, bpm) {
    return StyleSheet.create({//styles for the app
        bar: {
            textAlign: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 240,
            width: 300,
            backgroundColor: getBarColor(currentState),
            marginHorizontal: 40,
            borderRadius: 12,
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
            fontSize: 40,
            fontWeight: 'bold',
            letterSpacing: 0.25,
            color: getTextColor(currentState),
            position: 'absolute',
            bottom: 0,
        },
        button: {
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 50,
            backgroundColor: '#FFFAFA',
            margin: 20,
            marginTop: 660,
            borderRadius: 12,
            width: 350,
            position: 'absolute',
            height: 125,
            
        },
        blinking : {
            position: 'absolute',
            bottom: 0,
            //left: 0,
            alignItems: 'center'
        }
    });
}


export function getSound() {
    var toggle = getUIStyles('sound');
    if (toggle === 'on') {
        return 1;
    } else {
        return 2;
    }
}

