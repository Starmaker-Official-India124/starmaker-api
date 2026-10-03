const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); 

app.get('/api/lookup', async (req, res) => {
    const sid = req.query.sid;
    if (!sid) return res.status(400).json({ error: "StarMaker ID zaroori hai" });

    try {
        const targetUrl = `https://starmaker.id.vn/wp-json/sm-user/v1/lookup?sid=${sid}`;
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Referer': 'https://starmaker.id.vn/',
                'Origin': 'https://starmaker.id.vn'
            },
            timeout: 10000
        });
        res.json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Data nahi mila.", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
