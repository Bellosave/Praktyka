-- Użytkownik z uprawnieniami tylko do odczytu
CREATE ROLE userek
    WITH LOGIN
    PASSWORD 'P@ssW0rD';

GRANT CONNECT ON DATABASE task_manager TO userek;
GRANT USAGE ON SCHEMA public TO userek;

GRANT SELECT
ON TABLE public.users, public.tasks, public.comment
TO userek;