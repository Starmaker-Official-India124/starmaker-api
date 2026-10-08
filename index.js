const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // frontend ke liye

// Updated StarMaker Lookup Proxy (Using Official API)
app.get('/api/lookup', async (req, res) => {
  const sid = req.query.sid;

  // SID Validation: Check if it exists and is only numbers
  if (!sid || !/^\d+$/.test(sid)) {
    return res.status(400).json({ error: 'Valid numeric StarMaker ID required' });
  }

  try {
    // Live Timestamp (ts) generate करना बहुत ज़रूरी है ताकि API ब्लॉक न हो
    const currentTs = Math.floor(Date.now() / 1000);

    // आपका नया StarMaker API URL (डायनामिक ts और sid के साथ)
    const targetUrl = `https://api.starmakerstudios.com/web/profile/share/detail?ts=${currentTs}&from_sid=${sid}`;

    // Fetch request with standard headers to look like a real browser/app
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://m.starmakerstudios.com',
        'Referer': 'https://m.starmakerstudios.com/'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Upstream API failed', details: data });
    }

    // यहाँ हम StarMaker से मिला पूरा असली डेटा (country वगैरह के साथ) वापस भेज रहे हैं
    res.json({
      ok: true,
      sid: sid,
      api_source: "official_share_api",
      profile_data: data 
    });

  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ error: 'Failed to fetch real data from StarMaker' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('StarMaker Real API Proxy is live 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
