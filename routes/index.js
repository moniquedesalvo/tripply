var express = require('express');
var router = express.Router();
var request = require('request');


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
            		image: parsedBody.listing.picture_url,
            		description: parsedBody.listing.name
            };
            callback(choices);
        }
    });
}

module.exports = router;
