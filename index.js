const express = require('express');
const { createSerialPort, sendBit } = require('./serialCommunication');
//const osc = require('osc');

const app = express();
const port = 3000;

const USE_SERIAL = false;
const serial = USE_SERIAL ? createSerialPort('/dev/tty.usbserial-0286023A') : null;

app.use(express.static(__dirname));
app.use(express.json());

// Endpoint to control the LED
app.post('/control-led', (req, res) => {
  const { state } = req.body; // 1/0
  if(USE_SERIAL){
    sendBit(serial, state); 
  }
  res.send(`LED state set to ${state}`);
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

/*
// Create a new osc UDP port
let udpPort = new osc.UDPPort({
  localAddress: "127.0.0.1",
  localPort: 57121,
  remoteAddress: "127.0.0.1",
  remotePort: 57122
});

udpPort.open();
*/

// Add a new endpoint to handle blink events
app.post('/blink', (req, res) => {
  const { state } = req.body; // 1/0
  udpPort.send({
    address: "/blink",
    args: [state]
  });
  res.send(`Blink state set to ${state}`);
});

/*
// Create an OSC server
let oscServer = new osc.UDPPort({
  localAddress: "127.0.0.1",
  localPort: 57122
});

oscServer.open();

// Log incoming OSC messages
oscServer.on("message", function (oscMsg) {
  console.log("Received OSC message: ", oscMsg);
});
*/

//Hyper-realistic photo of an extremely transparent see-through invisible glass snake fetus, hyper detailed, tons of veins, coils, worm, captured on a 100MP medium format camera with a prime lens, emphasizing crisp details and vibrant colors, utilizing HDR technique for enhanced dynamic range, reminiscent of high-resolution National Geographic photography
//saturation, pink, red, over saturated


//photograph with detailed anatomical accuracy,  transparency, translucency, see-through, cybernetic, circuits, wiring, microorganisms, bacteria, pipes, maximalist, transparent, scientific imagery, petri dish, microscope image, microscopic

