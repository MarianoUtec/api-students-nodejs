const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("students.sqlite");

db.serialize(() => {
  db.run(
    `CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    gender TEXT NOT NULL,
    age TEXT
  )`,
    (err) => {
      if (err) {
        console.error("Error creando la tabla:", err.message);
      } else {
        console.log("Base de datos y tabla creadas correctamente.");
      }
      db.close();
    },
  );
});
