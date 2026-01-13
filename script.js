// Получаем элементы DOM
const form = document.getElementById('contact-form');
const formView = document.getElementById('form-view');
const successView = document.getElementById('success-view');
const resetBtn = document.getElementById('reset-btn');
const submitBtn = form.querySelector('button[type="submit"]');

// Функция для отправки данных на сервер
async function saveFormData(data) {
    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ошибка ответа сервера:', response.status, errorText);
            throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
        }

        const result = await response.json();

        if (result.success) {
            console.log('Данные успешно сохранены на сервере:', result.data);
            return true;
        } else {
            console.error('Ошибка при сохранении:', result.message);
            alert('Ошибка при сохранении данных: ' + result.message);
            return false;
        }
    } catch (error) {
        console.error('Ошибка при отправке данных:', error);
        console.error('Детали ошибки:', error.message, error.stack);
        alert('Ошибка соединения с сервером: ' + error.message);
        return false;
    }
}

// Обработчик отправки формы
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Отключаем кнопку отправки
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    
    // Собираем данные из формы
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        comment: document.getElementById('comment').value.trim()
    };
    
    // Отправляем данные на сервер
    const success = await saveFormData(formData);
    
    if (success) {
        // Показываем состояние успеха
        formView.classList.add('hidden');
        successView.classList.remove('hidden');
    } else {
        // Включаем кнопку обратно при ошибке
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
    }
});

// Обработчик кнопки "Отправить еще раз"
resetBtn.addEventListener('click', function() {
    // Очищаем форму
    form.reset();
    
    // Включаем кнопку отправки
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить';
    
    // Возвращаемся к форме
    successView.classList.add('hidden');
    formView.classList.remove('hidden');
});

// Функция для получения всех сохраненных данных с сервера
async function getAllSubmissions() {
    try {
        const response = await fetch('/api/submissions');
        const result = await response.json();
        if (result.success) {
            console.log('Все сохраненные данные:', result.data);
            return result.data;
        } else {
            console.error('Ошибка при получении данных:', result.message);
            return [];
        }
    } catch (error) {
        console.error('Ошибка при запросе данных:', error);
        return [];
    }
}

// Экспортируем функцию в глобальную область для доступа из консоли
window.getAllSubmissions = getAllSubmissions;
