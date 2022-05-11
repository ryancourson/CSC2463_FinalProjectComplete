

#include "PDMSerial.h"

PDMSerial pdm;

const int analogPin = A0;  //the analog input pin sensor is attached to
const int ledPin = 2;    // a digital output pin


int sensorValue = 0;
int sensorTransmitValue = 0;




void setup() {

  pinMode(analogPin, INPUT);
  pinMode(ledPin, OUTPUT);
  
  Serial.begin(9600);

}

void loop() {
  
  sensorValue = analogRead(analogPin);//read the value from the analog sensor
  
  
  float sensorFloatValue = map(sensorValue, 0, 1023, 0.2, 10);
  
  pdm.transmitSensor("a0", sensorFloatValue);
  pdm.transmitSensor("led",ledPin);
  pdm.transmitSensor("end");

  boolean newData = pdm.checkSerial();
  
  if(newData) {
    
    if(pdm.getName().equals(String("led"))){
      digitalWrite(ledPin, pdm.getValue());
    }
  }

}
