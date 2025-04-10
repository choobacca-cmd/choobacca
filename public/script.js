async function leaveFeedback(type) {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      const result = await response.json();
      alert(result.success ? 'Дякуємо за відгук!' : 'Помилка');
    } catch (error) {
      console.error('Помилка:', error);
    }
  }
  
  async function loadFeedback() {
    try {
      const response = await fetch('/api/feedback');
      const feedbacks = await response.json();
      const list = document.getElementById('feedback-list');
      list.innerHTML = feedbacks.map(f => `
        <div class="feedback-item">
          <span>${f.type === 'good' ? '😊' : '😞'}</span>
          <span>${new Date(f.date).toLocaleString()}</span>
        </div>
      `).join('');
    } catch (error) {
      console.error('Помилка:', error);
    }
  }