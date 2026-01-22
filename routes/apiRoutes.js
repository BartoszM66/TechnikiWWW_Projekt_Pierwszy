const express = require('express');
const router = express.Router();
const db = require('../models/database');

const WORK_START = 8;
const WORK_END = 18;

function parseDate(dateStr, timeStr) {
    return new Date(`${dateStr}T${timeStr}:00`);
}

function calculateSegments(startDateTimeStr, durationMinutes) {
    const segments = [];
    let minutesLeft = durationMinutes;
    let currentCursor = new Date(startDateTimeStr);

    while (minutesLeft > 0) {
        const dayStart = new Date(currentCursor);
        dayStart.setHours(WORK_START, 0, 0, 0);

        const dayEnd = new Date(currentCursor);
        dayEnd.setHours(WORK_END, 0, 0, 0);

        if (currentCursor < dayStart) currentCursor = dayStart;

        if (currentCursor >= dayEnd) {
            currentCursor.setDate(currentCursor.getDate() + 1);
            currentCursor.setHours(WORK_START, 0, 0, 0);
            continue;
        }

        const timeUntilClose = (dayEnd - currentCursor) / 60000;
        const minutesToTake = Math.min(minutesLeft, timeUntilClose);
        const segmentEnd = new Date(currentCursor.getTime() + minutesToTake * 60000);

        segments.push({ start: currentCursor.getTime(), end: segmentEnd.getTime() });

        minutesLeft -= minutesToTake;
        currentCursor = segmentEnd;
    }
    return segments;
}

async function isSlotSafe(userDate, userTime, userDuration, db) {
    const userSegments = calculateSegments(`${userDate} ${userTime}`, userDuration);

    const appointments = await new Promise((resolve, reject) => {
        db.all(
            `SELECT appointments.date, services.duration 
             FROM appointments 
             JOIN services ON appointments.service_id = services.id 
             WHERE status != 'cancelled'`,
            [],
            (err, rows) => err ? reject(err) : resolve(rows)
        );
    });

    for (const app of appointments) {
        const busySegments = calculateSegments(app.date, app.duration);
        for (const userSeg of userSegments) {
            for (const busySeg of busySegments) {
                if (userSeg.start < busySeg.end && userSeg.end > busySeg.start) {
                    return false;
                }
            }
        }
    }
    return true;
}

router.get('/services', (req, res) => {
    db.all("SELECT * FROM services", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.get('/slots', async (req, res) => {
    const { date, service_id } = req.query;
    if (!date || !service_id) return res.status(400).json({ error: "Brak danych" });

    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return res.json([]);
    }

    db.get("SELECT duration FROM services WHERE id = ?", [service_id], async (err, service) => {
        if (!service) return res.status(404).json({ error: "Usługa nie istnieje" });

        const validSlots = [];
        for (let h = WORK_START; h < WORK_END; h++) {
            const timeStr = `${h.toString().padStart(2, '0')}:00`;
            const isFree = await isSlotSafe(date, timeStr, service.duration, db);
            if (isFree) validSlots.push(timeStr);
        }
        res.json(validSlots);
    });
});

router.post('/appointments', (req, res) => {
    const { user_id, service_id, date, time } = req.body;

    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return res.status(400).json({ message: "W weekendy nie pracujemy. Wybierz dzień roboczy (Pn-Pt)." });
    }

    db.get("SELECT duration FROM services WHERE id = ?", [service_id], async (err, service) => {
        if (!service) return res.status(400).json({ message: "Błąd usługi" });

        const isFree = await isSlotSafe(date, time, service.duration, db);
        if (!isFree) return res.status(409).json({ message: "Termin zajęty!" });

        const dateTime = `${date} ${time}`;
        db.run(`INSERT INTO appointments (user_id, service_id, date, status) VALUES (?, ?, ?, 'pending')`,
            [user_id, service_id, dateTime],
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: "Zarezerwowano!", appointmentId: this.lastID });
            }
        );
    });
});

router.get('/appointments/:userId', (req, res) => {
    const sql = `SELECT appointments.*, services.name as service_name, services.price, services.duration
                 FROM appointments JOIN services ON appointments.service_id = services.id
                 WHERE appointments.user_id = ? ORDER BY appointments.date DESC`;
    db.all(sql, [req.params.userId], (err, rows) => res.json(rows || []));
});

router.delete('/appointments/:id', (req, res) => {
    const appointment_id = req.params.id;
    const { user_id } = req.body;

    const sql = "SELECT date, status FROM appointments WHERE id = ? AND user_id = ?";
    db.get(sql, [appointment_id, user_id], (err, row) => {
        if (err || !row) return res.status(404).json({ message: "Błąd lub brak wizyty." });
        if (row.status === 'cancelled') return res.status(400).json({ message: "Już anulowano." });

        const appDate = new Date(row.date.replace(' ', 'T'));
        const now = new Date();
        const diffHours = (appDate - now) / (1000 * 60 * 60);

        if (diffHours < 48) {
            return res.status(400).json({ message: "Za późno na anulowanie online (wymagane 48h)." });
        }

        db.run("UPDATE appointments SET status = 'cancelled' WHERE id = ?", [appointment_id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Anulowano pomyślnie." });
        });
    });
});

router.get('/admin/appointments', (req, res) => {
    const sql = `
        SELECT 
            appointments.id,
            appointments.date,
            appointments.status,
            services.name as service_name,
            services.duration,
            services.price,
            users.name as user_name,
            users.phone as user_phone
        FROM appointments
        JOIN services ON appointments.service_id = services.id
        JOIN users ON appointments.user_id = users.id
        ORDER BY appointments.date ASC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.put('/appointments/:id/status', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: "Nieprawidłowy status." });
    }

    db.run("UPDATE appointments SET status = ? WHERE id = ?", [status, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `Status zmieniony na: ${status}` });
    });
});

module.exports = router;