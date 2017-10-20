import { apiKeys } from '../config.js';

Meteor.methods({
    //Searchs through artists using a query string 
    //query = artist name in a string form
    songKickSearchArtists: function (query) {
        this.unblock();
        try {
            const response = HTTP.call('GET', options.url + '/search/artists.json?',
                {
                    params: {
                        'query': query,
                        'apikey': options.key,
                    }
                });
            return response.data.resultsPage.results;
        }
        catch (ex) {
            return ex;
        }
    },
    //Fetches all concerts for an artist 
    //aritistID = songkick artistID 
    songKickFetchConcerts: function (artistID) {
        this.unblock();
        try {
            const response = HTTP.call('GET', options.url + '/artists/' + artistID.toString() + '/calendar.json',
                {
                    params: {
                        'apikey': options.key,
                    }
                });
            return response.data.resultsPage.results;
        }
        catch (ex) {
            return ex;
        }
    },
    //Fetches all concerts for an artist in a date range
    //Date range cannot be an already passed date
    songKickFetchConcertsWithDate:function(artistID,startDate,endDate){
        this.unblock();
        try {
            const response = HTTP.call('GET', options.url + '/artists/' + artistID.toString() + '/calendar.json',
                {
                    params: {
                        'apikey': options.key,
                        'min_date':startDate,
                        'max_date':endDate
                    }
                });
            return response.data.resultsPage.results;
        }
        catch (ex) {
            return ex;
        }
    },
    //Use to get the closest metroarea, then use metroarea ID to find concerts
    songKickSearchLocation: function (query) { 
        this.unblock();
        try {
            const response = HTTP.call('GET', options.url + '/search/locations.json?',
                {
                    params: {
                        'location': 'geo:' + query,
                        'apikey': options.key,
                    }
                });
            return response.data.resultsPage.results;

        }
        catch (ex) {
            return ex;
        }
    },
    //metro_areas/{metro_area_id}/calendar.json?
    songKickFetchConcertsMetro: function (metroID) {
        this.unblock();
        try {
            const response = HTTP.call('GET', options.url + '/metro_areas/' + metroID.toString() + '/calendar.json',
                {
                    params: {
                        'apikey': options.key,
                    }
                });
            return response.data.resultsPage.results;
        }
        catch (ex) {
            return ex;
        }
    }
});

var options = {
    key: apiKeys.songKickKey,
    url: 'http://api.songkick.com/api/3.0',
}