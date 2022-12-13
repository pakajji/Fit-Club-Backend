const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
res.send("Hello! Express");
});

app.listen(port, () => {
console.log("Starting server at port " + port);
});

const { MongoClient } = require('mongodb')
const uri = "mongodb+srv://jsd3-3-final-project:jsd3-3-final-project@fitclub.ce61urd.mongodb.net/test"


app.get('/activity',async (req,res)=>{
  const client = new MongoClient(uri);
  await client.connect();
  const activities = await client.db("mydb").collection("activities").find({}).toArray()
  await client.close()
  res.status(200).send(activities);
})

app.get('/activity/:id',async (req,res)=>{
  const id = req.params.id;
  const client = new MongoClient(uri);
  await client.connect();
  const activity = await client.db("mydb").collection("activities").findOne({"id": id})
  await client.close()
  res.status(200).send(activity);
})

app.put('/activity',async (req,res)=>{
  const activity = req.body;
  const id = activity.id;
  const client = new MongoClient(uri);
  await client.connect();
  await client.db("mydb").collection("activities").updateOne({"id": id}, {"$set": {
      id: activity.id,
      user: activity.user,
      type: activity.type,
      description: activity.description,
      date: activity.date,
      time: activity.time,
      numberset: parseInt(activity.numberset),
      calburned: parseInt(activity.calburned),
      duration: parseInt(activity.duration),
      heartrate: activity.heartrate
  }},{upsert: true})
  await client.close()
  res.status(200).send(activity);
})

app.delete('/activity/:id',async (req,res)=>{
  const id = req.params.id;
  console.log("id",id)
  const client = new MongoClient(uri);
  try {
    await client.connect();
    await client.db("mydb").collection("activities").deleteOne({"id": id})
    await client.close()
    res.status(200).send("User with ID = " + id + " is deleted.");
  } catch (error) {
    console.log(error)
    res.status(500).send("Something is wrong")
  }
  
})