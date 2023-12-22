const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// MiddleWare

app.use(cors());
app.use(express.json());

//DB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0viwxwm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const taskCollection = client.db('taskCrafter').collection('tasks');

        app.get('/api/v1/tasks', async (req, res) => {
            const taskStatus = req.query.status;
            const item = req.query.id;

            let query = {}

            if (taskStatus) {
                query.status = taskStatus
            }

            if (item) {
                query._id = new ObjectId(item)
            }

            const result = await taskCollection.find(query).toArray();
            res.send(result);
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Task Crafter server is running')
})

app.listen(port, () => {
    console.log(`Task Crafter is running on port: ${port}`);
})