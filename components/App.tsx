/**
 * Sample BLE React Native App
 */

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
  Pressable,
} from 'react-native';

// import { bytesToString } from "convert-string";

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Blink from './Blink';

const SECONDS_TO_SCAN_FOR = 7;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;

import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
  PeripheralInfo,
} from 'react-native-ble-manager';
import { useNavigation } from '@react-navigation/native';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

declare module 'react-native-ble-manager' {// part of template, setting up module, adding varibles we need for this app
  // enrich local contract with custom state properties needed by App.tsx
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
    state?: Int16Array;
  }
}

const App = () => {  //state has to be here
  //DEBUG TOGGLE vv
  const debugToggle = true;
  //DEBUG TOGGLE ^^

  const navigation =  useNavigation(); //navigation: react native library, used to naviagte between pages 
  const [isScanning, setIsScanning] = useState(false); 

  const [peripherals, setPeripherals] = useState(  //peripheral is a bluetooth device
    new Map<Peripheral['id'], Peripheral>(),
  );

  console.debug('peripherals map updated', [...peripherals.entries()]);

  const addOrUpdatePeripheral = (id: string, updatedPeripheral: Peripheral) => {
    // new Map() enables changing the reference & refreshing UI.
    // TOFIX not efficient.
    setPeripherals(map => new Map(map.set(id, updatedPeripheral)));
  };

  const startScan = () => { 
    if (debugToggle) {
      navigation.navigate('StatusDisplay'); // navigate to second page
      return;
    }
    if (!isScanning) { 
      // reset found peripherals before scan
      setPeripherals(new Map<Peripheral['id'], Peripheral>());

      try {
        console.debug('[startScan] starting scan...');
        setIsScanning(true);
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        })
          .then(() => {
            console.debug('[startScan] scan promise returned successfully.');
          })
          .catch(err => {
            console.error('[startScan] ble scan returned in error', err);
          });
      } catch (error) {
        console.error('[startScan] ble scan error thrown', error);
      }
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    console.debug('[handleStopScan] scan is stopped.');
  };

  const handleDisconnectedPeripheral = ( //does stuff when disconnected (listeners)
    event: BleDisconnectPeripheralEvent,
  ) => {
    let peripheral = peripherals.get(event.peripheral);
    if (peripheral) {
      console.debug(
        `[handleDisconnectedPeripheral][${peripheral.id}] previously connected peripheral is disconnected.`,
        event.peripheral,
      );
      addOrUpdatePeripheral(peripheral.id, {...peripheral, connected: false});
    }
    console.debug(
      `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
    );
  };

  const handleUpdateValueForCharacteristic = ( // could be added as a listener to pick up the change in values ,, possible solution for inefficent code
    data: BleManagerDidUpdateValueForCharacteristicEvent,
  ) => {
    console.debug(
      `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
    );
  };

  const handleDiscoverPeripheral = (peripheral: Peripheral) => { //only sees one device, runs on each peripheral that gets discovered
    console.debug('[handleDiscoverPeripheral] new BLE peripheral=', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
      return; //dont connect the ones that aren't named properly
    }
    if(!(peripheral.name === "UltrasoundBLEServer")){
      console.debug('[handleDiscoverPeripheral] new BLE peripheral is not ultrasound server:', peripheral);
      return;
    }
    addOrUpdatePeripheral(peripheral.id, peripheral);
  };

  const togglePeripheralConnection = async (peripheral: Peripheral) => { 
    const connectedPeripherals = await BleManager.getConnectedPeripherals();
    if(connectedPeripherals.length === 1){ //only connect one device
      console.debug('An ultrasound bluetooth server is already connected.');
      return;
    }
    if (peripheral && peripheral.connected) { //if something is already conencted and you try to connect it again, it disconnects
      try {
        let peripheralData = await BleManager.retrieveServices(peripheral.id);
        console.debug('Peripheral data');
        console.debug(peripheralData);
        await BleManager.disconnect(peripheral.id);
      } catch (error) {
        console.error(
          `[togglePeripheralConnection][${peripheral.id}] error when trying to disconnect device.`,
          error,
        );
      }
    } else {
      await connectPeripheral(peripheral);
    }
  };

  const retrieveConnected = async () => { //gets connected peripherals and tells you what is connected, for debug
    try {
      const connectedPeripherals = await BleManager.getConnectedPeripherals();
      if (connectedPeripherals.length === 0) {
        console.warn('[retrieveConnected] No connected peripherals found.');
        return;
      }

      console.debug(
        '[retrieveConnected] connectedPeripherals',
        connectedPeripherals,
      );

      for (var i = 0; i < connectedPeripherals.length; i++) {
        var peripheral = connectedPeripherals[i];
        addOrUpdatePeripheral(peripheral.id, {...peripheral, connected: true});
      }
    } catch (error) {
      console.error(
        '[retrieveConnected] unable to retrieve connected peripherals.',
        error,
      );
    }
  };

  const connectPeripheral = async (peripheral: Peripheral) => {
    try {
      if (peripheral) { // if peripheral exists, try to connect to it, updates values
        addOrUpdatePeripheral(peripheral.id, {...peripheral, connecting: true});

        await BleManager.connect(peripheral.id);
        console.debug(`[connectPeripheral][${peripheral.id}] connected.`);

        addOrUpdatePeripheral(peripheral.id, {
          ...peripheral,
          connecting: false,
          connected: true,
        });

        // before retrieving services, it is often a good idea to let bonding & connection finish properly
        await sleep(900);

        /* Test read current RSSI value, retrieve services first */
        const peripheralData = await BleManager.retrieveServices(peripheral.id); //data packets
        
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
          peripheralData,
        );
        
        const rssi = await BleManager.readRSSI(peripheral.id); // how strong connection is
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
        );
        console.debug(
          `[connectPeripheral][${peripheral.id}] current characteristics: ${peripheralData.characteristics}.`,
        );

        if(peripheralData.characteristics !== undefined){ // goes thru each characteristic, prints, tries to read each value
          for(let characteristic of peripheralData.characteristics){
            console.debug(
              `[connectPeripheral][${peripheral.id}] current characteristic: ${characteristic.characteristic}.`,
            );
            try{
              let currValue = await BleManager.read(peripheral.id, peripheralData.services[0].uuid, characteristic.characteristic);
              let valueAsString = String.fromCharCode(...currValue);
              console.debug(`[connectPeripheral][${peripheral.id}] current characteristic: ${characteristic.characteristic}. Value: ${valueAsString}`,);
//

              // console.debug('New changes'); // tells when the value is changed (Not working rn) here
              // console.debug(
              //   `[connectPeripheral][${peripheral.id}] service: ${peripheralData.services[0].uuid} characteristics: ${characteristic.characteristic}.`,
              // );
              // await BleManager.startNotification(peripheral.id, peripheralData.services[0].uuid, characteristic.characteristic).then(
              //   () => {
              //     console.debug('Notification started');
              //   }
              // ).catch(
              //   (e) => {
              //     console.debug(`[connectPeripheral][${peripheral.id}] issue starting new notification: ${e}.`,)
              //   }
              // );
              // console.debug('here 1');
              // // addListener, 
              // bleManagerEmitter.addListener(
              //   "BleManagerDidUpdateValueForCharacteristic",
              //   // this function (below) gets called when the thing updates.
              //   // we can replace the constant state refreshes, with setting up a listener like this.
              //   // (i'm not sure how easy it is to do in the other file, maybe just move crap over)
              //   ({ value, peripheral, characteristic, service }) => {
              //     // Convert bytes array to string
              //     const data = String.fromCharCode(...value);
              //     console.log(`Received ${data} for characteristic ${characteristic}`);
              //   }
              // ); // until here was commented out

              //
              console.debug('here');

              try {
                console.debug("Peripheral id:");
                console.debug(peripheral.id);
                setPeripherals(new Map<Peripheral['id'], Peripheral>());
                navigation.navigate('StatusDisplay'); // navigate to second page
              } catch (e){
                console.debug(e);
              }
            } catch (e) {
              console.debug(`[connectPeripheral][${peripheral.id}] error reading data: ${e}.`,);
            }
          }
        }

        let p = peripherals.get(peripheral.id);
        if (p) {
          addOrUpdatePeripheral(peripheral.id, {...peripheral, rssi});
        }
      }
    } catch (error) {
      console.error(
        `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
        error,
      );
    }
  };

  function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => { //first time page is loaded, starts object that handles bluetooth manager
    console.log("Manager: " + BleManager);
    try {
      BleManager.start({showAlert: false})
        .then(() => console.debug('BleManager started.'))
        .catch(error =>
          console.error('BleManager could not be started.', error),
        );
    } catch (error) {
      console.error('unexpected error starting BleManager.', error);
      return;
    }

    const listeners = [
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      ),
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      ),
    ];

    return () => {
      console.debug('[app] main component unmounting. Removing listeners...');

      for (const listener of listeners) {
        listener.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({item}: {item: Peripheral}) => {
    const backgroundColor = item.connected ? '#069400' : Colors.white;
    return (
      <TouchableHighlight
        underlayColor="#0082FC"
        onPress={() => togglePeripheralConnection(item)} disabled={isScanning}>
        <View style={[styles.row, {backgroundColor}]}>
          <Text style={styles.peripheralName}>
            {/* completeLocalName (item.name) & shortAdvertisingName (advertising.localName) may not always be the same */}
            {item.name} - {item?.advertising?.localName}
            {item.connecting && ' - Connecting...'}
          </Text>
          <Text style={styles.rssi}>RSSI: {item.rssi}</Text>
          <Text style={styles.peripheralId}>{item.id}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <>
      <StatusBar />
      <View style={styles.body}>
        {/* <Pressable style={styles.scanButton} onPress={ ()=>navigation.navigate("StatusDisplay")}>
          <Text style={styles.scanButtonText}>
            Navigate to display
          </Text>
        </Pressable> */}

        <Pressable style={styles.scanButton} onPress={startScan}>
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Scan for Device'}
          </Text>
        </Pressable>

        {/* <Pressable style={styles.scanButton} onPress={retrieveConnected}>
          <Text style={styles.scanButtonText}>
            {'Retrieve connected peripherals'}
          </Text>
        </Pressable> */}

        {Array.from(peripherals.values()).length === 0 && (
          <View style={styles.row}>
            <Blink duration = {700} >
              <Text style={styles.noPeripherals}>
                No devices found, press "Scan Bluetooth" above.
              </Text>
            </Blink>
          </View>
        )}

        <FlatList
          data={Array.from(peripherals.values())}
          contentContainerStyle={{rowGap: 12}}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </>
  );
};

const boxShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const styles = StyleSheet.create({
  navigationButton: {
  },
  engine: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    color: Colors.black,
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#0a398a',
    margin: 10,
    borderRadius: 12,
  },
  scanButtonText: {
    fontSize: 35,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: Colors.white,
  },
  body: {
    backgroundColor: '#0082FC',
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  peripheralName: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  rssi: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
  },
  peripheralId: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
    paddingBottom: 20,
  },
  row: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
  },
  noPeripherals: {
    fontSize: 15,
    margin: 10,
    textAlign: 'center',
    color: Colors.white,
  },
  displayPeripherals: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.blue,
  }
});

export default App;