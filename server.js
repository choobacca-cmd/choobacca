const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const FEEDBACK_DIR = path.join(__dirname, 'feedback_data');
const FEEDBACK_FILE = path.join(FEEDBACK_DIR, 'feedback.json');

if (!fs.existsSync(FEEDBACK_DIR)) {
    fs.mkdirSync(FEEDBACK_DIR, { recursive: true });
}

app.post('/api/feedback', (req, res) => {
    const feedback = {
        name: req.body.name,
        emoji: req.body.emoji,
        emojiText: req.body.emojiText,
        comment: req.body.comment,
        date: new Date().toISOString()
    };

    try {
        fs.appendFileSync(FEEDBACK_FILE, JSON.stringify(feedback) + '\n');
        res.json({ success: true });
    } catch (error) {
        console.error('Помилка збереження відгуку:', error);
        res.status(500).json({ success: false });
    }
});

app.get('/api/feedbacks', (req, res) => {
    if (!fs.existsSync(FEEDBACK_FILE)) {
        return res.json([]);
    }

    try {
        const data = fs.readFileSync(FEEDBACK_FILE, 'utf-8');
        const feedbacks = data.split('\n')
            .filter(line => line.trim() !== '')
            .map(JSON.parse)
            .reverse() 
            .slice(0, 20); 
        
        res.json(feedbacks);
    } catch (error) {
        console.error('Помилка читання відгуків:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// Старт сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер працює на порті ${PORT}`);
});