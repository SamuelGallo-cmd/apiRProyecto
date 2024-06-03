import { connection } from "../services/connection.js";

const { schema } = connection;

await schema.dropTableIfExists('usuarios');
await schema.dropTableIfExists('recetas');

await schema.createTable('usuarios', (table) => {
    table.increments('id').primary();
    table.text('name').notNullable();
    table.text('last_name').nullable();
    table.text('email').notNullable().unique();
    table.text('password').notNullable();
    table.text('created_at').notNullable();
});

await schema.createTable('recetas', (table) => {
    table.increments('id').primary();
    table.text('nombre').notNullable();
    table.text('descripcion').notNullable();
    table.specificType('ingredientes', 'text[]').notNullable();
    table.specificType('pasos', 'text[]').notNullable();
    table.text('created_at').notNullable();
    table.integer('id_usuario').notNullable().references('id').inTable('usuarios');
});


await connection.table('usuarios').insert([{
    name: 'Admin',
    last_name: 'Admin',
    email: 'admin@una.cr',
    password: '1234',
    created_at: new Date().toISOString(),
}]);

process.exit();
