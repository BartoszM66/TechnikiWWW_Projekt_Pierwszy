const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const TARGET_EMAIL = 'admin@email.com';

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log(`Szukam użytkownika: ${TARGET_EMAIL}...`);

db.serialize(() => {
    db.get("SELECT * FROM users WHERE email = ?", [TARGET_EMAIL], (err, user) => {
        if (err) {
            console.error("Błąd bazy danych:", err.message);
            db.close();
            return;
        }

        if (!user) {
            console.log(`Nie znaleziono użytkownika o emailu: ${TARGET_EMAIL}`);
            console.log("Upewnij się, że zarejestrowałeś się w aplikacji przed uruchomieniem tego skryptu.");
            db.close();
            return;
        }

        db.run("UPDATE users SET role = 'admin' WHERE email = ?", [TARGET_EMAIL], function(err) {
            if (err) {
                console.error("Błąd aktualizacji:", err.message);
            } else {
                console.log(`SUKCES!`);
                console.log(`Użytkownik: ${user.name}`);
                console.log(`Email: ${user.email}`);
                console.log(`Nowa rola: ADMIN`);
            }
            db.close();
        });
    });
});