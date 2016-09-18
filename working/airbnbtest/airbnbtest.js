var request = require('request');

function getAirbnbListing(listingId) {
    var listingUrl = "https://api.airbnb.com/v2/listings/" + listingId + "?client_id=3092nxybyb0otqw18e8nh5nty&_format=v1_legacy_for_p3";
    var options = {
        headers: {
            'user-agent': 'node.js'
        }
    }
    console.log(listingUrl)
    request(listingUrl, options, function (error, response, body) {
        console.log(error)
        console.log(response.statusCode)
        if (!error && response.statusCode == 200) {
            var parsedBody = JSON.parse(body)
            console.log(parsedBody.listing.name)
            console.log(parsedBody.listing.picture_url)
            console.log(parsedBody.listing.price_formatted)
            console.log(parsedBody.listing.smart_location)
        }
    })
}

getAirbnbListing(3857534);
