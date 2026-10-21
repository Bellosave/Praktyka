-- 1. Loginy i adresy e-mail uzytkownikow,
-- posortowane alfabetycznie po loginie.
SELECT username, email
FROM users
ORDER BY username ASC;

-- 2. Tytuly i statusy zakonczonych zadan.
SELECT title, status
FROM tasks
WHERE status = 'done';

-- 3. Liczba zadan w kazdym statusie,
-- od najwiekszej liczby.
SELECT status, COUNT(*) AS task_count
FROM tasks
GROUP BY status
ORDER BY task_count DESC;

-- 4. Tytul kazdego zadania i login jego autora.
SELECT t.title, u.username
FROM tasks AS t
JOIN users AS u ON t.user_id = u.user_id;