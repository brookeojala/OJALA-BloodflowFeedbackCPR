import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import Blink from './Blink';
import Bar from './Bar';
import Metronome from './Metronome';
import Sound from 'react-native-sound';

import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    StatusBar,
    NativeModules,
    NativeEventEmitter,
    Platform,
    FlatList,
    TouchableHighlight,
    Pressable,
    Alert,
  } from 'react-native';

import BleManager, {
    BleDisconnectPeripheralEvent,
    BleManagerDidUpdateValueForCharacteristicEvent,
    BleScanCallbackType,
    BleScanMatchMode,
    BleScanMode,
    Peripheral,
    PeripheralInfo,
} from 'react-native-ble-manager';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const StatusDisplay = () => {
    const navigation = useNavigation();
    // const {id, name} = 
    //TODO: figure out how to pass params
    const [currentState, setCurrentState] = React.useState("no connection");
    const [serverID, setServerID] = React.useState('placeholder');
    const [ref, setRef] = React.useState(0);
    const [bpm, setBpm] = React.useState(110);
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
                let valueAsString = String.fromCharCode(...curr);
                setCurrentState(valueAsString);
                console.debug(valueAsString);
                setServerID(peripheralData.id);
            }
        } catch (e){
            console.debug('[stateRefresher] Error refreshing: ' + e);
        }
    }

    const getPeripherals = async () => {// seeing which peripherals there are
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
        let intervalId : Object;
        const func = async () => {
            let debugOption = true;
            let crap = '1';
            if (debugOption) {
                intervalId = setInterval(() => { // start a loop that runs every 100ms, refresh states
                    debugRefresher(crap);
                }, 500); // should be 100, changed high for debug mode testing
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
        return () => clearInterval(intervalId); // 
        }, [ref]
    )
    

    return (//returns the UI with the color and text

        <SafeAreaView style={currentState === '0' ? styles.noBloodFlow : currentState === '1' ? styles.lowBloodFlow : currentState === '2' ? styles.adequateBloodFlow : styles.noConnection}>

            <Text>Connected device: {serverID}</Text>
            <Text>Current state: {currentState}</Text> 

            <Metronome bpm={bpm} setBpm={setBpm}>
            </Metronome>

            <Bar bpm={bpm} style={currentState === '0' ? styles.barNo : currentState === '1' ? styles.barLow : currentState === '2' ? styles.barAdequate : styles.bar}>
                <View style = {styles.container}> 
                <Text style={currentState === 'no connection' ? styles.noConnectionText : currentState === '3' ? styles.noConnectionText : styles.statusText}>
                    {currentState === '0' ? 'LOW' 
                    : currentState === '1' ? 'OK' 
                    : currentState === '2' ? 'ADEQUATE': 
                    currentState === '3' ? 'no connection...' : 'waiting ...'}
                </Text>
                </View>

            </Bar>
            <Pressable style={styles.exitButton} onPress={endSession}>
                <Text style = {styles.exitText}>
                    End Session
                </Text>
            </Pressable>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({//styles for the app
    bar: {
        textAlign: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 240,
        width: 300,
        backgroundColor: '#c0c0c0',
        marginHorizontal: 40,
        borderRadius: 12,
    },
    container: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        //backgroundColor: '000000', for debug
    },
    barNo: {
        textAlign: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 240,
        width: 300,
        backgroundColor: 'darkred',
        marginHorizontal: 40,
        borderRadius: 12,
    },
    barLow: {
        textAlign: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 240,
        width: 300,
        backgroundColor: '#c69035',
        marginHorizontal: 40,
        borderRadius: 12,
    },
    barAdequate: {
        textAlign: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 240,
        width: 300,
        backgroundColor: 'green',
        marginHorizontal: 40,
        borderRadius: 12,

    },
    noBloodFlow: {
        backgroundColor: '#ff0000',
        flex: 1,
    },
    lowBloodFlow: {
        backgroundColor: 'goldenrod',
        flex: 1,
    },
    adequateBloodFlow: {
        backgroundColor: '#5cb85c',
        flex: 1,
    },
    noConnection: {
        backgroundColor: '#a9a9a9',
        flex: 1,
    },
    exitText: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    exitButton: {
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
    noConnectionText: {
        fontSize: 30, // i dont think this fits
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '696969',
        position: 'absolute',
        bottom: 0,
    },
    statusText : {
        fontSize: 40,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: Colors.white,
        position: 'absolute',
        bottom: 0,
    },
    metronome : {
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
    }
});

export default StatusDisplay;