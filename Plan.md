# Plan Realizacji Projektu - Neon Detailing

## 1. Analiza Wymagań 
- [x] Jako klient chcę widzieć ofertę usług, aby wiedzieć co mogę zamówić.
- [x] Jako klient chcę zarezerwować wizytę wybierając datę i godzinę.
- [x] Jako klient chcę widzieć historię swoich wizyt i ich status.
- [x] Jako administrator chcę widzieć kalendarz wizyt na cały tydzień.
- [x] Jako administrator chcę móc potwierdzać lub anulować wizyty.

## 2. Architektura Bazy Danych 
Planowane tabele:
1. **Users**: id, name, email, password, phone, role 
2. **Services**: id, name, duration, price
3. **Appointments**: id, user_id, service_id, date, status

Relacje:
- User -> Appointments (1:N)
- Service -> Appointments (1:N)

Użytkownicy (users)
-------------------
    PK id
    name
    email (UNIQUE)
    password (HASH)
    role ('client' / 'admin')



Wizyty (appointments)
---------------------
    PK id
    FK user_id
    FK service_id
    date (YYYY-MM-DD HH:MM)
    status ('pending', 'confirmed', 'cancelled')



Usługi (services)
-----------------
    PK id
    name
    price
    duration (w minutach)

## 3. Struktura API
## Auth
- `POST /api/auth/register` - Rejestracja nowego użytkownika
- `POST /api/auth/login` - Logowanie użytkownika

## Usługi
- `GET /api/services` - Pobiera listę dostępnych usług

## Rezerwacje
- `GET /api/slots?date=...&service_id=...` - Pobiera wolne godziny dla danej daty
- `POST /api/appointments` - Tworzy nową rezerwację
- `GET /api/appointments/:userId` - Pobiera historię wizyt użytkownika
- `DELETE /api/appointments/:id` - Anuluje wizytę

## Admin
- `GET /api/admin/appointments` - Pobiera wszystkie wizyty do kalendarza
- `PUT /api/appointments/:id/status` - Zmienia status wizyty (potwierdzenie/zakończenie)


## 4. Lista Zadań

### Backend 
- [x] Inicjalizacja projektu (npm init)
- [x] Konfiguracja serwera Express.js
- [x] Połączenie z bazą SQLite
- [x] API: Logowanie i Rejestracja 
- [x] API: Pobieranie i rezerwacja terminów 
- [x] API: Panel Administratora

### Frontend 
- [x] Strona główna 
- [x] Podstrony: Oferta, O nas, Kontakt
- [x] Logowanie i Rejestracja
- [x] Panel Klienta 
- [x] Panel Administratora 
- [x] Stylowanie 

### Testy i Poprawki
- [x] Testowanie walidacji formularzy
- [x] Sprawdzenie blokady rezerwacji w weekendy
- [x] Poprawa responsywności na telefonach


