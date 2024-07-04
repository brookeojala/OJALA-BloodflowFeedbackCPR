import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import Bar from './Bar';
import Metronome from './Metronome';
import Experiment from './Experiment';
import {SafeAreaView, StyleSheet, View, Text, Pressable, Alert, NativeModules, NativeEventEmitter} from 'react-native';
import BleManager, { PeripheralInfo} from 'react-native-ble-manager';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Blink from './Blink';
import { Task, TaskTimer } from 'tasktimer';
import {getStyles, getUIStyles, getTextColor, getText, getBackgroundColor, getBarColor, getRate, getSound, getIsDynamic, setFuncSwitchGlobal } from './UIManager';
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
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


const StatusDisplay = () => {
    //DEBUG TOGGLE
    const debugToggle = false; // true 
    const experimentToggle = true;
    const demoToggle = false;
    //DEBUG TOGGLE^^

    const navigation = useNavigation();

    const [currentState, setCurrentState] = React.useState('-1'); // 0 low, 1 med, 2 high
    const [serverID, setServerID] = React.useState('placeholder');
    const [ref, setRef] = React.useState(0);
    const [bpm, setBpm] = React.useState(110);
    const [isPlaying, setPlaying] = React.useState(true);

    const [timer, setTimer] = React.useState(new TaskTimer(60000 / bpm)); //metronome timer

    const [experimentTimer, setExperiementTimer] = React.useState(new TaskTimer(1000)); //experiment timer

    const [tickSoundFile, setTickSoundFile] = React.useState(2);

    const [UIState, setUIState] = React.useState('1');
    //const [pageFocus, setPageFocus] = React.useState(true);
    const [styles, setStyles] = React.useState(getStyles(currentState, bpm));

    //let styles = getStyles(currentState, bpm); // basically the style sheet

    // bpm state is stored in this parent class,
    // passed as props to the child components,
    // metronome and bar both receive the parent bpm in props
    // metronome can use setBpm to update the parent state,
    // so that both metronome and bar are using the same bpm
    //

    const setupListeners = async (peripheralData : PeripheralInfo) => {
        for(let characteristic of peripheralData.characteristics){
            await BleManager.startNotification(peripheralData.id, peripheralData.services[0].uuid, characteristic.characteristic).then(
            () => {
                console.debug('Notification started');
            }
            ).catch(
            (e) => {
                console.debug(`[connectPeripheral][${peripheralData.id}] issue starting new notification: ${e}.`,)
            }
            );
            console.debug('here 1');
            // addListener, 
            bleManagerEmitter.addListener(
            "BleManagerDidUpdateValueForCharacteristic",
            // this function (below) gets called when the thing updates.
            // we can replace the constant state refreshes, with setting up a listener like this.
            // (i'm not sure how easy it is to do in the other file, maybe just move crap over)
            ({ value, peripheral, characteristic, service }) => {
                // Convert bytes array to string
                const data = String.fromCharCode(...value);
                console.log(`Received ${data} for characteristic ${characteristic}`);
                //stateRefresher(peripheral);
                refreshState(peripheral, data);
            }
            );
        }
    }

    // pause program functionality, buffer
    function sleep(ms: number) { 
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    }

    const debugRefresher = async (newState : string) => {
        console.debug();
        console.debug("state refresh started");
        // console.debug(peripheralData);
        setCurrentState(newState);
    }

    const refreshState = (peripheralData : PeripheralInfo, data : string) => {
        console.debug("New state refresh started");
        setCurrentState(data);
    }

    // takes data from hardware and sets the current state
    const stateRefresher = async (peripheralData : PeripheralInfo) => {
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

    // seeing which peripherals there are
    const getPeripherals = async () => { 
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

        if (!debugToggle && !experimentToggle) {
            await BleManager.disconnect(serverID);
        }
        timer.stop();

        if(experimentToggle){
            experimentTimer.stop();
            experimentTimer.reset();
        }


        navigation.navigate('Home');

        if(experimentToggle){
            Alert.alert('Testing Session Ended.', 'Thank you for participating!');

        }else{
            Alert.alert('CPR Session Ended', 'You have been disconnected from your CPR feedback device.');
        }


    }
    function setSwitch(newSwitch){
        setFuncSwitchGlobal(newSwitch);
        console.log('UI State changed');
    }
    
    
    React.useEffect( () => {// runs on open, constant refresh (only constant when [] is blank at bottom of pointer function)
        /**
         * This is where you can turn debug on and off
         * if debugOption is true, you can manually set the value for the state 
         * mode will change the state of the app in debug mode
         */
        let intervalId : Object;
        
        setSwitch(UIState);
        setStyles(getStyles(currentState, bpm));


        const func = async () => {

            let debugOption = debugToggle; //toggle testing mode
            let testingMode = '1';


            //let UISwitch = '5'; //this work now yay // make this a global variable??

            //let experimentalMode = '0'; //make this a global variable????
            //update with functions from experiment.tsx
            //I think this should be async in the background file

            if(experimentToggle){
                //state is set by experimet.tsx
            }
            else if (debugOption) {
                //TODO: this can be changed to get rid of debugRefresher
                //debugRefresher(testingMode);

                intervalId = setInterval(() => { // start a loop that runs every 100ms, refresh states
                    debugRefresher(testingMode);


                }, 100); // this doesn't change the state, its broken
            } else {
                const periphData = await getPeripherals();
                console.debug("found periph");
                await setupListeners(periphData);
            }

        };
        func();
        return () => clearInterval(intervalId); // Clears old setInterval for previous periphData.
        }, [ref, UIState] // useEffect updates when one of these vars updates // if empty it updates every frame

    )
    
    return (//returns the UI with the color and text

        <SafeAreaView style={styles.background}>

            <Text>Connected device: {serverID}</Text>
            <Text>Current state: {currentState}</Text> 
            <Text>Current UI state: {UIState}</Text> 

            <Metronome bpm={bpm} setBpm={setBpm} timer={timer} isPlaying={isPlaying} setIsPlaying={setPlaying} tickSoundFile={getSound()}> 
            </Metronome>

            <Bar bpm={bpm} style={styles.bar} timer={timer} currentState={currentState} isDynamic={getIsDynamic()} UIState={UIState}>
                <View style = {styles.container}> 
                    
                        <View style = {styles.container}> 
                            <Text style={styles.text}>
                                {getText(currentState)}
                            </Text>
                        </View>
                    
                </View>

            </Bar>
            
            <Pressable style={styles.button} onPress={() => {
                        
                        //timer.stop();
                        return endSession();
                    }}>
                <Text style = {styles.exitText}>
                    End Session
                </Text>
            </Pressable>

<Experiment experimentToggle={experimentToggle} setCurrentState={setCurrentState} setUIState={setUIState} endSession={endSession} experimentTimer={experimentTimer} demoToggle={demoToggle}>
            </Experiment>

        </SafeAreaView>
    );
}



export default StatusDisplay;