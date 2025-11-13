const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// homeService
// 9lfspr2s6I136tvJ
const uri =
  "mongodb+srv://homeService:9lfspr2s6I136tvJ@cluster3.tz5xck1.mongodb.net/?appName=Cluster3";

//   create a mongoClient with a mongoClientOptions object to the stable API version;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // connect the client to the server;
    await client.connect();

    //create database and collection;
    const database = client.db("homeService");
    const serviceCollection = database.collection("services");
    const bookingCollection = database.collection("bookings");
    const customerCollection = database.collection("customers");

    // get API
    app.get("/", (req, res) => {
      res.send("Home service server is running");
    });

    app.get("/customers", async (req, res) => {
      const cursor = customerCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/services-6", async (req, res) => {
      const cursor = serviceCollection.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/all-services", async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/myServices", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.Email = email;
      }
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // post API;
    app.post("/add-service", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    // send a ping to successful connection;
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment.You successfully connected to the MongoDB"
    );
  } finally {
    // Ensure that the client will close when You finish/error;
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
