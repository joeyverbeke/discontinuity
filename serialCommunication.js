const { SerialPort } = require('serialport')

function createSerialPort(path) {
    return new SerialPort({
        path: path,  
        baudRate: 115200 
    });
}

function sendBit(port, bit) {
    const message = bit ? '1' : '0';
    port.write(message, (err) => {
      if (err) {
        console.log('Error on write: ', err.message);
      } else {
        console.log(`${bit} > ${port}`);
      }
    });
  }

module.exports = { createSerialPort, sendBit };
