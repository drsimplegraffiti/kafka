const express = require("express");
const kafka = require("kafka-node");
const pg = require("pg");
const app = express();

app.use(express.json());

// chek if kafka is running fine
const dbRunningFine = async () => {
  // db connection using the url
  const pool = new pg.Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  const client = new kafka.KafkaClient({
    kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
  });
  const producer = new kafka.Producer(client);

  producer.on("ready", async () => {
      console.log("Producer is ready");
      
      // create user table
      pool.query(
          'CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255))'
      );
      

    app.post("/", async (req, res) => {
        try {
            const { name, email } = req.body;
            const query = `INSERT INTO users (name, email) VALUES ('${name}', '${email}')`;
            await pool.query(query);
            console.log("User created");
            const payload = [
              {
                topic: process.env.KAFKA_TOPIC,
                messages: JSON.stringify(req.body),
                partition: 0,
              },
            ];
            producer.send(payload, (err, data) => {
              if (err) {
                console.log(err);
                return res.status(500).send("Internal Server Error");
              }
              console.log(data);
            });
            return res.status(201).send("User created");
      } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
      }
    });
  });
};

setTimeout(dbRunningFine, 1000); // wait for 10 seconds

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
