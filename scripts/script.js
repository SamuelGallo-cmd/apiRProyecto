import { connection } from "../services/connection.js";

const { schema } = connection;

await schema.dropTableIfExists('usuarios');
await schema.dropTableIfExists('recetas');
await schema.dropTableIfExists('categoriasR');
await schema.dropTableIfExists('categorias');




await schema.createTable('usuarios', (table) => {
    table.increments('id').primary();
    table.text('name').notNullable();
    table.text('last_name').nullable();
    table.text('email').notNullable().unique();
    table.text('password').notNullable();
    table.text('created_at').notNullable();
});



await schema.createTable('categoriasR', (table) => {
    table.increments('id').primary();
    table.text('titulo').nullable();
    table.text('descripcion').notNullable();
    table.text('created_at').notNullable();
});






await schema.createTable('recetas', (tabla) => {
    tabla.increments('id').primary();
    tabla.text('nombre').notNullable();
    tabla.text('descripcion').notNullable();
    tabla.specificType('ingredientes', 'text[]').notNullable();
    tabla.specificType('pasos', 'text[]').notNullable();
    tabla.text('created_at').notNullable();
    tabla.integer('id_categoria').notNullable().references('id').inTable('categoriasR');
    tabla.integer('id_usuario').notNullable().references('id').inTable('usuarios');
    tabla.text('imagen').nullable();
});





await connection.table('usuarios').insert([{ 
    name: 'Admin',
    last_name: 'Admin',
    email: 'admin@una.cr',
    password: '1234',
    created_at: new Date().toISOString(),
}]);

await connection.table('categoriasR').insert([{
    titulo: 'Tipica',
    descripcion: 'Comida de Costa Rica',
    created_at: new Date().toISOString(),
}]);



await connection.table('categoriasR').insert([{
    titulo: 'Asian food',
    descripcion: 'Comida Oriental',
    created_at: new Date().toISOString(),
}]);


await connection.table('recetas').insert([{
    nombre: 'Arroz con huevo',
    descripcion: 'Un delicioso arroz tradicional',
    ingredientes: 'huevo, arroz, matequilla',
    pasos: 'asdfsdfasdasafsfasdfasdf',
    imagen:'https://th.bing.com/th/id/R.1efaed21659ae63e6674e0b351c70aa0?rik=1VEMXUXCXcxHKw&pid=ImgRaw&r=0',
    created_at: new Date().toISOString(),
    id_usuario: '1',
    id_categoria: '1'
}]);

process.exit();
