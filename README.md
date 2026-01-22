# Neon Detailing - System Rezerwacji

Profesjonalna aplikacja webowa do obsługi studia auto detailingu. System umożliwia klientom przeglądanie oferty i rezerwację terminów online, a administratorowi zarządzanie harmonogramem prac.

## Główne Funkcjonalności

### Panel Klienta
* **Rejestracja i Logowanie:** Bezpieczne uwierzytelnianie użytkowników.
* **Rezerwacja Wizyt:** Wybór usługi, daty i godziny (z walidacją weekendów i zajętych terminów).
* **Historia Wizyt:** Przegląd nadchodzących i zakończonych usług.
* **Anulowanie:** Możliwość odwołania wizyty (do 48h przed terminem).

### Panel Administratora
* **Dashboard:** Statystyki wizyt (oczekujące, potwierdzone, dzisiejsze).
* **Kalendarz Graficzny:** Wizualny podgląd harmonogramu na najbliższe 7 dni.
* **Zarządzanie:** Potwierdzanie, kończenie lub anulowanie wizyt klientów.

## Technologie

**Backend:**
* Node.js
* Express.js 
* SQLite3 
* Bcrypt 

**Frontend:**
* HTML5, CSS3 
* JavaScript 

## Wymagania

* Node.js (wersja 14 lub nowsza)
* npm (Node Package Manager)

## Instalacja i Uruchomienie

Projekt zawiera już **wstępnie skonfigurowaną bazę danych** z kontem administratora. Nie ma potrzeby uruchamiania skryptów inicjalizujących (`seed.js`), aby nie nadpisać istniejących danych.

1. **Zainstaluj zależności:**
   Otwórz terminal w folderze projektu i wpisz:
   ```bash
   npm install

2. **Uruchom serwer:**
   W terminalu wpisz:
   ```bash
   npm start

3. **Otwórz aplikację:**
   Przejdź w przeglądarce pod adres: http://localhost:3000


## Konto administratora do testów

W bazie danych istnieje już skonfigurowane konto z uprawnieniami administratora. Aby dostać się do panelu zarządzania, zaloguj się przy użyciu istniejącego konta administratora:

    Email: admin@email.com
    Hasło: admin123

Uwaga: System automatycznie wykrywa rolę użytkownika i po zalogowaniu na powyższe dane przekieruje Cię bezpośrednio do admin_panel.html.


## Jako że nie tworzyłem nowego repozytorium dla drugiego projektu tylko rozszerzałem obecny projekt, kopia pierwszego projektu jest w drugim branchu "Pierwszy-projekt"