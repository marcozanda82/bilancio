import express from 'express';
import fetch from 'node-fetch';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// La tua chiave API ora non è più nel codice, ma in una variabile d'ambiente
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

app.use(express.json());

// Endpoint che il tuo client chiamerà
app.post('/api/gemini-proxy', async (req, res) => {
    try {
        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: "Chiave API non configurata." });
        }

        const requestBody = req.body;
        const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Errore API: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error('Errore nel proxy:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve il file index.html
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '.' });
});

app.listen(PORT, () => {
    console.log(`Server proxy in ascolto sulla porta ${PORT}`);
});