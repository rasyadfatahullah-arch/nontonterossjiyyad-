const { detail, watch, BASE } = require('../scraper')

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    let url = (req.query.url || '').trim()
    if (!url) return res.status(400).json({ status: false, message: 'URL kosong' })
    if (!url.startsWith(BASE)) {
      return res.status(400).json({ status: false, message: 'URL harus dari ' + BASE })
    }
    if (/\/anime\//.test(url)) {
      const d = await detail(url)
      const last = d.episodes[d.episodes.length - 1]
      if (!last) throw new Error('Episode tidak ditemukan')
      url = last.url
    }
    const result = await watch(url)
    res.status(200).json({ status: true, result })
  } catch (e) {
    res.status(500).json({ status: false, message: e.message })
  }
}
