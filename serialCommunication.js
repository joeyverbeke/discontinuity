const { SerialPort } = require('serialport')

const port = new SerialPort({
    path: '/dev/tty.usbserial-0286023A',  
    baudRate: 115200 
});

function sendBit(bit) {
    const message = bit ? '1' : '0';
    port.write(message, (err) => {
      if (err) {
        console.log('Error on write: ', err.message);
      } else {
        console.log(`Bit ${bit} sent`);
      }
    });
  }

  module.exports = sendBit;