const express = require('express');
const { createSerialPort, sendBit } = require('./serialCommunication');
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
