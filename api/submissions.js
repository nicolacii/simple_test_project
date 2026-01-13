const fs = require('fs');
const path = require('path');

// В Vercel используем /tmp для временного хранения
const DATA_FILE = path.join('/tmp', 'submissions.json');

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Только GET запросы
    if (req.method !== 'GET') {
        return res.status(405).json({ 
            success: false, 
            message: 'Method not allowed' 
        });
    }

    try {
        // Если файл не существует, возвращаем пустой массив
        if (!fs.existsSync(DATA_FILE)) {
            return res.status(200).json({ 
                success: true, 
                data: [] 
            });
        }

        const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
        const submissions = JSON.parse(fileContent);
        
        return res.status(200).json({ 
            success: true, 
            data: submissions 
        });
    } catch (error) {
        console.error('Ошибка чтения данных:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Ошибка при чтении данных',
            error: error.message
        });
    }
};
