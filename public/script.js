let currentStep = 1;
let selectedEmoji = '';
let selectedEmojiText = '';
        
function nextStep() {
            if (currentStep === 1) {
                const name = document.getElementById('name').value;
                if (!name.trim()) {
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
                document.getElementById('emoji-section').style.display = 'none';
                document.getElementById('comment-section').style.display = 'block';
                document.getElementById('next-btn').textContent = 'Надіслати відгук';
                currentStep = 3;
            } 
            else if (currentStep === 3) {
                const comment = document.getElementById('comment').value;
                const name = document.getElementById('name').value;
                
                console.log({
                    name: name,
                    emoji: selectedEmoji,
                    emojiText: selectedEmojiText,
                    comment: comment,
                    date: new Date().toISOString()
                });
                
                alert("Дякуємо за ваш відгук!");
                resetForm();
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
        
function resetForm() {
            document.getElementById('name').value = '';
            document.getElementById('comment').value = '';
            document.getElementById('name-section').style.display = 'block';
            document.getElementById('emoji-section').style.display = 'none';
            document.getElementById('comment-section').style.display = 'none';
            document.getElementById('next-btn').textContent = 'Далі';
            currentStep = 1;
            selectedEmoji = '';
            
            const emojis = document.querySelectorAll('.emoji-option');
            emojis.forEach(e => {
                e.style.opacity = '1';
                e.style.transform = 'scale(1)';
            });
}

function showFeedbackResult() {
            document.getElementById('name-section').style.display = 'none';
            document.getElementById('emoji-section').style.display = 'none';
            document.getElementById('comment-section').style.display = 'none';
            document.getElementById('next-btn').style.display = 'none';
            document.getElementById('feedback-result').style.display = 'block';
            document.getElementById('all-feedbacks').style.display = 'block';
            
            fetch('/api/feedbacks')
                .then(response => response.json())
                .then(feedbacks => {
                    const container = document.getElementById('feedbacks-container');
                    container.innerHTML = '';
                    
                    feedbacks.forEach(feedback => {
                        const item = document.createElement('div');
                        item.className = 'feedback-item';
                        item.innerHTML = `
                            <strong>${feedback.name}</strong> (${feedback.date}): 
                            ${feedback.emoji} - ${feedback.comment}
                        `;
                        container.appendChild(item);
                    });
                });
}

function resetForm() {
            document.getElementById('next-btn').style.display = 'block';
            document.getElementById('next-btn').textContent = 'Надіслати ще один відгук';
            document.getElementById('next-btn').onclick = () => {
                location.reload();
            };
}