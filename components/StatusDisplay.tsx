import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import Bar from './Bar';
import Metronome from './Metronome';
import {SafeAreaView, StyleSheet, View, Text, Pressable, Alert, } from 'react-native';
import BleManager, { PeripheralInfo} from 'react-native-ble-manager';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Blink from './Blink';
import { Task, TaskTimer } from 'tasktimer';
/**
 * Status Display.tsx 
 * reads data from a peripheral bluetooth connection
 * displays the UI with a metronome and a compression animation which are linked together with the bpm param
 * 
 * varibles:
 * currentState: state read from bluetooth device that controlls what version of the UI is displayed (low, med, high, ect)
 * serverID: name of the connected peripheral
 * bpm: rate of the metronome and animation (this varible is shared with Metronome and Bar componenets)
 * timer: a timer that adjusts for system delays so it does not slip out of time, this timer is shared between the children
 * timer, setTimer: timer that can be reset using the setTimer, this was part of an idea for fixing the page naviagation issue.
 *
 */

const StatusDisplay = () => {
    const navigation = useNavigation();
    // const {id, name} = 
    //TODO: figure out how to pass params
    const [currentState, setCurrentState] = React.useState('-1');
    const [serverID, setServerID] = React.useState('placeholder');
    const [ref, setRef] = React.useState(0);
    const [bpm, setBpm] = React.useState(110);

    const [timer, setTimer] = React.useState(new TaskTimer(60000 / bpm));

    const [pageFocus, setPageFocus] = React.useState(true);
    
    // bpm state is stored in this parent class,
    // passed as props to the child components,
    // metronome and bar both receive the parent bpm in props
    // metronome can use setBpm to update the parent state,
    // so that both metronome and bar are using the same bpm

    function sleep(ms: number) { // pause program functionality, buffer
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    }

    const debugRefresher = async (newState : string) => {
        console.debug();
        console.debug("state refresh started");
        // console.debug(peripheralData);
        setCurrentState(newState);
    }

    const stateRefresher = async (peripheralData : PeripheralInfo) => {// takes data from hardwarde and sets the current state
        try {
            console.debug();
            console.debug("state refresh started");
            // console.debug(peripheralData);
            if(peripheralData){
                let curr = await BleManager.read(peripheralData.id, peripheralData.services[0].uuid, peripheralData.characteristics[0].characteristic); //read id, uuid, characteristic
                console.debug("can read this");
                let valueAsString = String.fromCharCode(...curr); // TODO why is this a string??
                //let valueAsString = ...curr;
                setCurrentState(valueAsString);
                console.debug(valueAsString);
                setServerID(peripheralData.id);
            }
        } catch (e){
            console.debug('[stateRefresher] Error refreshing: ' + e);
        }
    }

    const getPeripherals = async () => { // seeing which peripherals there are
        console.debug('[useEffect] Connected peripheral:');
        const temp = await BleManager.getConnectedPeripherals();
        // console.debug(temp.length);
        setServerID(temp[0].id);
        const periphData = await BleManager.retrieveServices(temp[0].id);
        // console.debug("periphData:");
        // console.debug(periphData);
        return periphData;
    }

    const endSession = async () => {//ends CPR session

        await BleManager.disconnect(serverID);
        navigation.navigate('Home');

        Alert.alert('CPR Session Ended', 'You have been disconnected from your CPR Feedback Device.');
    }

    React.useEffect( () => {// runs on open, constant refresh
        // setPeripherals(new Map<Peripheral['id'], Peripheral>());
        /**
         * This is where you can turn debug on and off
         * if debugOption is true, you can manually set the value for the state 
         * mode will change the state of the app in debug mode
         */
        let intervalId : Object;
        const func = async () => {
            let debugOption = false; //toggle testing mode
            let mode = 2; // use this to change between (0, 1, 2, 3)

        
            if (debugOption) {
                intervalId = setInterval(() => { // start a loop that runs every 100ms, refresh states
                    debugRefresher(mode);
                }, 100); // this doesn't change the state, its broken
            } else {
                const periphData = await getPeripherals();
                console.debug("found periph");
                await sleep(5000);
                intervalId = setInterval(() => { // start a loop that runs every 100ms, refresh states
                    stateRefresher(periphData)
                }, 100); // should be 100, changed high for debug mode testing
            }

        };
        func();
        return () => clearInterval(intervalId); //TODO why is this here
        }, [ref]

    )
    //functions for changing UI
    function getUIStyles(type){ //on off switch for styles
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
                return 'off';
            }
            if(type === 'bgColor'){
                return 'off';
            }
            if(type === 'barColor'){
                return 'off';
            }
        }

        return funcSwitch;
    }
    
    function getTextColor(){ // use to change bar text color
        var toggle = getUIStyles('color');

        var color = Colors.white;//returns white if toggle is off
        if(toggle === 'on'){
            color = currentState === '-1' ? '696969' : Colors.white;
        }

        return color;
    }
    function getText(){ //use to change text in bar
        var toggle = getUIStyles('text'); // switch between on and off for the text

        var text = '';// returns blank if toggle is off
        if(toggle === 'on'){
            var text = currentState === 0 ? 'LOW' 
            : currentState === '1' ? 'OK' 
            : currentState === '2' ? 'ADEQUATE': 
            currentState === '3' ? 'no connection...' : 'waiting ...';
    
        }
        console.log("text changed");
       
        return text;
    }
    function getRate(){
        var rate = bpm;
        return rate;
    }
    function getBarColor(){ //use to change bar color
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
    function getBackgroundColor(){ // use to change background color
        var toggle = getUIStyles('bgColor');

        var color = '#a9a9a9'; // defaults to grey if toggle is off
        if(toggle === 'on'){
            color = currentState === '0' ? '#ff0000' : currentState === '1' ? 
            'goldenrod' : currentState === '2' ? 'green' : '#a9a9a9';
        }

        return color;
    }
    const styles = StyleSheet.create({//styles for the app
        bar: {
            textAlign: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 240,
            width: 300,
            backgroundColor: getBarColor(),
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
            backgroundColor : getBackgroundColor(),
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
            color: getTextColor(),
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
    
    return (//returns the UI with the color and text

        <SafeAreaView style={styles.background}>

            <Text>Connected device: {serverID}</Text>
            <Text>Current state: {currentState}</Text> 

            <Metronome bpm={bpm} setBpm={setBpm} timer={timer} pageFocus = {pageFocus} setPageFocus = {setPageFocus}> 
            </Metronome>

            <Bar bpm={bpm} style={styles.bar} timer={timer}>
                <View style = {styles.container}> 
                    
                        <View style = {styles.container}> 
                            <Text style={styles.text}>
                                {getText()}
                            </Text>
                        </View>
                    
                </View>

            </Bar>

            <Pressable style={styles.button} onPress={() => {
                        //setTimer(new TaskTimer(60000 / bpm));
                        // setBpm(110);
                        setPageFocus(false);
                        return endSession();
                    }}>
                <Text style = {styles.exitText}>
                    End Session
                </Text>
            </Pressable>

        </SafeAreaView>
    );
}
{/* <Blink duration = { (60000 / getRate()) / 2} style={styles.blinking}>
<View style = {styles.container}> 
    <Text style={styles.text}>
        {getText()}
    </Text>
</View>
</Blink> */}



export default StatusDisplay;