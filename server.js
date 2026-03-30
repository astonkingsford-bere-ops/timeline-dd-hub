const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({limit:'4mb'}))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './dist')))
}

app.post('/api/claude', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: { message: 'ANTHROPIC_API_KEY not configured' } })
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(req.body)
    })
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (err) {
    res.status(500).json({ error: { message: err.message } })
  }
})

app.get('/api/search', async (req, res) => {
  const { q, num = 5 } = req.query
  const apiKey = process.env.SERP_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'SERP_API_KEY not configured' })
  if (!q) return res.status(400).json({ error: 'Missing q' })
  try {
    const url = new URL('https://serpapi.com/search.json')
    url.searchParams.set('engine', 'google')
    url.searchParams.set('q', q)
    url.searchParams.set('api_key', apiKey)
    url.searchParams.set('num', num)
    url.searchParams.set('gl', 'uk')
    url.searchParams.set('hl', 'en')
    const response = await fetch(url.toString())
    const data = await response.json()
    if (data.error) return res.status(400).json({ error: data.error })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serpConfigured: !!process.env.SERP_API_KEY, claudeConfigured: !!process.env.ANTHROPIC_API_KEY })
})

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'))
  })
}

app.listen(PORT, () => console.log(`Timeline DD Hub running on port ${PORT}`))
