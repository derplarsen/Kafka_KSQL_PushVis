# Summary:

This project is a quick example of how to get data out of kafka in realtime, do some stream processing to make it more effective in charts, and then PUSH it to a web client, rather than the old paradigm of *pull* and *batch*. 

This example uses Websockets (Socket.io NPM), however I have also implemented this in Server Sent Events, which I will probably integrate into this repo so you can run either/both depending on your requirements.


This assumes you've run Confluent tarball (or have another Confluent Kafka environment running). It's assumes non-secured cluster and thus a non-SASL client config, in the client config of `kafkajs-vis-server.js` you'll see a commented section for if you do need to specify jaas config. 

https://docs.confluent.io/current/quickstart/ce-quickstart.html

# How to get up and running:
1. Fire up iTerm2 and go into your confluent home directory (in this case 5.4.0 tarball).

```cd ~/Confluent/confluent-5.4.0```


2. Fire up another iTerm2 and go into 

```cd ~/kafkavis/truck_sensors/producers```

3. In iTerm2, go to Shell / Split Horizontally and

```cd ~/Confluent/confluent-5.4.0```

..then..

```
bin/kafka-topics --create --topic TRUCK_ENGINE_SENSORS --replication-factor 1 --partitions 1 --bootstrap-server localhost:9092
bin/kafka-topics --create --topic TRUCK_1_SENSORS --replication-factor 1 --partitions 1 --bootstrap-server localhost:9092
bin/kafka-topics --create --topic TRUCK_2_SENSORS --replication-factor 1 --partitions 1 --bootstrap-server localhost:9092
bin/kafka-topics --create --topic TRUCK_3_SENSORS --replication-factor 1 --partitions 1 --bootstrap-server localhost:9092
```

4. In same iTerm2 run..

```bin/kafka-console-consumer --bootstrap-server localhost:9092 --topic TRUCK_ENGINE_SENSORS --from-beginning```

…then in above terminal pane, run producer script..

```./producers.sh```

5. In a fresh console run 

```ksql```

..then..

Open the truck_streams.ksql file in a text editor and walk through each section via the KSQL CLI, copy/paste into ksql and run, ensure each is successful.

6. Run a select query on the ingest topic and produce data, see it coming through

```Select * from TRUCK_ENGINE_SENSORS;```

Then show that TRUCK_1_ENGINE_SENSORS is getting data to it.

```Select * from TRUCK_1_ENGINE_SENSORS;```

7. In a fresh console run 
```node kafkajs-vis-server.js```

8. Open the web page (index.html) and watch the data roll in



<b>Note also for showing how bidirectinal websocket communication works - </b>

1. Push the start/stop producing buttons and look at correspending code in kafkajs-vis-server.js 
2. Click into the input field under the vis run a command like `ls` and hit enter.. show that we can execute commands on the remote system (that's how start/stop producer runs). 
