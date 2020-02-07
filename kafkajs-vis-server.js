const fs = require('fs')
var app = require('express')();
var server = require('http').Server(app);
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var ioclient = require('socket.io-client')('http://localhost:33334');
var socketio_port = '33334';
const Promise = require('bluebird');
var app = require('express')();
const { Kafka, logLevel } = require('kafkajs');
const { exec } = require('child_process');

const kafka = new Kafka({
  logLevel: logLevel.INFO,
  brokers: ['localhost:9092'],
  clientId: 'example-consumer'//,
  //ssl: {
  //   rejectUnauthorized: false
  //},
  //sasl: {
  //  mechanism: 'plain',
  //  username: 'test',
  //  password: 'test123',
  //},
})

server.listen(44444); //for REST requests later
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){ //have to bounce to ext for now

  //Truck 1:
  const consumer_truck_1 = kafka.consumer({ groupId: 'truck1-group' , fromOffset: 0})
  const run_truck_1 = async () => {
    const truck_1_topic = 'TRUCK_1_SENSORS'
    await consumer_truck_1.connect();
    await consumer_truck_1.subscribe({ topic: truck_1_topic });
    await consumer_truck_1.run({
        eachMessage: async ({ topic, partition, message }) => {
            socket.emit(truck_1_topic, `${message.value}`);
            socket.broadcast.emit('TRUCK_1_SENSORS', `${message.value}`);
        },
    });
  }

  run_truck_1().catch(e => console.error(`[example/consumer_truck_1] ${e.message}`, e))

  //truck2
  const consumer_truck_2 = kafka.consumer({ groupId: 'truck2-group' , fromOffset: 0})
  const run_truck_2 = async () => {
    const truck_2_topic = 'TRUCK_2_SENSORS'
    await consumer_truck_2.connect();
    await consumer_truck_2.subscribe({ topic: truck_2_topic });
    await consumer_truck_2.run({
        eachMessage: async ({ topic, partition, message }) => {
            // console.log({
            //     key: message.key.toString(),
            //     value: message.value.toString(),
            //     headers: message.headers,
            // })
            socket.emit(truck_2_topic, `${message.value}`);
            socket.broadcast.emit('TRUCK_2_SENSORS', `${message.value}`);
        },
    });
  }

  run_truck_2().catch(e => console.error(`[example/consumer_truck_2] ${e.message}`, e))

  //truck3
  const consumer_truck_3 = kafka.consumer({ groupId: 'truck3-group' , fromOffset: 0})
  const run_truck_3 = async () => {
    const truck_3_topic = 'TRUCK_3_SENSORS'
    await consumer_truck_3.connect();
    await consumer_truck_3.subscribe({ topic: truck_3_topic });
    await consumer_truck_3.run({
        eachMessage: async ({ topic, partition, message }) => {
            // console.log({
            //     key: message.key.toString(),
            //     value: message.value.toString(),
            //     headers: message.headers,
            // })
            socket.emit(truck_3_topic, `${message.value}`);
            socket.broadcast.emit('TRUCK_3_SENSORS', `${message.value}`);
        },
    });
  }

  run_truck_3().catch(e => console.error(`[example/consumer_truck_3] ${e.message}`, e))

  // var pods;
  // var runningpods_arr=[];
  //
  // exec('listpods.sh', (err, stdout, stderr) => {
  //   if (err) {
  //     //some err occurred
  //     console.error(err)
  //     socket.emit('getpods_out', err);
  //   } else {
  //    // the *entire* stdout and stderr (buffered)
  //    console.log(`stdout: ${stdout}`);
  //    pods=`${stdout}`;
  //    var pods_concat=pods.replace(/(?:\r\n|\r|\n)/g,',')
  //    pods_concat=pods_concat.substring(0, pods_concat.length - 1);
  //    console.log('pods_concat',pods_concat)
  //    socket.emit('getpds_out', webcmd_output);
  //    console.log(`stderr: ${stderr}`);
  //    if (stderr) {
  //      console.log(`stderr: ${stderr}`);
  //    }
  //   }
  // });

  var webcmd_output;
  socket.on('webcmd', function(webcmd, callback) {
    exec(webcmd, (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        console.error('got an error',err)
        socket.emit('webcmd_out', err);
      } else {
         // the *entire* stdout and stderr (buffered)
         console.log(`stdout: ${stdout}`);
         webcmd_output=`${stdout}`;
         socket.emit('webcmd_out', webcmd_output);
         console.log(`stderr: ${stderr}`);
         // if (stderr) {
         //   socket.emit('webcmd_out', `stderr: ${stderr}`);
         // }
      }
    });
      console.log(webcmd)
  })

  socket.on('sendcmd_btn', function(data, callback) {
    if (data==='startproduce') {
      exec('start_truck_sensors.sh', (err, stdout, stderr) => {
        if (err) {
          //some err occurred
          console.error(err)
        } else {
         // the *entire* stdout and stderr (buffered)
         console.log(`stdout: ${stdout}`);
         if (stderr) {
           //socket.emit('webcmd_out', `stderr: ${stderr}`);
         }
        }
      });
    } else if (data==='stopproduce') {
      exec('stop_truck_sensors.sh', (err, stdout, stderr) => {
        if (err) {
          //some err occurred
          console.error(err)
          //socket.emit('webcmd_out', err);
        } else {
         // the *entire* stdout and stderr (buffered)
         console.log(`stdout: ${stdout}`);
         //webcmd_output=`${stdout}`;
         //socket.emit('webcmd_out', webcmd_output);
         console.log(`stderr: ${stderr}`);
         if (stderr) {
           //socket.emit('webcmd_out', `stderr: ${stderr}`);
         }
        }
      });
    } else if (data==='killkafka1') {
      exec('killkafka1.sh', (err, stdout, stderr) => {
        if (err) {
          //some err occurred
          console.error(err)
          //socket.emit('webcmd_out', err);
        } else {
         // the *entire* stdout and stderr (buffered)
         console.log(`stdout: ${stdout}`);
         //webcmd_output=`${stdout}`;
         //socket.emit('webcmd_out', webcmd_output);
         console.log(`stderr: ${stderr}`);
         if (stderr) {
           //socket.emit('webcmd_out', `stderr: ${stderr}`);
         }
        }
      });
    }
  })
  // socket.on('stopproduce', function(data, callback) {
  //
  // })
});

//Express Web Endpoints / REST API's
http.listen(socketio_port, function(){
  console.log('listening on *:'+socketio_port);
});

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      await consumer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.map(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})
