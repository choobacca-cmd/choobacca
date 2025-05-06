let currentStep = 1;
let selectedEmoji = '';
let selectedEmojiText = '';
const quotes = [
    "Історія - це дзеркало минулого, світло правди, жива пам'ять, вчитель життя.",
    "Народ, який забуває свою історію, не має майбутнього.",
    "Історія є вчителькою життя (Марк Туллій Цицерон)",
    "Кожна сторінка історії - це урок для майбутніх поколінь."
];

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('emoji-section').style.display = 'none';
    document.getElementById('comment-section').style.display = 'none';
    document.getElementById('feedback-result').style.display = 'none';
    document.querySelectorAll('.dynamic-textarea').forEach(el => el.style.display = 'none');
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

        let dynamicComment = '';
        if (selectedEmoji === '😊') {
            dynamicComment = document.getElementById('positive-comment').value.trim();
        } else if (selectedEmoji === '😐') {
            dynamicComment = document.getElementById('neutral-comment').value.trim();
        } else if (selectedEmoji === '😞') {
            dynamicComment = document.getElementById('negative-comment').value.trim();
        }

        if (!comment) {
            alert("Будь ласка, введіть коментар");
            return;
        }

        sendFeedback({
            name: name,
            emoji: selectedEmoji,
            emojiText: selectedEmojiText,
            dynamicComment: dynamicComment,
            comment: comment
        });
    }
}

function selectEmoji(emoji, text) {
    selectedEmoji = emoji;
    selectedEmojiText = text;

    const emojis = document.querySelectorAll('.emoji-option');
    emojis.forEach(e => {
        e.style.opacity = '0.5';
        e.style.transform = 'scale(1)';
    });

    event.currentTarget.style.opacity = '1';
    event.currentTarget.style.transform = 'scale(1.2)';

    document.querySelectorAll('.dynamic-textarea').forEach(el => {
        el.style.display = 'none';
    });

    if (emoji === '😊') {
        document.getElementById('positive-textarea').style.display = 'block';
    } else if (emoji === '😐') {
        document.getElementById('neutral-textarea').style.display = 'block';
    } else if (emoji === '😞') {
        document.getElementById('negative-textarea').style.display = 'block';
    }
}

function sendFeedback(feedback) {
    const btn = document.getElementById('next-btn');
    btn.disabled = true;
    btn.textContent = 'Відправка...';

    setTimeout(() => {
        btn.textContent = '✓ Успішно!';
        btn.style.backgroundColor = '#2e8b57';
        showFeedbackResult();
        addFeedbackToHistory(feedback);
    }, 1000);
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
    document.querySelectorAll('.dynamic-textarea textarea').forEach(el => {
        el.value = '';
    });
    document.getElementById('name-section').style.display = 'block';
    document.getElementById('emoji-section').style.display = 'none';
    document.getElementById('comment-section').style.display = 'none';
    document.getElementById('feedback-result').style.display = 'none';
    document.querySelectorAll('.dynamic-textarea').forEach(el => {
        el.style.display = 'none';
    });
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

function addFeedbackToHistory(feedback) {
    const container = document.getElementById('feedbacks-list');
    const item = document.createElement('div');
    item.className = 'feedback-item';

    let feedbackHTML = `
        <div class="feedback-header">
            <span>${feedback.name}</span>
            <span class="feedback-date">${formatDate(new Date())}</span>
        </div>
        <div class="feedback-mood">
            <span class="feedback-emoji">${feedback.emoji}</span>
            <span>${feedback.emojiText}</span>
        </div>`;

    if (feedback.dynamicComment) {
        feedbackHTML += `<div class="feedback-comment">${feedback.dynamicComment}</div>`;
    }

    if (feedback.comment) {
        feedbackHTML += `<div class="feedback-comment">${feedback.comment}</div>`;
    }

    item.innerHTML = feedbackHTML;
    container.prepend(item);
}

function loadFeedbacks() {
    const container = document.getElementById('feedbacks-list');
    container.innerHTML = '<div class="no-feedback">Ще немає відгуків. Будьте першим!</div>';
}

function formatDate(date) {
    const options = { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('uk-UA', options);
}