
exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('places', function(table) {
        table.increments('id').primary();
        table.string('name');
    })
};

exports.down = function(knex, Promise) {  
    return knex.schema.dropTable('places')
};