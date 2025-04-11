let currentStep = 1;
let selectedEmoji = '';
let selectedEmojiText = '';
const quotes = [
    "Історія - це дзеркало минулого, світло правди, жива пам'ять, вчитель життя.",
    "Народ, який забуває свою історію, не має майбутнього.",
    "Історія - найкращий учитель, у якого найгірші учні.",
    "Кожна сторінка історії - це урок для майбутніх поколінь."
];

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('emoji-section').style.display = 'none';
    document.getElementById('comment-section').style.display = 'none';
    document.getElementById('feedback-result').style.display = 'none';
    loadFeedbacks();
    changeQuote();
    setInterval(changeQuote, 10000);
});

function changeQuote() {
    const quoteElement = document.getElementById('history-quote');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.style.opacity = 0;
    
    setTimeout(() => {
        quoteElement.textContent = `"${randomQuote}"`;
        quoteElement.style.opacity = 1;
    }, 500);
}

function nextStep() {
    if (currentStep === 1) {
        const name = document.getElementById('name').value.trim();
        if (!name.match(/^[А-ЯҐЄІЇа-яґєії']+\s[А-ЯҐЄІЇа-яґєії']+$/)) {
            alert("Будь ласка, введіть коректне ім'я та прізвище кирилицею");
            return;
        }
        document.getElementById('name-section').style.display = 'none';
        document.getElementById('emoji-section').style.display = 'block';
        document.getElementById('next-btn').textContent = 'Далі';
        currentStep = 2;
    } 
    else if (currentStep === 2) {
        if (!selectedEmoji) {
            alert("Будь ласка, оберіть смайлик");
            return;
        }
        document.getElementById('emoji-section').style.display = 'none';
        document.getElementById('comment-section').style.display = 'block';
        document.getElementById('next-btn').textContent = 'Надіслати відгук';
        currentStep = 3;
    } 
    else if (currentStep === 3) {
        const comment = document.getElementById('comment').value.trim();
        const name = document.getElementById('name').value.trim();
        
        if (!comment) {
            alert("Будь ласка, введіть коментар");
            return;
        }
        
        sendFeedback({
            name: name,
            emoji: selectedEmoji,
            emojiText: selectedEmojiText,
            comment: comment
        });
    }
}

function selectEmoji(emoji, text) {
    selectedEmoji = emoji;
    selectedEmojiText = text;
    
    const emojis = document.querySelectorAll('.emoji-option');
    emojis.forEach(e => e.style.opacity = '0.5');
    event.target.style.opacity = '1';
    event.target.style.transform = 'scale(1.2)';
}

function sendFeedback(feedback) {
    const btn = document.getElementById('next-btn');
    btn.disabled = true;
    btn.textContent = 'Відправка...';
    
    fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback)
    })
    .then(response => {
        if (!response.ok) throw new Error('Помилка сервера');
        return response.json();
    })
    .then(data => {
        btn.textContent = '✓ Успішно!';
        btn.style.backgroundColor = '#2e8b57';
        showFeedbackResult();
        loadFeedbacks();
    })
    .catch(error => {
        console.error('Помилка:', error);
        btn.textContent = 'Помилка, спробуйте ще';
        btn.style.backgroundColor = '#dc143c';
        setTimeout(() => {
            btn.textContent = 'Надіслати відгук';
            btn.style.backgroundColor = '#8b4513';
            btn.disabled = false;
        }, 2000);
    });
}

function showFeedbackResult() {
    document.getElementById('comment-section').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('feedback-result').style.display = 'block';
    
    setTimeout(() => {
        document.getElementById('next-btn').style.display = 'block';
        document.getElementById('next-btn').textContent = 'Надіслати новий відгук';
        document.getElementById('next-btn').onclick = resetForm;
    }, 2000);
}

function resetForm() {
    document.getElementById('name').value = '';
    document.getElementById('comment').value = '';
    document.getElementById('name-section').style.display = 'block';
    document.getElementById('emoji-section').style.display = 'none';
    document.getElementById('comment-section').style.display = 'none';
    document.getElementById('feedback-result').style.display = 'none';
    document.getElementById('next-btn').textContent = 'Далі';
    document.getElementById('next-btn').onclick = nextStep;
    document.getElementById('next-btn').style.backgroundColor = '#8b4513';
    document.getElementById('next-btn').disabled = false;
    currentStep = 1;
    selectedEmoji = '';
    
    const emojis = document.querySelectorAll('.emoji-option');
    emojis.forEach(e => {
        e.style.opacity = '1';
        e.style.transform = 'scale(1)';
    });
}

function loadFeedbacks() {
    const container = document.getElementById('feedbacks-list');
    container.innerHTML = '<div class="loading">Завантаження відгуків...</div>';
    
    fetch('/api/feedbacks')
        .then(response => {
            if (!response.ok) throw new Error('Помилка завантаження');
            return response.json();
        })
        .then(feedbacks => {
            if (feedbacks.length === 0) {
                container.innerHTML = '<div class="no-feedback">Ще немає відгуків. Будьте першим!</div>';
                return;
            }
            
            container.innerHTML = '';
            feedbacks.forEach((feedback, index) => {
                setTimeout(() => {
                    const item = document.createElement('div');
                    item.className = 'feedback-item';
                    item.innerHTML = `
                        <div class="feedback-header">
                            <span>${feedback.name}</span>
                            <span class="feedback-date">${formatDate(feedback.date)}</span>
                        </div>
                        <div class="feedback-mood">
                            <span class="feedback-emoji">${feedback.emoji}</span>
                            <span>${feedback.emojiText}</span>
                        </div>
                        <div class="feedback-comment">${feedback.comment}</div>
                    `;
                    container.prepend(item);
                }, index * 100);
            });
        })
        .catch(error => {
            console.error('Помилка:', error);
            container.innerHTML = '<div class="error">Не вдалося завантажити відгуки</div>';
        });
}

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('uk-UA', options);
}