const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Serve built frontend in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path')
  app.use(express.static(path.join(__dirname, './dist')))
}

// SerpAPI proxy — called by the DD Hub board report generator
app.get('/api/search', async (req, res) => {
  const { q, num = 5 } = req.query
  const apiKey = process.env.SERP_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'SERP_API_KEY not configured on server' })
  }
  if (!q) {
    return res.status(400).json({ error: 'Missing query param q' })
  }

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

    if (data.error) {
      return res.status(400).json({ error: data.error })
    }

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serpConfigured: !!process.env.SERP_API_KEY })
})

// Fallback to index.html for client-side routing in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path')
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Timeline DD Hub API running on port ${PORT}`)
})
