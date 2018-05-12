exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('queue_users', function(table) {
    table.increments('position');
    table.integer('queue_id');
    table.foreign('queue_id').references('queues.id').onDelete('CASCADE');
    table.integer('user_id');
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.unique(['queue_id', 'user_id']);
    table.index('user_id');
    table.index('queue_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('queue_users');
};