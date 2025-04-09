async function leaveFeedback(type) {
    try {
        const response = await fetch('https://5c6b-92-253-212-22.ngrok-free.app/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type }),
        });

        const data = await response.json();

        if (type === 'good') {
            alert(data.success ? 'Дякуємо за позитивний відгук!' : 'Помилка збереження');
        } else {
            alert(data.success ? 'Дякуємо за відгук! Ми станемо краще!' : 'Помилка збереження');
        }
    } catch (error) {
        console.error('Помилка:', error);
        alert('Сталася помилка при відправці відгуку');
    }
}

function saveFeedbackToFile(feedbackType, fileName) {
    fetch('/save-feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            type: feedbackType,
            file: fileName,
            timestamp: new Date().toISOString()
        }),
    })
    .then(response => {
        if (!response.ok) {
            console.error('Помилка при збереженні відгуку');
        }
    })
    .catch(error => {
        console.error('Помилка:', error);
    });
}