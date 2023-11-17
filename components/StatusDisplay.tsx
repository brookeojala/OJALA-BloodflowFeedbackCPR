import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
///import Blink from './Blink';
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

    function sleep(ms: number) { // pause program functionality, buffer
        return new Promise<void>(resolve => setTimeout(resolve, ms));
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
            const periphData = await getPeripherals();
            console.debug("found periph");
            await sleep(5000);
            intervalId = setInterval(() => { // start a loop that runs every 100ms, refresh states
                stateRefresher(periphData)
            }, 1000); // should be 100, changed for testing
        };
        func();
        return () => clearInterval(intervalId); // 
        }, [ref]
    )
    

    return (//returns the UI with the color and text
        <SafeAreaView style={currentState === '0' ? styles.noBloodFlow : currentState === '1' ? styles.lowBloodFlow : currentState === '2' ? styles.adequateBloodFlow : styles.noConnection}>
            <Text>Connected device: {serverID}</Text>
            <Text>Current state: {currentState}</Text> 
             
                <Text style={currentState === 'no connection' ? styles.noConnectionText : styles.statusText}>
                    {currentState === '0' ? 'LOW' 
                    : currentState === '1' ? 'OK' 
                    : currentState === '2' ? 'GOOD': 'waiting for connection...'}
                </Text>
    
            <Pressable style={styles.exitButton} onPress={endSession}>
                <Text style = {styles.exitText}>
                    End CPR Session
                </Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({//styles for the app
    noBloodFlow: {
        backgroundColor: '#ff0000',
        flex: 1,  
    },
    lowBloodFlow: {
        backgroundColor: '#c69035',
        flex: 1,
    },
    adequateBloodFlow: {
        backgroundColor: '#5cb85c',
        flex: 1,
    },
    noConnection: {
        backgroundColor: 'e8e8e8',
        flex: 1,
    },
    exitText: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    exitButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
        backgroundColor: '#FFFAFA',
        margin: 10,
        borderRadius: 12,
        marginTop: 100,
        fontSize: 20,
        
    },
    statusText : {
        marginHorizontal: 30,
        marginVertical: 200,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 60,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: Colors.white,
        textAlign: 'center',
    },
    noConnectionText: {
        alignItems: 'center',
        fontSize: 24,
        letterSpacing: 0.25,
        color: Colors.black,
    }
});

export default StatusDisplay;