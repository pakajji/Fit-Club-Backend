const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
// const config = require('./config')

// const start = async () => {
//   await mongoose.connect(config.mongodb.uri,{
//     user: config.mongodb.username,
//     pass: config.mongodb.password,
//     retryWrites: true
//   })
// }

//start()

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello! Express");
});

app.listen(port, () => {
  console.log("Starting server at port " + port);
});

const { MongoClient } = require("mongodb");
const { default: mongoose } = require("mongoose");
const uri = process.env.URI

app.get("/activity", async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const activities = await client
    .db("mydb")
    .collection("activities")
    .find({})
    .toArray();
  await client.close();
  res.status(200).send(activities);
});

//หน้าอัพเดทแอคทิวิตี้
// app.get('/add-activity/:id',async (req,res)=>{
//   const id = req.params.id;
//   const client = new MongoClient(uri);
//   await client.connect();
//   const activity = await client.db("mydb").collection("activities").findOne({"id": id})
//   await client.close()
//   res.status(200).send(activity);
// })

//เพิ่มและอัพเดท
app.put("/activity", async (req, res) => {
  const activity = req.body;
  const id = activity.id;
  const client = new MongoClient(uri);
  await client.connect();
  await client.db("mydb").collection("activities").updateOne({"id": id}, {"$set": {
      id: activity.id,
      user: activity.user,
      title: activity.title,
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
});

app.delete("/activity/:id", async (req, res) => {
  const id = req.params.id;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    await client.db("mydb").collection("activities").deleteOne({ id: id });
    await client.close();
    res.status(200).send("User with ID = " + id + " is deleted.");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something is wrong");
  }
});

app.get('/activity/run',async (req,res)=>{
  const client = new MongoClient(uri);
  await client.connect();
  const run = await client.db("mydb").collection("activities").find({ type : "run" }).toArray()
  await client.close()
  res.status(200).send(run);
})

app.get('/activity/walk',async (req,res)=>{
  const client = new MongoClient(uri);
  await client.connect();
  const walk = await client.db("mydb").collection("activities").find({ type : "walk" }).toArray()
  await client.close()
  res.status(200).send(walk);
})

app.get('/activity/swimming',async (req,res)=>{
  const client = new MongoClient(uri);
  await client.connect();
  const swimming = await client.db("mydb").collection("activities").find({ type : "swimming" }).toArray()
  await client.close()
  res.status(200).send(swimming);
})

app.get('/activity/bicycleride',async (req,res)=>{
  const client = new MongoClient(uri);
  await client.connect();
  const bicycleride = await client.db("mydb").collection("activities").find({ type : "bicycleride" }).toArray()
  await client.close()
  res.status(200).send(bicycleride);
})

app.get('/activity/hiking',async (req,res)=>{
  const client = new MongoClient(uri);
  await client.connect();
  const hiking = await client.db("mydb").collection("activities").find({ type : "hiking" }).toArray()
  await client.close()
  res.status(200).send(hiking);
})


//Post User
app.post("/register", async (req, res) => {
  const user = req.body;
  console.log(user)
  const client = new MongoClient(uri);
  await client.connect();
  await client
    .db("mydb")
    .collection("users")
    .insertOne({
      id: parseInt(user.id),
      user: user.name,
      surname: user.surname,
      email: user.email,
      password: user.password,
      confirmPassword: user.confirmPassword,
    });
  await client.close();
  res.status(200).send({
    status: "ok",
    message: "User with ID" + user.id + "is created",
    user: user
  });
});

//For K.Nine - update+insert User
// app.put("/register", async (req, res) => {
//   const user = req.body;
//   const id = parseInt(user.id);
//   const client = new MongoClient(uri);
//   await client.connect();
//   await client
//     .db("mydb")
//     .collection("users")
//     .updateOne(
//       { id: id },
//       {
//         $set: {
//           id: parseInt(user.id),
//           user: user.name,
//           surname: user.surname,
//           email: user.email,
//           password: user.password,
//           confirmPassword: user.confirmPassword,
//         },
//       },
//       { upsert: true }
//     );
//   await client.close();
//   res.status(200).send(user);
// });
