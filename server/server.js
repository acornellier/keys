import express from 'express'
import cors from 'cors'

import { decodeRoute } from './decodeRoute.js'
import { encodeRoute } from './encodeRoute.js'

const app = express()

app.use(express.json())

app.use(cors())

app.post('/api/decodeRoute', async (req, res) => {
  try {
    const route = await decodeRoute(req.body.str)
    res.json(route)
  } catch (e) {
    res.status(422).send(e.message)
  }
})

app.post('/api/encodeRoute', async (req, res) => {
  try {
    const route = await encodeRoute(req.body.mdtRoute)
    res.json(route)
  } catch (e) {
    console.error(e)
    throw e
  }
})

const { PORT = 6173 } = process.env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
