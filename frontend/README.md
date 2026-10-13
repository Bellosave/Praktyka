# Frontend

## Przeznaczenie

Frontend to część aplikacji, którą użytkownik widzi w przeglądarce.
Tutaj planuję wyświetlać zadania i formularze do ich dodawania oraz edycji.

Chcę, żeby strona była prosta i czytelna. Użytkownik powinien łatwo
znaleźć potrzebne przyciski i sprawdzić status zadania.

## Planowane widoki

Planuję przygotować:
- listę zadań z ich tytułami i statusami;
- formularz dodawania zadania;
- formularz edycji zadania;
- pole wyszukiwania i filtr statusu.

Przed usunięciem zadania chcę wyświetlać pytanie o potwierdzenie.

## Technologie

- **HTML** — do tworzenia struktury strony i formularzy.
- **CSS** — do ustawienia kolorów, odstępów i układu strony.
- **JavaScript** — do obsługi przycisków i komunikacji z backendem.

## Pomysły dotyczące wyglądu i obsługi

Chcę zastosować jasne tło i czytelne napisy.
Zadania będą miały tekstowe oznaczenia statusu, żeby można było
je rozpoznać bez polegania tylko na kolorach.

Planuję dopasować układ strony do komputera i telefonu.
Przy formularzach chcę dodać podpisy pól oraz komunikaty,
np. gdy użytkownik nie wpisze tytułu zadania.

## Komunikacja z backendem

Planuję używać funkcji `fetch` w JavaScript do wysyłania żądań do API.
Frontend będzie pobierać zadania i wysyłać dane z formularzy.
Dane będą przesyłane w formacie JSON.

Jeśli wystąpi błąd, chcę pokazać użytkownikowi zrozumiały komunikat.

## Proponowana struktura

```text
frontend/
├── css/
│   └── style.css
├── js/
│   └── app.js
├── images/
├── index.html
└── README.md
```

- `index.html` — główna strona aplikacji.
- `css/style.css` — wygląd strony.
- `js/app.js` — obsługa interakcji i żądań do API.
- `images/` — miejsce na obrazy, jeśli będą potrzebne.
- `README.md` — dokumentacja frontendu.

Jest to planowana struktura. Nie wszystkie pliki i foldery
istnieją obecnie w tej gałęzi.

## Aktualny stan

Przygotowałem prostą stronę z przyciskiem wyświetlającym komunikat.
Jej pliki zostały scalone do gałęzi `main`.

Widoki zarządzania zadaniami oraz połączenie z API
nie zostały jeszcze przygotowane.