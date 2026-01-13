// Минимальный entrypoint для Vercel
// Этот файл нужен только для того, чтобы Vercel не искал entrypoint
// Реальное приложение - это статический index.html

module.exports = (req, res) => {
  // Редирект на index.html для корневого пути
  if (req.url === '/') {
    res.writeHead(302, { Location: '/index.html' });
    return res.end();
  }
  res.writeHead(404);
  res.end('Not found');
};
