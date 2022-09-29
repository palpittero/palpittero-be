import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import router from './router'

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use('/api', router)

const port = process.env.API_PORT || '3000'

app.listen(port, () => console.log(`Listening on port ${port}`))
