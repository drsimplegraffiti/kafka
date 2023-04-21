const express = require("express");
const kafka = require("kafka-node");
// const compression = require("compression");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());
// app.use(compression());

// chek if kafka is running fine
const dbRunningFine = async () => {
  // db connection using the url
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }

  // define schema
  const User = new mongoose.model("user", {
    name: String,
    email: String,
  });

  const client = new kafka.KafkaClient({
    kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
  });

  const consumer = new kafka.Consumer(
    client,
    [{ topic: process.env.KAFKA_TOPIC, partition: 0 }],
    {
      autoCommit: false,
    }
  );

  consumer.on("message", async (message) => {
    console.log(message);
    const data = JSON.parse(message.value);
    const user = new User(data);
    await user.save();
  });
    
    // error handling
    consumer.on("error", (err) => {
        console.log(err);
        });
};

setTimeout(dbRunningFine, 1000); // wait for 10 seconds

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
