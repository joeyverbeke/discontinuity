void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  if (Serial.available() > 0) {
    int receivedByte = Serial.read();

    if (receivedByte == '1') {
      digitalWrite(LED_BUILTIN, HIGH);
    } else if (receivedByte == '0') {
      digitalWrite(LED_BUILTIN, LOW);
    }
  }
}