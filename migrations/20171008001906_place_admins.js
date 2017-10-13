
exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('place_admins', function(table) {
        table.integer('place_id').unsigned();
        table.foreign('place_id').references('places.id').onDelete('CASCADE');
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id').onDelete('CASCADE');
        table.primary(['place_id', 'user_id']);
    })
};

exports.down = function(knex, Promise) {  
    return knex.schema.dropTable('place_admins')
};


