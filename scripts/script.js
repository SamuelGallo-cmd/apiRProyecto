import { connection } from "../services/connection.js";

const { schema } = connection;

await schema.dropTableIfExists('usuarios');
await schema.dropTableIfExists('recetas');
await schema.dropTableIfExists('categorias')

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
    table.integer('categoria').nullable().references('id').inTable('categorias');
    table.integer('id_usuario').notNullable().references('id').inTable('usuarios');
    table.text('imagen').nullable();
});

await schema.createTable('categorias', (table) => {
    table.increments('id').primary();
    table.text('titulo').nullable();
    table.text('descripcion').notNullable();
    table.integer('recetas').nullable().references('id').inTable('recetas')
    table.text('created_at').notNullable();
});

await connection.table('usuarios').insert([{ 
    name: 'Admin',
    last_name: 'Admin',
    email: 'admin@una.cr',
    password: '1234',
    created_at: new Date().toISOString(),
}]);

await connection.table('recetas').insert([{
        nombre: 'Arroz con huevo',
        descripcion: 'Un delicioso arroz tradicional',
        ingredientes: '[huevo, arroz, matequilla]',
        pasos: 'asdfsdfasdasafsfasdfasdf',
        created_at: new Date().toISOString(),
        id_usuario: '1',

}]);

await connection.table('categorias').insert([{
    titulo: 'Asian food',
    descripcion: 'Comida Oriental',
    recetas: '1',
    created_at: new Date().toISOString(),
}]);
process.exit();