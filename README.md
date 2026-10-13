# Internetowy system zarządzania zadaniami

## Opis projektu

W ramach praktyk przygotowuję aplikację internetową do zarządzania zadaniami.
Chcę, żeby użytkownik mógł zapisywać rzeczy do zrobienia i sprawdzać,
które zadania zostały już wykonane.

Projekt jest na początkowym etapie. Na razie przygotowałem strukturę
repozytorium, a teraz opisuję, jak ma działać aplikacja.

## Cel projektu

Chcę stworzyć prosty system, który pomoże uporządkować zadania w jednym miejscu.

Podczas pracy nad projektem chcę nauczyć się tworzyć strony internetowe,
łączyć je z serwerem i korzystać z bazy danych. Ćwiczę też pracę z Git,
GitHub i pisanie dokumentacji w Markdown.

## Planowane funkcjonalności

W aplikacji planuję dodać możliwość:
- wyświetlania listy zadań;
- dodawania zadania z tytułem i opisem;
- edytowania zadania;
- zmiany statusu zadania;
- usuwania zadania;
- wyszukiwania i filtrowania zadań.

Są to planowane funkcje. Nie zostały jeszcze zaimplementowane.

## Technologie

- **HTML** — do przygotowania struktury strony.
- **CSS** — do ustawienia wyglądu strony.
- **JavaScript** — do obsługi interakcji i wysyłania żądań do API.
- **PostgreSQL** — planowana baza danych do przechowywania zadań.
- **Git i GitHub** — do zapisywania historii zmian i pracy z gałęziami.
- **GitHub Actions** — do automatycznego sprawdzania plików projektu.

Technologia backendu nie została jeszcze ustalona.

W poprzednim zadaniu przygotowałem prostą stronę i uruchomiłem sprawdzanie
HTML, CSS i JavaScript. Te pliki znajdują się w gałęzi `introduce-to-ci`.
Nie zostały jeszcze scalone do `main`.

## Struktura projektu

```text
Praktyka/
├── .github/
│   └── workflows/
├── frontend/
├── backend/
├── database/
├── docs/
├── tests/
├── .gitignore
└── README.md
```

- `frontend/` — tutaj będę tworzyć część widoczną dla użytkownika.
- `backend/` — tutaj planuję przygotować część serwerową.
- `database/` — miejsce na pliki związane z bazą danych.
- `docs/` — miejsce na dodatkową dokumentację.
- `tests/` — miejsce na testy aplikacji.
- `.github/workflows/` — miejsce na pliki automatycznych kontroli.

## Dokumentacja

Dokładniejszy opis poszczególnych części projektu przygotowuję w plikach:
- [README frontendu](frontend/README.md);
- [README backendu](backend/README.md).

## Uruchomienie

Pełna aplikacja nie jest jeszcze gotowa do uruchomienia.
Instrukcję dodam, gdy przygotuję działające części projektu
i połączę je z bazą danych.