const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const FEEDBACK_DIR = path.join(__dirname, 'feedback_data');
const FEEDBACK_FILE = path.join(FEEDBACK_DIR, 'feedback.json');

if (!fs.existsSync(FEEDBACK_DIR)) {
  fs.mkdirSync(FEEDBACK_DIR, { recursive: true });
}

app.post('/api/feedback', (req, res) => {
  const feedback = {
    type: req.body.type, 
    date: new Date().toISOString(),
    ip: req.ip 
  };

  fs.appendFileSync(FEEDBACK_FILE, JSON.stringify(feedback) + '\n');

  res.json({ success: true });
});

app.get('/api/feedback', (req, res) => {
  if (fs.existsSync(FEEDBACK_FILE)) {
    const data = fs.readFileSync(FEEDBACK_FILE, 'utf-8');
    const feedbacks = data.split('\n').filter(Boolean).map(JSON.parse);
    res.json(feedbacks);
  } else {
    res.json([]);
  }
});

app.get('/download-feedback', (req, res) => {
    res.download(FEEDBACK_FILE);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер працює на порті ${PORT}`);
});