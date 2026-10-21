BEGIN;

-- 5 uzytkownikow.
-- Hasla sa fikcyjnymi wartosciami tylko do testow.
INSERT INTO users (username, email, password_hash, created_at)
VALUES
    ('admin', 'admin@example.com', 'hash-placeholder-1', CURRENT_TIMESTAMP),
    ('anna', 'anna@example.com', 'hash-placeholder-2', CURRENT_TIMESTAMP),
    ('piotr', 'piotr@example.com', 'hash-placeholder-3', CURRENT_TIMESTAMP),
    ('maria', 'maria@example.com', 'hash-placeholder-4', CURRENT_TIMESTAMP),
    ('jan', 'jan@example.com', 'hash-placeholder-5', CURRENT_TIMESTAMP);

-- 5 zadan. Identyfikatory uzytkownikow pobieramy z tabeli users.
INSERT INTO tasks (
    title, description, status, created_at, due_date, user_id
)
VALUES
    (
        'Przygotowac makiete', 'Ekran listy i formularza', 'done',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '3 days',
        (SELECT user_id FROM users WHERE username = 'admin')
    ),
    (
        'Stworzyc frontend', 'Przygotowac HTML i CSS', 'todo',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days',
        (SELECT user_id FROM users WHERE username = 'anna')
    ),
    (
        'Stworzyc backend', 'Przygotowac API aplikacji', 'in_progress',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '10 days',
        (SELECT user_id FROM users WHERE username = 'piotr')
    ),
    (
        'Przetestowac aplikacje', 'Sprawdzic dodawanie zadan', 'todo',
        CURRENT_TIMESTAMP, NULL,
        (SELECT user_id FROM users WHERE username = 'maria')
    ),
    (
        'Napisac dokumentacje', 'Opisac uruchomienie projektu', 'todo',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '14 days',
        (SELECT user_id FROM users WHERE username = 'jan')
    );

-- 5 komentarzy powiazanych z zadaniami i uzytkownikami.
INSERT INTO comment (content, created_at, user_id, task_id)
SELECT
    'Makieta jest gotowa.', CURRENT_TIMESTAMP, user_id, task_id
FROM tasks
WHERE title = 'Przygotowac makiete'
  AND user_id = (SELECT user_id FROM users WHERE username = 'admin');

INSERT INTO comment (content, created_at, user_id, task_id)
SELECT
    'Rozpoczynam prace nad wygladem.', CURRENT_TIMESTAMP, user_id, task_id
FROM tasks
WHERE title = 'Stworzyc frontend'
  AND user_id = (SELECT user_id FROM users WHERE username = 'anna');

INSERT INTO comment (content, created_at, user_id, task_id)
SELECT
    'API jest w trakcie przygotowania.', CURRENT_TIMESTAMP, user_id, task_id
FROM tasks
WHERE title = 'Stworzyc backend'
  AND user_id = (SELECT user_id FROM users WHERE username = 'piotr');

INSERT INTO comment (content, created_at, user_id, task_id)
SELECT
    'Testy wykonam po zakonczeniu implementacji.',
    CURRENT_TIMESTAMP, user_id, task_id
FROM tasks
WHERE title = 'Przetestowac aplikacje'
  AND user_id = (SELECT user_id FROM users WHERE username = 'maria');

INSERT INTO comment (content, created_at, user_id, task_id)
SELECT
    'Dodam instrukcje uruchomienia.', CURRENT_TIMESTAMP, user_id, task_id
FROM tasks
WHERE title = 'Napisac dokumentacje'
  AND user_id = (SELECT user_id FROM users WHERE username = 'jan');

COMMIT;

-- Sprawdzenie danych.
SELECT * FROM users;
SELECT * FROM tasks;
SELECT * FROM comment;