const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://AkhiIslam:XuOZ6v0UH7gdTj4I@cluster0.i3pr0m5.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const productCollection = client.db("productDB").collection("product");

    app.get("/product", async (req, res) => {
      const cursor = await productCollection.find().toArray();
      res.send(cursor);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    // create product

    app.post("/product/", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    // update product

    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateProduct = req.body;
      const product = {
        $set: {
          name: updateProduct.name,
          photo: updateProduct.photo,
          price: updateProduct.price,
          brand: updateProduct.brand,
          type: updateProduct.type,
          category: updateProduct.category,
          rating: updateProduct.rating,
        },
      };
      const result = await productCollection.updateOne(filter, product, option);
      res.send(result);
    });

    // delete product

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Product Assignment making server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
