exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('trip', function(table) {
            table.increments();
            table.string('title');
            table.string('tripLinkId').notNullable().unique();
            table.text('details');
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
            table.text('images');
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
            table.string('whosBringingIt');;
            table.string('notes');
        });
    })
}

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('packing'),
        knex.schema.dropTable('attendees'),
        knex.schema.dropTable('images')
     ])
    .then(function() {
        return Promise.all([
            knex.schema.dropTable('choices')
        ])
    })
    .then(function() {
        return Promise.all([
            knex.schema.dropTable('trip')
        ])
    })
};