const { search } = require('../scraper')

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const q = (req.query.q || '').trim()
    if (!q) return res.status(400).json({ status: false, message: 'Query kosong' })
    const result = await search(q)
    res.status(200).json({ status: true, query: q, total: result.length, result })
  } catch (e) {
    res.status(500).json({ status: false, message: e.message })
  }
}
