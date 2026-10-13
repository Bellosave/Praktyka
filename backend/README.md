# Backend

## Przeznaczenie

Backend to część aplikacji, która działa na serwerze.
Planuję wykorzystać go do obsługi zadań i komunikacji z bazą danych.

Gdy użytkownik doda lub zmieni zadanie na stronie, frontend wyśle
żądanie do backendu. Backend sprawdzi dane, wykona odpowiednią
operację i odeśle odpowiedź.

Technologia backendu nie została jeszcze ustalona.

## Komunikacja z bazą danych

W projekcie planuję korzystać z bazy PostgreSQL.
Baza będzie przechowywać zadania, np. ich identyfikator, tytuł,
opis i status.

Frontend nie będzie łączyć się bezpośrednio z bazą.
Dostęp do danych będzie obsługiwać backend.

Hasła i dane połączenia z bazą nie powinny być zapisywane
w dokumentacji ani wysyłane do repozytorium.

## Komunikacja z frontendem

Backend będzie udostępniać API, czyli adresy, pod które frontend
może wysyłać żądania.

Planuję przesyłać dane w formacie JSON.
Odpowiedź powinna informować, czy operacja się udała,
a w przypadku błędu zawierać odpowiedni komunikat.

## Planowane endpointy API

| Metoda | Adres | Planowane działanie |
|---|---|---|
| GET | `/api/tasks` | Pobranie listy zadań |
| POST | `/api/tasks` | Dodanie nowego zadania |
| PUT | `/api/tasks/{id}` | Aktualizacja zadania |
| DELETE | `/api/tasks/{id}` | Usunięcie zadania |

`{id}` oznacza identyfikator wybranego zadania.
Na przykład `/api/tasks/5` dotyczy zadania o identyfikatorze 5.

Zmianę statusu zadania planuję obsługiwać przez aktualizację
zadania metodą PUT.

## Sprawdzanie danych i obsługa błędów

Chcę, żeby backend sprawdzał, czy tytuł zadania nie jest pusty
i czy podany status jest dozwolony.

Jeśli zadanie nie istnieje, backend powinien zwrócić odpowiedź 404.
Jeśli przesłane dane są niepoprawne, powinien zwrócić odpowiedź 400.

Szczegóły odpowiedzi API ustalę podczas implementacji.

## Proponowana struktura

```text
backend/
├── Controllers/
├── Models/
├── Services/
├── Data/
├── Tests/
└── README.md
```

- `Controllers/` — obsługa żądań i odpowiedzi API.
- `Models/` — opis danych używanych w aplikacji.
- `Services/` — logika wykonywania operacji na zadaniach.
- `Data/` — komunikacja z bazą danych.
- `Tests/` — testy części serwerowej.
- `README.md` — dokumentacja backendu.

Jest to propozycja organizacji projektu.
Struktura może się zmienić po wyborze technologii backendu.

## Aktualny stan

Backend i połączenie z PostgreSQL nie są jeszcze przygotowane.
Na tym etapie opisuję ich planowane działanie.
Instrukcję uruchomienia dodam po rozpoczęciu implementacji.