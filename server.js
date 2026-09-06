const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to get local IPv4 addresses
function getNetworkIPs() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            // Skip internal (i.e. 127.0.0.1) and non-IPv4
            if (net.family === 'IPv4' && !net.internal) {
                addresses.push({ interface: name, address: net.address });
            }
        }
    }
    return addresses;
}

// API to get real server & network info
app.get('/api/info', (req, res) => {
    const networkIPs = getNetworkIPs();
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    res.json({
        name: "Luxc Terminal",
        os: `${os.type()} ${os.release()} (${os.arch()})`,
        hostname: os.hostname(),
        platform: os.platform(),
        uptime: os.uptime(),
        totalMemory: Math.round(os.totalmem() / 1024 / 1024) + " MB",
        freeMemory: Math.round(os.freemem() / 1024 / 1024) + " MB",
        cpuCount: os.cpus().length,
        cpuModel: os.cpus()[0]?.model || "x86_64 CPU",
        networkIPs: networkIPs,
        clientIp: clientIp,
        port: PORT
    });
});

// API for live curl / fetch proxy simulation
app.get('/api/curl', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: "Missing url parameter" });
    }
    try {
        const urlToFetch = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(urlToFetch, { signal: controller.signal });
        clearTimeout(timeout);
        const text = await response.text();
        res.json({
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            data: text.substring(0, 4000) // limit output
        });
    } catch (err) {
        res.status(500).json({ error: `Connection failed: ${err.message}` });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    const networkIPs = getNetworkIPs();
    console.log('\x1b[32m====================================================\x1b[0m');
    console.log('\x1b[32m     ██╗     ██╗   ██╗██╗  ██╗ ██████╗               \x1b[0m');
    console.log('\x1b[32m     ██║     ██║   ██║╚██╗██╔╝██╔════╝               \x1b[0m');
    console.log('\x1b[32m     ██║     ██║   ██║ ╚███╔╝ ██║                    \x1b[0m');
    console.log('\x1b[32m     ██║     ██║   ██║ ██╔██╗ ██║                    \x1b[0m');
    console.log('\x1b[32m     ███████╗╚██████╔╝██╔╝ ██╗╚██████╗               \x1b[0m');
    console.log('\x1b[32m     ╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ Arch Terminal \x1b[0m');
    console.log('\x1b[32m====================================================\x1b[0m');
    console.log(`\x1b[36m[+] Luxc Web Terminal Server is RUNNING!\x1b[0m`);
    console.log(`\x1b[33m[>] Local Access  : \x1b[1mhttp://localhost:${PORT}\x1b[0m`);
    if (networkIPs.length > 0) {
        networkIPs.forEach(net => {
            console.log(`\x1b[33m[>] Network Access: \x1b[1mhttp://${net.address}:${PORT}\x1b[0m (\x1b[90m${net.interface}\x1b[0m)`);
        });
    } else {
        console.log(`\x1b[33m[>] Network Access: \x1b[1mhttp://0.0.0.0:${PORT}\x1b[0m`);
    }
    console.log('\x1b[32m====================================================\x1b[0m');
    console.log(`\x1b[90mOpen in Chrome and enjoy the Hacker Terminal experience.\x1b[0m\n`);
});
