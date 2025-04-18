import http from 'http';
import fs from 'fs';

const server = http.createServer((req, res) => {
     res.statusCode = 200;
     res.setHeader('Content-Type', 'text/html;charset=utf-8');
     fs.readFile(process.env.INDEX_PATH, 'utf8', (err, data) => {
         if (err) {
             res.statusCode = 500;
             res.end('Ошибка сервера');
             console.error(err);
             return;
         }
         res.end(data);
     });
});

if ("SOCKET" in process.env) {
     const socket = process.env.SOCKET;
     if (fs.existsSync(socket)) {
         fs.unlinkSync(socket);
     }
     server.listen(socket, () => {
         fs.chmodSync(socket, 0o660);
         console.log(`Listening ${socket}`);
     });
} else if ("PORT" in process.env) {
     const hostname = process.env.INSTANCE_HOST;
     const port = process.env.PORT;
     server.listen(port, hostname, () => {
         console.log(`Listening http://${hostname}:${port}/`);
     });
}