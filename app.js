const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();

// Para poder leer datos enviados como form-data / x-www-form-urlencoded (como request.form en Flask)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function dbConnection() {
  return new sqlite3.Database("students.sqlite");
}

// Rutas para /students (GET todos, POST uno nuevo)
app
  .route("/students")
  .get((req, res) => {
    const db = dbConnection();
    db.all("SELECT * FROM students", [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      const students = rows.map((row) => ({
        id: row.id,
        firstname: row.firstname,
        lastname: row.lastname,
        gender: row.gender,
        age: row.age,
      }));
      res.json(students);
      db.close();
    });
  })
  .post((req, res) => {
    const { firstname, lastname, gender, age } = req.body;
    const db = dbConnection();
    const sql = `INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)`;
    db.run(sql, [firstname, lastname, gender, age], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.send(`Student with id: ${this.lastID} created successfully`);
      db.close();
    });
  });

// Rutas para /student/:id (GET uno, PUT actualizar, DELETE eliminar)
app
  .route("/student/:id")
  .get((req, res) => {
    const db = dbConnection();
    db.get(
      "SELECT * FROM students WHERE id = ?",
      [req.params.id],
      (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
          res.status(200).json(row);
        } else {
          res.status(404).send("Something went wrong");
        }
        db.close();
      },
    );
  })
  .put((req, res) => {
    const { firstname, lastname, gender, age } = req.body;
    const id = req.params.id;
    const db = dbConnection();
    const sql = `UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?`;
    db.run(sql, [firstname, lastname, gender, age, id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, firstname, lastname, gender, age });
      db.close();
    });
  })
  .delete((req, res) => {
    const id = req.params.id;
    const db = dbConnection();
    db.run("DELETE FROM students WHERE id = ?", [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).send(`The Student with id: ${id} has been deleted.`);
      db.close();
    });
  });

app.listen(8000, "0.0.0.0", () => {
  console.log("Servidor Node.js corriendo en el puerto 8000");
});
