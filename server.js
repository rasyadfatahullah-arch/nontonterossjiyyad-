const http = require('http')
const fs = require('fs')
const path = require('path')
const { URL } = require('url')
const { search, detail, watch, BASE } = require('./scraper')

const PORT = process.env.PORT || 3000
const PUBLIC = path.join(__dirname, 'public')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Content-Length': Buffer.byteLength(body)
  })
  res.end(body)
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const type = MIME[ext] || 'application/octet-stream'
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('Not Found')
      return
    }
    res.writeHead(200, { 'Content-Type': type })
    res.end(data)
  })
}

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, `http://localhost:${PORT}`)
    const pathname = u.pathname

    if (pathname === '/api/search') {
      const q = (u.searchParams.get('q') || '').trim()
      if (!q) return sendJson(res, 400, { status: false, message: 'Query kosong' })
      try {
        const result = await search(q)
        return sendJson(res, 200, { status: true, query: q, total: result.length, result })
      } catch (e) {
        return sendJson(res, 500, { status: false, message: e.message })
      }
    }

    if (pathname === '/api/detail') {
      let url = (u.searchParams.get('url') || '').trim()
      if (!url) return sendJson(res, 400, { status: false, message: 'URL kosong' })
      if (!url.startsWith(BASE)) {
        return sendJson(res, 400, { status: false, message: 'URL harus dari ' + BASE })
      }
      try {
        if (/\/nonton\//.test(url)) {
          const w = await watch(url)
          if (!w.anime_url) throw new Error('Link anime tidak ditemukan')
          url = w.anime_url
        }
        const result = await detail(url)
        return sendJson(res, 200, { status: true, result })
      } catch (e) {
        return sendJson(res, 500, { status: false, message: e.message })
      }
    }

    if (pathname === '/api/watch') {
      let url = (u.searchParams.get('url') || '').trim()
      if (!url) return sendJson(res, 400, { status: false, message: 'URL kosong' })
      if (!url.startsWith(BASE)) {
        return sendJson(res, 400, { status: false, message: 'URL harus dari ' + BASE })
      }
      try {
        if (/\/anime\//.test(url)) {
          const d = await detail(url)
          const last = d.episodes[d.episodes.length - 1]
          if (!last) throw new Error('Episode tidak ditemukan')
          url = last.url
        }
        const result = await watch(url)
        return sendJson(res, 200, { status: true, result })
      } catch (e) {
        return sendJson(res, 500, { status: false, message: e.message })
      }
    }

    let filePath = path.join(PUBLIC, pathname === '/' ? 'index.html' : pathname)
    if (!filePath.startsWith(PUBLIC)) {
      res.writeHead(403)
      return res.end('Forbidden')
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(PUBLIC, 'index.html')
    }
    sendFile(res, filePath)
  } catch (e) {
    sendJson(res, 500, { status: false, message: e.message })
  }
})

server.listen(PORT, () => {
  console.log(`NONTONTEROSS running at http://localhost:${PORT}`)
  console.log(`Owner: jiyyad tools`)
})
