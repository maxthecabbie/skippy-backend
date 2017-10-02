
exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('queues', function(table) {
        table.increments('id').primary();
        table.integer('place_id').unsigned().index();
        table.foreign('place_id').references('places.id').onDelete('CASCADE');
        table.string('name');
    })
};

exports.down = function(knex, Promise) {  
    return knex.schema.dropTable('queues')
};