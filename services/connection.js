import knex from "knex";
import fs from "fs";
import path from "path";

// Ruta del archivo de la base de datos
const dbPath = path.resolve('database', 'db.sqlite3');

// Crear el directorio si no existe
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

export const connection = knex({
    client: 'better-sqlite3',
    connection: {
        filename: dbPath,
    },
    useNullAsDefault: true,
});

connection.on('query', ({ sql, bindings }) => {
    const query = connection.raw(sql, bindings).toQuery();
    console.log('[DB]--->', query);
});
