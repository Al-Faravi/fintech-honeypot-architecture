// gateway/seed.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const sqlite3 = require('sqlite3').verbose();

const trainCsvPath = path.join(__dirname, '../Banking Dataset/train.csv');
const testCsvPath = path.join(__dirname, '../Banking Dataset/test.csv');

// 1. DUMMY VAULT (Honeypot)
const dummyDb = new sqlite3.Database('./honeypot.db');
const seedDummyDatabase = () => {
    dummyDb.serialize(() => {
        dummyDb.run(`CREATE TABLE IF NOT EXISTS fake_customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT, age INTEGER, job TEXT, marital TEXT, education TEXT, balance INTEGER
        )`);
        console.log("⏳ Seeding Dummy Database (SQLite) from test.csv...");
        const stmt = dummyDb.prepare(`INSERT INTO fake_customers (age, job, marital, education, balance) VALUES (?, ?, ?, ?, ?)`);
        
        let count = 0;
        fs.createReadStream(testCsvPath).pipe(csv({ separator: ';' })) 
            .on('data', (row) => {
                stmt.run(row.age, row.job, row.marital, row.education, row.balance);
                count++;
            })
            .on('end', () => {
                stmt.finalize();
                console.log(`✅ [HONEYPOT] ${count} rows inserted into honeypot.db!`);
            });
    });
};

// 2. REAL VAULT (SQLite instead of PostgreSQL)
const realDb = new sqlite3.Database('./alfaravi_real.db');
const seedRealDatabase = () => {
    realDb.serialize(() => {
        realDb.run(`CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT, age INTEGER, job TEXT, marital TEXT, education TEXT, balance INTEGER
        )`);
        console.log("⏳ Seeding Real Database (SQLite) from train.csv...");
        const stmt = realDb.prepare(`INSERT INTO customers (age, job, marital, education, balance) VALUES (?, ?, ?, ?, ?)`);
        
        let count = 0;
        fs.createReadStream(trainCsvPath).pipe(csv({ separator: ';' }))
            .on('data', (row) => {
                stmt.run(row.age, row.job, row.marital, row.education, row.balance);
                count++;
            })
            .on('end', () => {
                stmt.finalize();
                console.log(`✅ [REAL DB] ${count} rows inserted into alfaravi_real.db!`);
            });
    });
};

seedDummyDatabase();
seedRealDatabase();