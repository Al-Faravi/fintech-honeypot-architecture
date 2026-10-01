// gateway/server.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs'); // ফাইল সিস্টেম মডিউল ইমপোর্ট করা হলো
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "super_secret_alfaravi_key_2026";
const FAKE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake_bot_token";

const realDb = new sqlite3.Database('./alfaravi_real.db');
const dummyDb = new sqlite3.Database('./honeypot.db'); 

// 🚨 LIVE ALERTS & BLACKLIST STORAGE
let systemAlerts = [];
const blacklistedIPs = new Set(); 
const blacklistFilePath = path.join(__dirname, 'blacklist.json'); // ব্ল্যাকলিস্ট ফাইল

// 🛡️ সার্ভার চালুর সময় blacklist.json থেকে আইপি লোড করা
if (fs.existsSync(blacklistFilePath)) {
    try {
        const savedIPs = JSON.parse(fs.readFileSync(blacklistFilePath, 'utf8'));
        savedIPs.forEach(ip => blacklistedIPs.add(ip));
        console.log(`[🛡️ ACTIVE DEFENSE] Loaded ${blacklistedIPs.size} blocked IPs from blacklist.json`);
    } catch (err) {
        console.error("Error reading blacklist.json", err);
    }
}

// 🛡️️ আইপি পারমানেন্টলি সেভ করার ফাংশন
const blockIpPermanently = (ip) => {
    if (!blacklistedIPs.has(ip)) {
        blacklistedIPs.add(ip);
        // সাথে সাথে ফাইলে রাইট করে দেওয়া
        fs.writeFileSync(blacklistFilePath, JSON.stringify([...blacklistedIPs], null, 2));
    }
};

const addAlert = (title, type, detail) => {
    systemAlerts.unshift({ id: Date.now(), title, time: new Date().toLocaleTimeString(), type, detail });
    if(systemAlerts.length > 10) systemAlerts.pop(); 
};

// ==========================================
// 🛡️ ACTIVE DEFENSE: GLOBAL IP FILTER MIDDLEWARE
// ==========================================
app.use((req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;

    // লাইভ অ্যালার্ট রিকোয়েস্টকে ব্ল্যাকলিস্ট চেকের বাইরে রাখা হলো
    if (req.path === '/api/v1/alerts') {
        return next();
    }

    // আইপি ব্ল্যাকলিস্টে থাকলে সোজা 403
    if (blacklistedIPs.has(clientIP)) {
        console.log(`[🛑 BLOCKED] Access Denied for Blacklisted IP: ${clientIP} | Route: ${req.path}`);
        return res.status(403).json({ 
            success: false, 
            message: "403 Forbidden: Your IP has been permanently blocked due to malicious activity." 
        });
    }
    next();
});

// Users Table Setup
realDb.serialize(() => {
    realDb.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)`);
});

// 1. REGISTER ROUTE
app.post('/api/v1/auth/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    realDb.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function(err) {
        if (err) return res.status(400).json({ success: false, message: "Username already exists!" });
        res.json({ success: true, message: "Registration successful!" });
    });
});

// 2. LOGIN ROUTE WITH HONEYPOT TRAP
app.post('/api/v1/auth/login', (req, res) => {
    const { username, password, bot_trap_field } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;
    
    // 🚨 HONEYPOT TRAP
    if (bot_trap_field && bot_trap_field.length > 0) {
        blockIpPermanently(clientIP); // JSON ফাইলে সেভ
        addAlert("লগইন ফর্মে বট শনাক্ত হয়েছে!", "danger", `IP: ${clientIP} (Blacklisted Permanently)`);
        console.log(`\n[🚨 HONEYPOT] Bot Blocked! IP: ${clientIP} added to blacklist.json`);
        return res.json({ success: true, token: FAKE_JWT, message: "Login Successful" });
    }

    realDb.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) return res.status(401).json({ success: false, message: "User not found!" });
        if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ success: false, message: "Wrong password!" });

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        addAlert(`অ্যাডমিন '${username}' লগইন করেছেন`, "success", `IP: ${clientIP}`);
        res.json({ success: true, token: token, message: "Welcome to Bhuiyan Islami Bank" });
    });
});

// 3. DIRECT BOT TRAPS
const trapRoutes = ['/api/v1/.env', '/admin/secret-db-export', '/wp-login.php'];
trapRoutes.forEach(route => {
    app.all(route, (req, res) => {
        const clientIP = req.ip || req.connection.remoteAddress;
        
        blockIpPermanently(clientIP); // JSON ফাইলে সেভ
        addAlert("হানিপটে স্ক্যানার বট শনাক্ত হয়েছে!", "danger", `IP: ${clientIP} (Blacklisted Permanently)`);
        console.log(`\n[🚨 HONEYPOT] Scan Detected! IP: ${clientIP} added to blacklist.json`);
        
        dummyDb.all("SELECT age, job, balance FROM fake_customers LIMIT 15", [], (err, rows) => {
            res.status(200).json({ message: "System Access Granted", isHoneypot: true, confidential_data: rows });
        });
    });
});

// 4. SECURE DASHBOARD DATA
app.get('/api/v1/customers', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, message: "No token provided" });
    const token = authHeader.split(" ")[1];

    if (token === FAKE_JWT) {
        dummyDb.all("SELECT age, job, balance FROM fake_customers LIMIT 15", [], (err, rows) => {
            res.status(200).json({ success: true, isHoneypot: true, data: rows });
        });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ success: false, message: "Invalid token" });
        realDb.all("SELECT age, job, balance FROM customers LIMIT 15", [], (err, rows) => {
            res.status(200).json({ success: true, isHoneypot: false, data: rows });
        });
    });
});

// 5. FETCH LIVE ALERTS
app.get('/api/v1/alerts', (req, res) => {
    res.json({ success: true, data: systemAlerts });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Bhuiyan Islami Bank API Gateway Running on Port ${PORT}...`));