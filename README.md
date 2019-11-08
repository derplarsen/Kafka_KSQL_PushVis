This assumes you've run Confluent tarball (or have another Confluent Kafka environment running):

https://docs.confluent.io/current/quickstart/ce-quickstart.html

# How to get up and running:
1. Fire up iTerm2 and 

```cd ~/Confluent/confluent-5.3.1```


2. Fire up another iTerm2 and 

```cd ~/kafkavis/truck_sensors/producers```

3. In iTerm2, go to Shell / Split Horizontally and

```cd ~/Confluent/confluent-5.3.1```

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

Open the truck_streams.ksql file in a text editor and walk through each section, copy/paste into ksql and run, ensure each is successful

6. Run a select query on the ingest topic and produce data, see it coming through

```Select * from TRUCK_ENGINE_SENSORS;```

Then show that TRUCK_1_ENGINE_SENSORS is getting data to it.

```Select * from TRUCK_1_ENGINE_SENSORS;```

7. In a fresh console run 
```node kafkajs-vis-server.js```

8. Open the web page and watch the data roll in

<b>(Stop/Start producer as desired)</b>
