const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    const data = fs.readFileSync(process.env.INDEX_PATH, 'utf8');
    res.end(data);
});

if ("SOCKET" in process.env) {
    const socket = process.env.SOCKET;
    // Socket must be removed before starting server. This action is required. Otherwise server will not start if socket exists.
    if (fs.existsSync(socket)) {
        fs.unlinkSync(socket);
    }
    server.listen(socket, () => {
        fs.chmodSync(socket,0660);
        console.log(`Listening ${socket}`);
    });
} else if ("PORT" in process.env) {
    const hostname = process.env.INSTANCE_HOST;
    const port = process.env.PORT;
    server.listen(port, hostname, () => {
        console.log(`Listening http://${hostname}:${port}/`);
    });
}
