
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

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });

  res.end(JSON.stringify(data));
}

async function readBody(req) {
  let body = "";

  for await (const chunk of req) {
    body += chunk;

    if (body.length > 10000) {
      throw new Error("Request too large");
    }
  }

  return JSON.parse(body);
}

function validTitle(title) {
  return typeof title === "string" &&
    title.trim().length >= 3 &&
    title.trim().length <= 100;
}

const server = http.createServer(async (req, res) => {
  const pathname = new URL(
    req.url,
    "http://localhost"
  ).pathname;

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    return res.end();
  }

  try {
    // GET - pobierz zadania
    if (req.method === "GET" && pathname === "/api/tasks") {
      const result = await pool.query(
        "SELECT id, title, description, status FROM tasks ORDER BY id"
      );

      return sendJson(res, 200, result.rows);
    }

    // POST - dodaj zadanie
    if (req.method === "POST" && pathname === "/api/tasks") {
      let body;

      try {
        body = await readBody(req);
      } catch {
        return sendJson(res, 400, {
          error: "Niepoprawne dane JSON"
        });
      }

      if (!validTitle(body?.title)) {
        return sendJson(res, 400, {
          error: "Tytuł musi mieć od 3 do 100 znaków"
        });
      }

      const result = await pool.query(
        `INSERT INTO tasks (title)
         VALUES ($1)
         RETURNING id, title, description, status`,
        [body.title.trim()]
      );

      return sendJson(res, 201, result.rows[0]);
    }

    const match = pathname.match(/^\/api\/tasks\/(\d+)$/);

    if (match) {
      const id = Number(match[1]);

      // PUT - aktualizuj zadanie
      if (req.method === "PUT") {
        let body;

        try {
          body = await readBody(req);
        } catch {
          return sendJson(res, 400, {
            error: "Niepoprawne dane JSON"
          });
        }

        if (!validTitle(body?.title)) {
          return sendJson(res, 400, {
            error: "Niepoprawny tytuł zadania"
          });
        }

        const result = await pool.query(
          `UPDATE tasks SET title = $1
           WHERE id = $2
           RETURNING id, title, description, status`,
          [body.title.trim(), id]
        );

        if (result.rowCount === 0) {
          return sendJson(res, 404, {
            error: "Nie znaleziono zadania"
          });
        }

        return sendJson(res, 200, result.rows[0]);
      }

      // DELETE - usuń zadanie
      if (req.method === "DELETE") {
        const result = await pool.query(
          "DELETE FROM tasks WHERE id = $1 RETURNING id",
          [id]
        );

        if (result.rowCount === 0) {
          return sendJson(res, 404, {
            error: "Nie znaleziono zadania"
          });
        }

        return sendJson(res, 200, {
          message: "Zadanie usunięte"
        });
      }
    }

    return sendJson(res, 404, {
      error: "Nie znaleziono endpointu"
    });
  } catch (error) {
    console.error("Database/API error:", error);

    return sendJson(res, 500, {
      error: "Błąd serwera"
    });
  }
});

pool.query("SELECT 1")
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Backend działa: http://localhost:${PORT}`);
      console.log("Połączono z PostgreSQL");
    });
  })
  .catch((error) => {
    console.error("Błąd połączenia z PostgreSQL:", error.message);
    process.exitCode = 1;
    pool.end();
  });
