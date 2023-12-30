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

create table signals (
  created_at timestamp not null,
  type text not null,
  strength float not null
);

select create_hypertable('temperatures', 'time');


```

