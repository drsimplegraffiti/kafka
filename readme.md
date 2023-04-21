#### pub-sub architecture. 

Pub-sub is a messaging pattern where senders of messages (publishers) don't send messages directly to specific receivers (subscribers). Instead, publishers send messages to a message broker (in our case, Kafka), which then delivers the messages to any interested subscribers.

#### Start npm project

- npm init -y
- npm install kafka-node mysql

---


#### Run docker
docker compose up


#### connect to mongo
> mongodb://localhost:27017/app2

When you send a request to 
localhost:8080
```json
{
    "email":"abayomio@gmail.com",
    "name":"admin1"
}
```

You get the user created in postgres


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rc8wgjwbp0xqsmq9wocy.png)



![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/sr057gx026f27dcmec1j.png)
