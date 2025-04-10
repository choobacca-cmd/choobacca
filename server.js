const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const mongoURI = 'mongodb+srv://choobacca:<qazrgplm12A>@choobacca.swzrar7.mongodb.net/?retryWrites=true&w=majority&appName=choobacca';
mongoose.connect(mongoURI)
  .then(() => console.log('Підключено до MongoDB'))
  .catch(err => console.error('Помилка підключення:', err));

const feedbackSchema = new mongoose.Schema({
  type: String,
  date: { type: Date, default: Date.now }
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

app.use(cors());
app.use(express.json());

app.post('/api/feedback', async (req, res) => {
  try {
    const feedback = new Feedback({ type: req.body.type });
    await feedback.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ date: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер працює на порті ${PORT}`);
});