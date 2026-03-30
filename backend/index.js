const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
            return callback(null, true);
        }

        return callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!allowedOrigins.length || !supabaseUrl || !supabaseKey || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('Missing required environment variables. Check SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL, ADMIN_PASSWORD, and FRONTEND_URL.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/api/health', (_req, res) => {
    res.status(200).json({ ok: true });
});

app.post('/api/feedback', async (req, res) => {
    const { name, email, comment } = req.body;

    if (!name || !email || !comment) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const { data, error } = await supabase
            .from('feedback')
            .insert([{ name, email, comment }]);

        if (error) {
            console.error('Supabase error:', error.message);
            return res.status(500).json({ error: 'Failed to save feedback to database.' });
        }

        return res.status(200).json({ message: 'Feedback submitted successfully!', data });
    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        return res.status(200).json({ success: true, token: 'simple-admin-token' });
    } else {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.get('/api/admin/feedback', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== 'Bearer simple-admin-token') {
        return res.status(401).json({ error: 'Unauthorized access.' });
    }

    try {
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error.message);
            return res.status(500).json({ error: 'Failed to fetch feedback.' });
        }

        return res.status(200).json(data);
    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

app.use((err, _req, res, next) => {
    if (err && err.message && err.message.includes('not allowed by CORS')) {
        return res.status(403).json({ error: err.message });
    }

    return next(err);
});

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
