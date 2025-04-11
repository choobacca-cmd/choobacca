let currentStep = 1;
let selectedEmoji = '';
let selectedEmojiText = '';

document.addEventListener('DOMContentLoaded', loadFeedbacks);

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('emoji-section').style.display = 'none';
    document.getElementById('comment-section').style.display = 'none';
    document.getElementById('feedback-result').style.display = 'none';
    loadFeedbacks();
});

function nextStep() {
    if (currentStep === 1) {
        const name = document.getElementById('name').value.trim();
        if (!name) {
            alert("Будь ласка, введіть ваше ім'я та прізвище");
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
        document.getElementById('emoji-section').style.display = 'block';
        document.getElementById('emoji-section').classList.add('fade-in');
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
    fetch('/api/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedback)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showFeedbackResult();
                loadFeedbacks();
            }
        })
        .catch(error => {
            console.error('Помилка:', error);
            alert("Сталася помилка при відправці відгуку");
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
    currentStep = 1;
    selectedEmoji = '';

    const emojis = document.querySelectorAll('.emoji-option');
    emojis.forEach(e => {
        e.style.opacity = '1';
        e.style.transform = 'scale(1)';
    });
}

function loadFeedbacks() {
    document.querySelector('.feedbacks-container h3').innerHTML = `Останні відгуки (<span id="feedback-count"></span>):`;
    fetch('/api/feedbacks')
        .then(response => response.json())
        .then(feedbacks => {
            const container = document.getElementById('feedbacks-list');
            container.innerHTML = '';

            if (feedbacks.length === 0) {
                container.innerHTML = '<p>Ще немає відгуків. Будьте першим!</p>';
                return;
            }

            feedbacks.forEach(feedback => {
                const item = document.createElement('div');
                item.className = 'feedback-item';
                item.innerHTML = `
                            <div class="feedback-header">
                                <span>${feedback.name}</span>
                                <span>${new Date(feedback.date).toLocaleString('uk-UA')}</span>
                            </div>
                            <div>
                                <span class="feedback-emoji">${feedback.emoji}</span>
                                <span>${feedback.emojiText}</span>
                            </div>
                            <div class="feedback-comment">${feedback.comment}</div>
                        `;
                container.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Помилка завантаження відгуків:', error);
        });
    document.getElementById('feedback-count').textContent = feedbacks.length;
}

const quotes = [
    "Історія — вчителька життя. — Цицерон",
    "Той, хто не знає свого минулого, не вартий майбутнього. — М. Рильський",
    "Історія — це не лише минуле, це дзеркало сьогодення. — Невідомий автор"
];

document.addEventListener('DOMContentLoaded', () => {
    const quoteBox = document.getElementById('quote-box');
    quoteBox.textContent = quotes[Math.floor(Math.random() * quotes.length)];
});

document.getElementById('name').focus();
