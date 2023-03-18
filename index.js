const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000
require('dotenv').config()

// Middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@simpledb.jrt478f.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

     try{
          const productCollection = client.db('ema-john').collection('products');

          // Products paginations
          app.get('/products', async(req, res) => {
               const page = parseInt(req.query.page);
               const size = parseInt(req.query.size);
               // console.log(page, size);
               const query = {};
               const cursor = productCollection.find(query);
               const products = await cursor.skip(page*size).limit(size).toArray();
               const count = await productCollection.estimatedDocumentCount();

               res.send({count, products});
          })

          // post api
          app.post('/productsByIds', async(req, res) => {
               const ids = req.body;
               // console.log(ids);
               const objectIds = ids.map(id => new ObjectId(id));
               const query = {_id: { $in: objectIds }};
               const cursor = productCollection.find(query);
               const products = await cursor.toArray();
               res.send(products);
          })

     }
     finally{}

}
run().catch(console.dir);

app.get('/', (req, res) => {
     res.send("Ema-john Server is Runing........")
})


app.listen(port, () => {
     console.log("ema-john server is runing...");
})





