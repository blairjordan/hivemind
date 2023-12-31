```
docker pull timescale/timescaledb-ha:pg14-latest
```


```
docker run -d --name timescaledb -p 5432:5432 -e POSTGRES_PASSWORD=password timescale/timescaledb-ha:pg14-latest
```

```
psql -U postgres -h localhost
CREATE database hivemind;
\c hivemind
CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE entities (
    id UUID PRIMARY KEY,
    name TEXT,
    type TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE signals (
    from_entity_id UUID REFERENCES entities(id),
    to_entity_id UUID REFERENCES entities(id),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    type TEXT,
    strength FLOAT
);

SELECT create_hypertable('signals', 'created_at');

-- continuous aggregate for every second
CREATE MATERIALIZED VIEW signals_avg_strength_1s
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 second', created_at) AS bucket,
       from_entity_id,
       to_entity_id,
       type,
       AVG(strength) as avg_strength
FROM signals
GROUP BY bucket, from_entity_id, to_entity_id, type;

-- continuous aggregate for every minute
CREATE MATERIALIZED VIEW signals_avg_strength_1m
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 minute', created_at) AS bucket,
       from_entity_id,
       to_entity_id,
       type,
       AVG(strength) as avg_strength
FROM signals
GROUP BY bucket, from_entity_id, to_entity_id, type;

-- continuous aggregate for every hour
CREATE MATERIALIZED VIEW signals_avg_strength_1h
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', created_at) AS bucket,
       from_entity_id,
       to_entity_id,
       type,
       AVG(strength) as avg_strength
FROM signals
GROUP BY bucket, from_entity_id, to_entity_id, type;

SELECT add_continuous_aggregate_policy('signals_avg_strength_1s',
    start_offset => INTERVAL '1 hour',
    end_offset => INTERVAL '1 minute',
    schedule_interval => INTERVAL '5 minutes');


-- demo users
INSERT INTO entities (id, name, type) VALUES
  ('00000000-0000-0000-0000-000000000001', 'user1', 'user'),
  ('00000000-0000-0000-0000-000000000002', 'user2', 'user');

```

