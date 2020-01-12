const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const port = 5000

const standard_lib_token = 'tok_dev_eVoWNiq7rJ7u7H1vwYRa78ZytVfDWmrHhfS98NkWvmEag7qGgTbozEWUujtevB6T'
const lib = require('lib')({token: standard_lib_token});
const query = lib.googlesheets.query['@0.3.0'];

app.post('/login', (req, res) => {
    const user_id = 'hi'
    res.send({ user_id })
})

app.get('/jobs', (req, res) => {
    const user_id = 'hi'

    // TODO: only send if it matches the user_id
    const getJobs = async () => {
        let result = await query.select({
            range: "jobs!A1:G999" // (required)
        });
        console.log(result)
        res.send(result.rows)
    }
    getJobs()
})

app.post('/jobs', (req, res) => {
    const { user_id, url, selector, condition, value } = req.body
    const id = 100
    console.log(req.body);
    const addJob = async () => {
        await query.insert({
            range: "jobs!A1:G4",
            fieldsets: [
              {
                "id": id,
                "user_id": user_id,
                "url": url,
                "selector": selector,
                "condition": condition,
                "value": value,
              }
            ]
        });
        res.sendStatus(200)
    }
    addJob()
})

app.post('/jobs', (req, res) => {
    const { id, user_id, url, selector, condition, value } = req.body
    const id = 100

    const addJob = async () => {
        await query.insert({
            range: "jobs!A1:G999",
            fieldsets: [
              {
                "id": id,
                "user_id": user_id,
                "url": url,
                "selector": selector,
                "condition": condition,
                "value": value,
              }
            ]
        });
        res.sendStatus(200)
    }
    addJob()
})

app.put('/jobs', (req, res) => {
    const { id, initial_value, error } = req.body

    const updateJob = async () => {
        await query.update({
            range: "jobs!A1:H999", // (required)
            where: [
              {
                "id": id
              }
            ],
            fields: {
              "initial_value": initial_value,
              "error": error
            }
        });
        res.sendStatus(200)
    }
    updateJob()
})

app.post('/send-sms', (req, res) => {
    console.log('Sent')
    res.send('Sent')
})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))