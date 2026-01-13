const fs = require('fs');
const path = require('path');

// В Vercel используем /tmp для временного хранения
// В production лучше использовать базу данных (Vercel KV, MongoDB, и т.д.)
const DATA_FILE = path.join('/tmp', 'submissions.json');

// Инициализируем файл данных, если его нет
function initDataFile() {
    if (!fs.existsSync('/tmp')) {
        fs.mkdirSync('/tmp', { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    }
}

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Только POST запросы
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            message: 'Method not allowed' 
        });
    }

    try {
        const { name, email, comment } = req.body;

        // Валидация данных
        if (!name || !email || !comment) {
            return res.status(400).json({ 
                success: false, 
                message: 'Все поля обязательны для заполнения' 
            });
        }

        // Инициализируем файл данных
        initDataFile();

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

        return res.status(200).json({ 
            success: true, 
            message: 'Данные успешно сохранены',
            data: newEntry
        });

    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера при сохранении данных',
            error: error.message
        });
    }
};
