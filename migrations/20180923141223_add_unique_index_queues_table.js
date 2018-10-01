exports.up = function(knex, Promise) {
  return knex.schema.alterTable('queues', function(table) {
    table.unique(['place_id', 'name']);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('queues', function(table) {
    table.dropUnique(['place_id', 'name']);
  });
};