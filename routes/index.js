var express = require('express');
var router = express.Router();
var request = require('request');
var pg = require('pg');
var knex = require('../db/knex');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/airbnbInfo', function(req, res, next) {
	var url = req.query.url;
	var splitUrl = url.split('?')[0];
	var listingId = splitUrl.split('https://www.airbnb.com/rooms/')[1];
	getAirbnbListing(listingId, function(data) {
		res.json(data);
	});
});

function getAirbnbListing(listingId, callback) {
    var listingUrl = "https://api.airbnb.com/v2/listings/" + listingId + "?client_id=3092nxybyb0otqw18e8nh5nty&_format=v1_legacy_for_p3";
    var options = {
        headers: {
            'user-agent': 'node.js'
        }
    }
    request(listingUrl, options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var parsedBody = JSON.parse(body)
            var choices = {
        		location: parsedBody.listing.smart_location,
        		price: parsedBody.listing.price_formatted,
        		image: parsedBody.listing.xl_picture_url,
        		description: parsedBody.listing.name,
                images: parsedBody.listing.picture_urls.join('\n')
        };
            callback(choices);
        }
    });
}

router.get('/:id/trip' , function (req, res, next) {
    knex('trip').select().where('tripLinkId', req.params.id).then(function(trips) {
        var trip = trips[0];
        knex('choices').select().where('trip_id', trip.id).orderBy('id').then(function(choices) {
            knex('attendees').select().where('trip_id', trip.id).orderBy('id').then(function(attendees) {
                knex('packing').select().where('trip_id', trip.id).orderBy('id').then(function(packing) {
                    res.json({
                        trip: trip,
                        choices: choices,
                        attendees: attendees,
                        packing: packing
                    });
                })
            })
        })
    })
})

var generateLinkId = function () {
    var tripLink = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 6; i++) {
        tripLink += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return tripLink;
}

router.get('/newTrip', function (req, res, next) {
    var newTripLink = generateLinkId();
    knex('trip').insert({tripLinkId: newTripLink, title: ""}).returning(['id']).then(function(trip) {
        knex('choices').insert({trip_id: trip[0].id}).then(function(choice) {
            knex('choices').insert({trip_id: trip[0].id}).then(function(choice) {
                knex('choices').insert({trip_id: trip[0].id}).then(function(choice) {
                    res.redirect(newTripLink);
                })
            })
        })
    })
})

router.get('/:tripLinkId', function (req, res, next) {
    res.sendFile('mockup.html', {root: 'public'});
})

router.post('/:tripLinkId/title', function (req, res, next) {
    knex('trip').update({title: req.body.title}).where({tripLinkId: req.params.tripLinkId}).then(function(data) {
        res.send('👍');
    })
})

router.post('/:tripLinkId/details', function (req, res, next) {
    knex('trip').update({details: req.body.details})
    .where({tripLinkId: req.params.tripLinkId})
        .then(function(data) {
            res.send('👍');
        })
})

router.post('/choices/:choiceId', function (req, res, next) {
    knex('choices').update({
        location: req.body.location,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
        likes: req.body.likes,
        link: req.body.link,
        booked: req.body.booked,
        images: req.body.images
    }).where({id: req.params.choiceId})
        .then(function(data) {
            res.send('👍');
        })
})

router.post("/:tripLinkId/attendees/create", function (req, res, next) {
    // do something with knex to insert a new attendees row
    console.log('got here')
    knex('trip').select().where('tripLinkId', req.params.tripLinkId).then(function(trips) {
        var trip = trips[0];
        knex('attendees').insert({
            name: req.body.name,
            status: req.body.status,
            notes: req.body.notes,
            trip_id: trip.id
        }).returning(['id']).then(function(data) {
            res.json(data[0].id);
        })
    })
});

router.post('/attendees/:attendeeId', function (req, res, next) {
    knex('attendees').update({
        name: req.body.name,
        status: req.body.status,
        notes: req.body.notes
    }).where({id: req.params.attendeeId})
        .then(function(data) {
            res.send('👍');
        })
})

router.post('/packing/:packingItemId', function (req, res, next) {
    knex('packing').update({
        thingsToBring: req.body.thingsToBring,
        whosBringingIt: req.body.whosBringingIt,
        notes: req.body.notes
    }).where({id: req.params.packingItemId})
        .then(function(data) {
            res.send('👍');
        })
})

router.post("/:tripLinkId/packingItem/create", function (req, res, next) {
    knex('trip').select().where('tripLinkId', req.params.tripLinkId).then(function(trips) {
        var trip = trips[0];
        knex('packing').insert({
            thingsToBring: req.body.thingsToBring,
            whosBringingIt: req.body.whosBringingIt,
            notes: req.body.notes,
            trip_id: trip.id
        }).returning(['id']).then(function(data) {
            console.log(data, 'this is data from packing')

            res.json(data[0].id);
        })
    })
});



module.exports = router;
