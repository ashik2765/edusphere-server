const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 4000

//midleware
app.use(cors())
app.use(express.json())


const uri = process.env.DATABASE_URL;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();

        const coursesDB = client.db("coursesDB");
        const courseCollection = coursesDB.collection("coursesCollection");
        const eduUserCollection = coursesDB.collection("edusphereUser");

        //users api
        app.post("/users", async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await eduUserCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: "user already Exist", insertedId: null })
            }
            const result = await eduUserCollection.insertOne(user)
            res.send(result)
        });

        //Courses api
        app.post('/courses', async (req, res) => {
            const courseData = req.body;
            const result = await courseCollection.insertOne(courseData);
            res.send(result)
        });
        app.get('/courses', async (req, res) => {
            const courseData = courseCollection.find()
            const result = await courseData.toArray();
            res.send(result);
        });
        app.get('/courses/:id', async (req, res) => {
            const id = req.params.id;
            const result = await courseCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})