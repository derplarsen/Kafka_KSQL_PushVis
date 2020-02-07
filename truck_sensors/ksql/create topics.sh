CREATE STREAM TRUCK_ENGINE_SENSORS
(
    TRUCK_ID STRING,
    ENGINE_TEMPERATURE INTEGER,
    AVERAGE_RPM INTEGER
)
WITH (
    KAFKA_TOPIC = 'TRUCK_ENGINE_SENSORS',
    VALUE_FORMAT = 'JSON'
);

CREATE STREAM TRUCK_1_ENGINE_SENSORS
WITH (
    KAFKA_TOPIC = 'TRUCK_1_SENSORS',
    VALUE_FORMAT = 'JSON'
) AS
SELECT
    ROWTIME as readtime,
    TRUCK_ID,
    ENGINE_TEMPERATURE,
    AVERAGE_RPM
FROM TRUCK_ENGINE_SENSORS
WHERE TRUCK_ID='1'
PARTITION BY TRUCK_ID;

CREATE STREAM TRUCK_2_ENGINE_SENSORS
WITH (
    KAFKA_TOPIC = 'TRUCK_2_SENSORS',
    VALUE_FORMAT = 'JSON'
) AS
SELECT
    ROWTIME as readtime,
    TRUCK_ID,
    ENGINE_TEMPERATURE,
    AVERAGE_RPM
FROM TRUCK_ENGINE_SENSORS
WHERE TRUCK_ID='2'
PARTITION BY TRUCK_ID;

CREATE STREAM TRUCK_3_ENGINE_SENSORS
WITH (
    KAFKA_TOPIC = 'TRUCK_3_SENSORS',
    VALUE_FORMAT = 'JSON'
) AS
SELECT
    ROWTIME as readtime,
    TRUCK_ID,
    ENGINE_TEMPERATURE,
    AVERAGE_RPM
FROM TRUCK_ENGINE_SENSORS
WHERE TRUCK_ID='3'
PARTITION BY TRUCK_ID;