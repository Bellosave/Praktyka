
require("dotenv").config();

const http = require("node:http");
const { Pool } = require("pg");

const PORT = Number(process.env.PORT) || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

const allowedStatuses = ["todo", "in_progress", "done"];

// Wysyłanie odpowiedzi JSON
function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });

  res.end(JSON.stringify(data));
}

// Odczytywanie JSON z żądania
async function readBody(req) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;

    if (size > 10000) {
      const error = new Error("Zbyt duże żądanie");
      error.status = 413;
      throw error;
    }

    chunks.push(chunk);
  }

  try {
    return JSON.parse(
      Buffer.concat(chunks).toString("utf8")
    );
  } catch {
    const error = new Error("Niepoprawny format JSON");
    error.status = 400;
    throw error;
  }
}

// Sprawdzanie danych zadania
function validateTask(body) {
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    typeof body.title !== "string" ||
    body.title.trim().length < 3 ||
    body.title.trim().length > 100
  ) {
    return "Tytuł musi mieć od 3 do 100 znaków.";
  }

  if (
    body.description !== undefined &&
    body.description !== null &&
    typeof body.description !== "string"
  ) {
    return "Niepoprawny opis zadania.";
  }

  if (!allowedStatuses.includes(body.status)) {
    return "Nieprawidłowy status zadania.";
  }

  return null;
}

// Obsługa API
const server = http.createServer(async (req, res) => {
  const pathname = new URL(
    req.url,
    "http://localhost"
  ).pathname;

  if (req.method === "OPTIONS") {
    return sendJson(res, 204, null);
  }

  try {
    // GET - pobieranie wszystkich zadań
    if (
      req.method === "GET" &&
      pathname === "/api/tasks"
    ) {
      const result = await pool.query(
        `SELECT id, title, description, status
         FROM tasks
         ORDER BY id ASC`
      );

      return sendJson(res, 200, result.rows);
    }

    // POST - tworzenie zadania
    if (
      req.method === "POST" &&
      pathname === "/api/tasks"
    ) {
      const body = await readBody(req);
      const error = validateTask(body);

      if (error) {
        return sendJson(res, 400, { error });
      }

      const result = await pool.query(
        `INSERT INTO tasks (title, description, status)
         VALUES ($1, $2, $3)
         RETURNING id, title, description, status`,
        [
          body.title.trim(),
          body.description?.trim() || null,
          body.status
        ]
      );

      return sendJson(res, 201, result.rows[0]);
    }

    // Operacje dla konkretnego zadania
    const match = pathname.match(
      /^\/api\/tasks\/(\d+)$/
    );

    if (match) {
      const id = Number(match[1]);

      if (!Number.isSafeInteger(id) || id < 1) {
        return sendJson(res, 400, {
          error: "Niepoprawne ID zadania."
        });
      }

      // PUT - edycja tytułu, opisu i statusu
      if (req.method === "PUT") {
        const body = await readBody(req);
        const error = validateTask(body);

        if (error) {
          return sendJson(res, 400, { error });
        }

        const result = await pool.query(
          `UPDATE tasks
           SET title = $1,
               description = $2,
               status = $3
           WHERE id = $4
           RETURNING id, title, description, status`,
          [
            body.title.trim(),
            body.description?.trim() || null,
            body.status,
            id
          ]
        );

        if (result.rowCount === 0) {
          return sendJson(res, 404, {
            error: "Nie znaleziono zadania."
          });
        }

        return sendJson(res, 200, result.rows[0]);
      }

      // DELETE - usuwanie zadania
      if (req.method === "DELETE") {
        const result = await pool.query(
          "DELETE FROM tasks WHERE id = $1 RETURNING id",
          [id]
        );

        if (result.rowCount === 0) {
          return sendJson(res, 404, {
            error: "Nie znaleziono zadania."
          });
        }

        return sendJson(res, 200, {
          message: "Zadanie zostało usunięte."
        });
      }
    }

    return sendJson(res, 404, {
      error: "Nie znaleziono endpointu."
    });
  } catch (error) {
    console.error("API error:", error);

    if (error.status === 400 || error.status === 413) {
      return sendJson(res, error.status, {
        error: error.message
      });
    }

    return sendJson(res, 500, {
      error: "Błąd serwera."
    });
  }
});

// Sprawdzenie połączenia z PostgreSQL
pool.query("SELECT 1")
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Backend działa: http://localhost:${PORT}`);
      console.log("Połączono z PostgreSQL");
    });
  })
  .catch((error) => {
    console.error(
      "Błąd połączenia z PostgreSQL:",
      error.message
    );
    process.exitCode = 1;
    pool.end();
  });
