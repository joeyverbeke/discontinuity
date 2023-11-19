#include <FastLED.h>

// Define the number of LEDs in the strip
#define NUM_LEDS 5

// Define the data pin that the LED strip is connected to
#define DATA_PIN A0

// Define the array of leds
CRGB leds[NUM_LEDS];

void setup() {
  //pinMode(LED_BUILTIN, OUTPUT);
  // Initialize the LED strip
  FastLED.addLeds<WS2812B, DATA_PIN, GRB>(leds, NUM_LEDS);
  Serial.begin(115200);
}

void loop() {
  if (Serial.available() > 0) {
    int receivedByte = Serial.read();

    if (receivedByte == '1') {
      // Turn all LEDs on to white color
      for(int i = 0; i < NUM_LEDS; i++) {
        leds[i] = CRGB::White;
      }
      FastLED.show();
      //digitalWrite(LED_BUILTIN, HIGH);
    } else if (receivedByte == '0') {
      // Turn all LEDs off
      for(int i = 0; i < NUM_LEDS; i++) {
        leds[i] = CRGB::Black;
      }
      FastLED.show();
      //digitalWrite(LED_BUILTIN, LOW);
    }
  }
}
