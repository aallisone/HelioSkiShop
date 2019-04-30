const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const monk = require('monk')
const bodyParser = require('body-parser')
const cors = require('cors')
// Connection URL
const url = 'mongodb://user1:Password@cluster0-shard-00-00-rahtc.mongodb.net:27017,cluster0-shard-00-01-rahtc.mongodb.net:27017,cluster0-shard-00-02-rahtc.mongodb.net:27017/skis?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';

const db = monk(url);

db.then(() => {
    console.log('Connected correctly to server')
})

const collection = db.get("skis")

app.use(bodyParser.json())
app.use(cors())

// get all entries
app.get('/', async (req, res) => {
    const result = await collection.find()
    return res.status(200).send(result)})

// get a single entry
app.get('/get/:id', async (req, res) => {
    const result = await collection.findOne(req.params.id)
    return res.status(200).send(result)})

// add to entries
app.post('/Create', async (req, res) => {
    const result = await collection.insert(req.body)
    return res.status(200).send(result)
})

// delete an entry
app.delete('/delete/:id', async (req, res) => {
    await collection.findOneAndDelete(req.body)
    return res.status(200).send(await collection.find())
})

app.put('/edit/:id', async (req, res) => {
    const result = await collection.findOneAndUpdate(req.params.id, req.body)
    console.log("Updated")
    return res.status(200).send(result)
})
app.listen(port, () => console.log(`App listening on port ${port}!`))