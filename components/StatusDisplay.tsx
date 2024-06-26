import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import Bar from './Bar';
import Metronome from './Metronome';
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
    const debugToggle = true; // true 
    const experimentToggle = true;
    //DEBUG TOGGLE^^



    const navigation = useNavigation();

    const [currentState, setCurrentState] = React.useState('-1'); // 0 low, 1 med, 2 high
    const [serverID, setServerID] = React.useState('placeholder');
    const [ref, setRef] = React.useState(0);
    const [bpm, setBpm] = React.useState(110);
    const [isPlaying, setPlaying] = React.useState(true);

    const [timer, setTimer] = React.useState(new TaskTimer(60000 / bpm));
    const [tickSoundFile, setTickSoundFile] = React.useState(2);

    const [pageFocus, setPageFocus] = React.useState(true);

    const styles = getStyles(currentState, bpm); // basically the style sheet

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

        if (!debugToggle) {
            await BleManager.disconnect(serverID);
        }
        navigation.navigate('Home');

        Alert.alert('CPR Session Ended', 'You have been disconnected from your CPR Feedback Device.');
    }

    const controllSwitch = async (newSwitch : string) => {
    
        setFuncSwitchGlobal(newSwitch);
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

            let debugOption = debugToggle; //toggle testing mode
            let testingMode = '1';

            let UISwitch = '5'; //this work now yay // make this a global variable??
            controllSwitch(UISwitch);

            let experimentalMode = '0'; //make this a global variable????
            //update with functions from experiment.tsx
            //I think this should be async in the background file

            if(experimentToggle){
                intervalId = setInterval(() => { // start a loop that runs every 100ms, refresh states
                    debugRefresher(experimentalMode);
                }, 100); // this doesn't change the state, its broken
            }
            else if (debugOption) {
                intervalId = setInterval(() => { // start a loop that runs every 100ms, refresh states
                    debugRefresher(testingMode);
                }, 100); // this doesn't change the state, its broken
            } else {
                const periphData = await getPeripherals();
                console.debug("found periph");
                await setupListeners(periphData);
                //await sleep(5000);
                // intervalId = setInterval(() => { // start a loop that runs every 100ms, refresh states
                //     //stateRefresher(periphData)
                //     //if device disconnected state == '3'
                // }, 100); // should be 100, changed high for debug mode testing
            }

        };
        func();
        return () => clearInterval(intervalId); // Clears old setInterval for previous periphData.
        }, [ref]

    )
    
    return (//returns the UI with the color and text

        <SafeAreaView style={styles.background}>

            <Text>Connected device: {serverID}</Text>
            <Text>Current state: {currentState}</Text> 

            <Metronome bpm={bpm} setBpm={setBpm} timer={timer} isPlaying={isPlaying} setIsPlaying={setPlaying} tickSoundFile={getSound()}> 
            </Metronome>

            <Bar bpm={bpm} style={styles.bar} timer={timer} currentState={currentState} isDynamic={getIsDynamic()}>
                <View style = {styles.container}> 
                    
                        <View style = {styles.container}> 
                            <Text style={styles.text}>
                                {getText(currentState)}
                            </Text>
                        </View>
                    
                </View>

            </Bar>

            <Pressable style={styles.button} onPress={() => {
                        //setTimer(new TaskTimer(60000 / bpm));
                        // setBpm(110);
                        setPageFocus(false);
                        timer.stop();
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