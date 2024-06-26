#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <stdio.h>
#include <BLE2902.h>

#include "sdkconfig.h"

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

/* fixing notification:

add descriptor to characteristic
make the characteristic call notify function
*/

#define SERVICE_UUID "1562f010-97cc-4447-8b93-3001adaaafe0"
#define CHARACTERISTIC_UUID "cb8cc120-c16b-4b47-908b-76ffcadc6afd"

int state = 0;
int maxState = 2;
char result[10];

BLEServer *pServer;
BLEService *pService;
BLECharacteristic *pCharacteristic;

void setup()
{
    Serial.begin(115200);
    // pMyNotifyTask = new MyNotityTask();
    Serial.println("Starting BLE Server!");
    BLEDevice::init("UltrasoundBLEServer");
    pServer = BLEDevice::createServer();
    // pServer->setCallbacks(new MyServerCallbacks());
    pService = pServer->createService(SERVICE_UUID);
    pCharacteristic = pService->createCharacteristic(
        CHARACTERISTIC_UUID,
        BLECharacteristic::PROPERTY_READ |
            BLECharacteristic::PROPERTY_WRITE |
            BLECharacteristic::PROPERTY_NOTIFY);

    pCharacteristic->addDescriptor(new BLE2902());

    /* BLEServer *pServer = BLEDevice::createServer();
    BLEService *pService = pServer->createService(SERVICE_UUID);
    BLECharacteristic *pCharacteristic = pService->createCharacteristic(
                                           CHARACTERISTIC_UUID,
                                           BLECharacteristic::PROPERTY_READ |
                                           BLECharacteristic::PROPERTY_WRITE
                                         );*/

    sprintf(result, "%d", state);
    pCharacteristic->setValue(result);
    pService->start();
    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->setScanResponse(true);
    pAdvertising->setMinPreferred(0x06); // functions that help with iPhone connections issue
    pAdvertising->setMinPreferred(0x12);
    BLEDevice::startAdvertising();
    Serial.println("Characteristic defined! Now you can read it in the Client!");
}
int randomGenState()
{
    return rand() % 3;
}
int randomGenTime()
{
    return 1000 * (1 + (rand() % 8));
}
void loop()
{
    std::string value = pCharacteristic->getValue();
    Serial.print("The new characteristic value is: ");
    Serial.println(value.c_str());
    delay(randomGenTime());
    state = randomGenState();
    sprintf(result, "%d", state);
    pCharacteristic->setValue(result);
    pCharacteristic->notify();
}
