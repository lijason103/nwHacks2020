const express = require('express')
const app = express()
const port = 3000

const standard_lib_token = 'tok_dev_eVoWNiq7rJ7u7H1vwYRa78ZytVfDWmrHhfS98NkWvmEag7qGgTbozEWUujtevB6T'
const lib = require('lib')({token: standard_lib_token});
const query = lib.googlesheets.query['@0.3.0'];

app.post('/login', (req, res) => {
    const user_id = 'hi'
    res.send({user_id})
})

app.get('/jobs', (req, res) => {
    const user_id = 'hi'

    // TODO: only send if it matches the user_id
    const getJobs = async () => {
        let result = await query.select({
            range: "jobs!A1:G999" // (required)
        });
        res.send(result)
    }
    getJobs()
})

app.post('/send-sms', (req, res) => {
    console.log('Sent')
    res.send('Sent')
})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))