const express = require('express')
const pino = require('pino-http')()
const app = express()

app.use(express.json())
app.use(pino) // Logging middleware

app.get('/health', (req, res) => {
  req.log.info('Health check')
  res.status(200).json({ status: 'OK' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
