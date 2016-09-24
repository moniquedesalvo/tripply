exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('trip', function(table) {
            table.increments();
            table.string('title');
            table.string('tripLinkId');
            table.string('details');
        })
    ])

    .then(function() {
        return knex.schema.createTable('choices', function(table) {
            table.increments();
            table.integer('trip_id').references('trip.id').onDelete('CASCADE');
            table.string('location');
            table.string('price');
            table.string('image');
            table.string('description');
            table.integer('likes');
            table.string('link');
            table.boolean('booked');
        });
    })
    .then(function() {
        return knex.schema.createTable('images', function(table) {
            table.increments();
            table.integer('choices_id').references('choices.id').onDelete('CASCADE');
            table.string('image');
        });
    })
    .then(function() {
        return knex.schema.createTable('attendees', function(table) {
            table.increments();
            table.integer('trip_id').references('trip.id').onDelete('CASCADE');
            table.string('name');
            table.string('status');
            table.string('notes');
        });
    })
    .then(function() {
        return knex.schema.createTable('packing', function(table) {
            table.increments();
            table.integer('trip_id').references('trip.id').onDelete('CASCADE');
            table.string('thingsToBring');
            table.boolean('whosBringingIt');;
            table.string('notes');
        });
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('trip')
    .then(function() {
        return Promise.all([
            knex.schema.dropTable('choices'),
            knex.schema.dropTable('images'),
            knex.schema.dropTable('attendees'),
            knex.schema.dropTable('packing')
        ])
    })
};