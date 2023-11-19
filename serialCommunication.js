const { SerialPort } = require('serialport')

function createSerialPort(path) {
    const tryCreateSerialPort = () => {
        const port = new SerialPort({ path, baudRate: 115200 }, (err) => {
            if (err) {
                console.log('Error opening port: ', err.message);
                setTimeout(tryCreateSerialPort, 3000);
            }
            else{
                console.log(`Connected to ${path}`);
            }
        });
        return port;
    };
    return tryCreateSerialPort();
}

function sendBit(port, bit) {
    const message = bit ? '1' : '0';
    port.write(message, (err) => {
      if (err) {
        console.log('Error on write: ', err.message);
      } else {
        //console.log(`${bit} > ${port.path}`);
      }
    });
  }

module.exports = { createSerialPort, sendBit };
