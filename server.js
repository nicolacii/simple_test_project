const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'submissions.json');

// Создаем папку data, если её нет
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Инициализируем файл данных, если его нет
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Разрешаем доступ к статическим файлам
app.use(express.static(__dirname));

// CORS для разрешения запросов
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Маршрут для сохранения данных формы
app.post('/api/submit', (req, res) => {
    try {
        const { name, email, comment } = req.body;

        // Валидация данных
        if (!name || !email || !comment) {
            return res.status(400).json({ 
                success: false, 
                message: 'Все поля обязательны для заполнения' 
            });
        }

        // Читаем существующие данные
        let submissions = [];
        try {
            const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
            submissions = JSON.parse(fileContent);
        } catch (error) {
            console.error('Ошибка чтения файла:', error);
            submissions = [];
        }

        // Добавляем новую запись
        const newEntry = {
            id: Date.now(),
            name: name.trim(),
            email: email.trim(),
            comment: comment.trim(),
            timestamp: new Date().toISOString()
        };

        submissions.push(newEntry);

        // Сохраняем в файл
        fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2), 'utf8');

        console.log('Новая запись сохранена:', newEntry);

        res.json({ 
            success: true, 
            message: 'Данные успешно сохранены',
            data: newEntry
        });

    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера при сохранении данных' 
        });
    }
});

// Маршрут для получения всех данных (опционально, для просмотра)
app.get('/api/submissions', (req, res) => {
    try {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
        const submissions = JSON.parse(fileContent);
        res.json({ success: true, data: submissions });
    } catch (error) {
        console.error('Ошибка чтения данных:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка при чтении данных' 
        });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Данные сохраняются в файл: ${DATA_FILE}`);
});
