const express = require('express');
const sendBit = require('./serialCommunication');
const app = express();
const port = 3000;

app.use(express.static(__dirname));
app.use(express.json());

// Endpoint to control the LED
app.post('/control-led', (req, res) => {
  const { state } = req.body; // state should be true or false
  sendBit(state); // Call your function to send data to the Arduino
  res.send(`LED state set to ${state}`);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
