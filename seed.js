const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const services = [
    { name: 'Mycie Detailingowe', duration: 150, price: 150 },
    { name: 'Detailing Wnętrza', duration: 480, price: 450 },
    { name: 'Pakiet Kompleksowy', duration: 600, price: 550 },
    { name: 'Korekta Lakieru', duration: 960, price: 850 },
    { name: 'Powłoka Ceramiczna', duration: 1200, price: 2500 },
    { name: 'Regeneracja Lamp', duration: 120, price: 200 },
    { name: 'Niewidzialna Wycieraczka', duration: 60, price: 150 }
];

db.serialize(() => {
    db.run("DELETE FROM services");
    db.run("DELETE FROM sqlite_sequence WHERE name='services'");

    const stmt = db.prepare("INSERT INTO services (name, duration, price) VALUES (?, ?, ?)");

    services.forEach(service => {
        stmt.run(service.name, service.duration, service.price);
    });

    stmt.finalize();
    console.log("Uslugi zostaly dodane do bazy danych.");
});

db.close();