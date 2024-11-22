const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();

// Enable CORS for development
const isDev = process.env.NODE_ENV !== 'production';
if (isDev) {
    app.use(cors({
        origin: true,
        credentials: true
    }));
}

// Serve static files in production
if (!isDev) {
    app.use(express.static(path.join(__dirname, 'build')));
}

// Headers required by NSE
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
};

let cookies = '';

// Initialize cookies
async function initializeCookies() {
    try {
        const response = await axios.get('https://www.nseindia.com', { headers });
        cookies = response.headers['set-cookie'].join(';');
        console.log('Cookies initialized');
    } catch (error) {
        console.error('Error initializing cookies:', error);
    }
}

// Initialize cookies on server start
initializeCookies();
// Refresh cookies every 30 minutes
setInterval(initializeCookies, 30 * 60 * 1000);

app.get('/api/option-chain/:type/:symbol', async (req, res) => {
    try {
        const { type, symbol } = req.params;
        const url = type === 'indices' 
            ? `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`
            : `https://www.nseindia.com/api/option-chain-equities?symbol=${symbol}`;

        const response = await axios.get(url, {
            headers: {
                ...headers,
                Cookie: cookies
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching option chain:', error);
        res.status(500).json({ error: 'Failed to fetch option chain data' });
    }
});

// Serve index.html for all other routes in production
if (!isDev) {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server is accessible at http://localhost:${PORT} and on your local network`);
});
