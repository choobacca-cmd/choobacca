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

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.post('/api/feedback', (req, res) => {
  const { name, emoji, emojiText, dynamicComment, comment } = req.body;

  if (!name || !emoji) {
    return res.status(400).json({
      success: false,
      error: "Необхідно вказати ім'я та настрій"
    });
  }

  const feedback = {
    name,
    emoji,
    emojiText,
    dynamicComment: dynamicComment || '',
    comment: comment || '',
    date: new Date().toISOString()
  };

  try {
    fs.appendFileSync(FEEDBACK_FILE, JSON.stringify(feedback) + '\n');

    console.log(`Збережено новий відгук від ${name}`);

    res.json({
      success: true,
      message: "Відгук успішно збережено"
    });
  } catch (error) {
    console.error('Помилка збереження відгуку:', error);
    res.status(500).json({
      success: false,
      error: 'Помилка сервера при збереженні відгуку'
    });
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
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          console.error('Помилка парсингу відгуку:', line);
          return null;
        }
      })
      .filter(feedback => feedback !== null)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 20);

    res.json(feedbacks);
  } catch (error) {
    console.error('Помилка читання відгуків:', error);
    res.status(500).json({
      error: 'Помилка сервера при отриманні відгуків'
    });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Маршрут не знайдено'
  });
});

app.use((err, req, res, next) => {
  console.error('Помилка сервера:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Внутрішня помилка сервера'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер працює на порті ${PORT}`);
  console.log(`Відгуки зберігаються у файлі: ${FEEDBACK_FILE}`);
});