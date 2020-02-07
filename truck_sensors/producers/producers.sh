kafka-producer-perf-test \
    --topic TRUCK_ENGINE_SENSORS \
    --throughput 2 \
    --producer-props bootstrap.servers=localhost:9092 \
    --payload-file ../data/truck_engine_sensors.json \
    --num-records 1000 &
