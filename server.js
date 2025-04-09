const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors()); 

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
};

const FEEDBACK_DIR = path.join(__dirname, 'feedbacks');
ensureDirectoryExists(FEEDBACK_DIR);

app.post('/api/feedback', (req, res) => {
    const { type } = req.body;
    
    if (!type) {
        return res.status(400).json({ error: 'Тип відгуку обов\'язковий' });
    }

    const fileName = `${type}_feedback.txt`;
    const filePath = path.join(FEEDBACK_DIR, fileName);
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] Відгук типу: ${type}\n`;

    fs.appendFile(filePath, logEntry, (err) => {
        if (err) {
            console.error('Помилка запису:', err);
            return res.status(500).json({ error: 'Помилка сервера' });
        }
        res.json({ success: true, message: 'Відгук збережено' });
    });
});

app.get('/api/feedback/stats', (req, res) => {
    fs.readdir(FEEDBACK_DIR, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Помилка читання' });
        }

        const stats = {};
        files.forEach(file => {
            const type = file.split('_')[0];
            stats[type] = (stats[type] || 0) + 1;
        });

        res.json(stats);
    });
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Сервер запущено на http://0.0.0.0:3000");
});